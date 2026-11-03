
import type { BookingFormData } from "@/lib/booking/booking.types";

import { BOOKING_TIMEZONE } from "@/lib/booking/booking.constants";

export const INITIAL_BOOKING_DATA: BookingFormData = {
  // STEP 1 — VEHICLE
  vehicle: {
    registrationNumber: "",
    registrationState: "VIC",
    make: "",
    model: "",
    notes: "",
  },

  // STEP 2 — CONTACT
  customer: {
    fullName: "",
    phone: "",
    email: "",
  },

  // STEP 3 — SERVICE
  service: {
    serviceId: "",
    serviceName: "",
    issueDescription: "",
    images: [],
    video: "",
  },

  // STEP 4 — LOCATION
  location: {
    address: "",
    suburb: "",
    postcode: "",
    serviceArea: "",
    state: "VIC",
    accessNotes: "",
  },

  // STEP 4 — APPOINTMENT
  appointment: {
    date: "",
    startTime: "",
    endTime: "",
    timezone: BOOKING_TIMEZONE,
  },

  // FINAL REVIEW
  termsAccepted: false,
};
