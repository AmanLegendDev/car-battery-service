import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import Service from "@/models/Service";
import Availability from "@/models/Availability";
import {
  generateBookingReference,
} from "@/lib/booking/booking.utils";

import {
  BOOKING_TIMEZONE,
  APPOINTMENT_DURATION_MINUTES,
  WORKING_HOURS,
} from "@/lib/availability/availability.constants";

import {
  sendAdminNewBookingEmail,
  sendCustomerBookingReceivedEmail,
} from "@/lib/email/bookingEmails";

import {
  isValidDateFormat,
  isValidTimeFormat,
  isWithinWorkingHours,
  isValidAppointmentSlot,
} from "@/lib/availability/availability.utils";

import { bookingFormSchema } from "@/lib/booking/booking.validation";

function getMelbourneToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getEndTime(startTime: string) {
  const [hours, minutes] = startTime
    .split(":")
    .map(Number);

  const total =
    hours * 60 +
    minutes +
    APPOINTMENT_DURATION_MINUTES;

  const endHours = Math.floor(total / 60);
  const endMinutes = total % 60;

  return `${String(endHours).padStart(2, "0")}:${String(
    endMinutes
  ).padStart(2, "0")}`;
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    /* =====================================================
       SERVER VALIDATION
    ===================================================== */

    const parsed = bookingFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check your booking details.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const {
      date,
      startTime,
      endTime: clientEndTime,
    } = data.appointment;

    /* =====================================================
       DATE VALIDATION
    ===================================================== */

    if (!isValidDateFormat(date)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid appointment date.",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       TIME VALIDATION
    ===================================================== */

    if (!isValidTimeFormat(startTime)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid appointment time.",
        },
        { status: 400 }
      );
    }

    const endTime = getEndTime(startTime);

    /*
     * Never trust the client-provided end time.
     * The server calculates the final 60-minute slot.
     */

    if (
      clientEndTime &&
      clientEndTime !== endTime
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid appointment slot.",
        },
        { status: 400 }
      );
    }

   if (!isWithinWorkingHours(startTime, endTime)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Selected time is outside working hours.",
        },
        { status: 400 }
      );
    }

  if (!isValidAppointmentSlot(startTime, endTime)){
      return NextResponse.json(
        {
          success: false,
          message: "Invalid appointment slot.",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       PAST DATE
    ===================================================== */

    if (date <= getMelbourneToday()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please select a future appointment date.",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       SERVICE VALIDATION
    ===================================================== */

    let serviceId: mongoose.Types.ObjectId | null = null;

    let serviceName = "Not sure — I need help";

    /*
     * The booking form can send either:
     *
     * 1. A real Service ObjectId
     * 2. null / empty value for "Not sure"
     *
     * We also detect the service name so an old frontend
     * value cannot accidentally trigger ObjectId validation.
     */

    const selectedServiceId =
      data.service.serviceId;

    const selectedServiceName =
      data.service.serviceName?.trim();

    const isHelpRequest =
      !selectedServiceId ||
      selectedServiceName ===
        "Not sure — I need help";

    if (!isHelpRequest) {
      if (
        !mongoose.isValidObjectId(
          selectedServiceId
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid service selected.",
          },
          { status: 400 }
        );
      }

      const service = await Service.findOne({
        _id: selectedServiceId,
        status: "active",
      })
        .select("_id title")
        .lean();

      if (!service) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This service is no longer available.",
          },
          { status: 409 }
        );
      }

      serviceId = service._id;
      serviceName = service.title;
    }

    /* =====================================================
       ADMIN BLOCK CHECK
    ===================================================== */

    const availability =
      await Availability.findOne({
        date,
      }).lean();

    if (availability?.allDayBlocked) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This date is no longer available.",
        },
        { status: 409 }
      );
    }

    const blocked =
      availability?.timeBlocks?.some(
        (block) =>
          block.start === startTime &&
          block.end === endTime
      );

    if (blocked) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This time is no longer available.",
        },
        { status: 409 }
      );
    }

    /* =====================================================
       EXISTING BOOKING CHECK
    ===================================================== */

    const alreadyBooked =
      await Booking.exists({
        "appointment.date": date,
        "appointment.startTime": startTime,
        status: {
          $in: [
            "pending",
            "confirmed",
            
          ],
        },
      });

    if (alreadyBooked) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This time has just been booked. Please choose another slot.",
        },
        { status: 409 }
      );
    }

    /* =====================================================
       BOOKING REFERENCE
    ===================================================== */

    /* =====================================================
   BOOKING REFERENCE
===================================================== */

const bookingReference =
  await generateBookingReference();


    /* =====================================================
       CREATE BOOKING
    ===================================================== */

    const createdBooking =
      await Booking.create({
        bookingReference,

        customer: {
          fullName:
            data.customer.fullName,

          phone:
            data.customer.phone,

          email:
            data.customer.email || "",

          notes: "",
        },

        vehicle: {
          registrationNumber:
            data.vehicle.registrationNumber.toUpperCase(),

       
          issue:
            data.vehicle.issue,

          notes:
            data.vehicle.notes,
        },

        service: {
          serviceId,
          serviceName,
        },

        location: {
          address:
            data.location.address,

          suburb:
            data.location.suburb,

          state:
            data.location.state,

          postcode:
            data.location.postcode,

          accessNotes:
            data.location.accessNotes,
        },

        appointment: {
          date,

          startTime,

          endTime,

          timezone:
            BOOKING_TIMEZONE,
        },

        status: "pending",
      });




      /* =====================================================
   BOOKING EMAILS
===================================================== */

const emailBooking = {
  bookingReference:
    createdBooking.bookingReference,

  customer: {
    fullName:
      createdBooking.customer.fullName,

    phone:
      createdBooking.customer.phone,

    email:
      createdBooking.customer.email,
  },

  vehicle: {
    registrationNumber:
      createdBooking.vehicle.registrationNumber,

    issue:
      createdBooking.vehicle.issue,

    notes:
      createdBooking.vehicle.notes,
  },

  service: {
    serviceName:
      createdBooking.service.serviceName,
  },

  location: {
    address:
      createdBooking.location.address,

    suburb:
      createdBooking.location.suburb,

    state:
      createdBooking.location.state,

    postcode:
      createdBooking.location.postcode,

    accessNotes:
      createdBooking.location.accessNotes,
  },

  appointment: {
    date:
      createdBooking.appointment.date,

    startTime:
      createdBooking.appointment.startTime,

    endTime:
      createdBooking.appointment.endTime,

    timezone:
      createdBooking.appointment.timezone,
  },
};

const emailResults =
  await Promise.allSettled([
    sendCustomerBookingReceivedEmail(
      emailBooking
    ),

    sendAdminNewBookingEmail(
      emailBooking
    ),
  ]);

for (const result of emailResults) {
  if (result.status === "rejected") {
    console.error(
      "BOOKING EMAIL ERROR:",
      result.reason
    );
  }
}

    /* =====================================================
       RESPONSE
    ===================================================== */




    const bookingId =
      String(createdBooking._id);

    return NextResponse.json(
      {
        success: true,

        message:
          "Your booking request has been received.",

        reference:
          bookingReference,

        booking: {
          id: bookingId,

          reference:
            bookingReference,

          service:
            serviceName,

          date,

          startTime,

          endTime,

          status: "pending",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "BOOKING SUBMISSION ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "We could not submit your booking request. Please try again.",
      },
      { status: 500 }
    );
  }
}