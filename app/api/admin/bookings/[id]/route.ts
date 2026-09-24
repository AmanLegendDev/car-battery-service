import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";

type BookingAction =
  | "confirm"
  | "cancel"
  | "complete"
  | "archive";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid booking ID.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const booking = await Booking.findById(id).lean();

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...booking,
        _id: String(booking._id),

        service: {
          ...booking.service,
          serviceId: booking.service.serviceId
            ? String(booking.service.serviceId)
            : null,
        },
      },
    });
  } catch (error) {
    console.error(
      "ADMIN BOOKING GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load booking.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid booking ID.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const action = body?.action as BookingAction;

    const validActions: BookingAction[] = [
      "confirm",
      "cancel",
      "complete",
      "archive",
    ];

    if (!validActions.includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid booking action.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    /*
     * ---------------------------------------------------------
     * ARCHIVE
     * ---------------------------------------------------------
     *
     * Archive does NOT change the booking status.
     *
     * Example:
     *
     * confirmed + archive
     *      ↓
     * confirmed + archived:true
     *
     * completed + archive
     *      ↓
     * completed + archived:true
     */
    if (action === "archive") {
      if (booking.archived === true) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This booking is already archived.",
          },
          { status: 409 }
        );
      }

      booking.archived = true;
      booking.archivedAt = new Date();

      await booking.save();

      return NextResponse.json({
        success: true,
        message:
          "Booking archived successfully.",
        data: {
          id: String(booking._id),
          reference:
            booking.bookingReference,
          status: booking.status,
          archived: booking.archived,
          archivedAt:
            booking.archivedAt,
        },
      });
    }

    /*
     * ---------------------------------------------------------
     * ACTIVE BOOKING CHECK
     * ---------------------------------------------------------
     *
     * Archived bookings cannot be confirmed,
     * cancelled or completed.
     */
    if (booking.archived === true) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Archived bookings cannot be updated.",
        },
        { status: 409 }
      );
    }

    /*
     * ---------------------------------------------------------
     * STATUS TRANSITIONS
     * ---------------------------------------------------------
     *
     * pending
     *   ├── confirm → confirmed
     *   └── cancel  → cancelled
     *
     * confirmed
     *   ├── complete → completed
     *   └── cancel   → cancelled
     *
     * completed
     *   └── no further status action
     *
     * cancelled
     *   └── no further status action
     */
    const allowedTransitions: Record<
      BookingAction,
      string[]
    > = {
      confirm: ["pending"],
      cancel: ["pending", "confirmed"],
      complete: ["confirmed"],
      archive: [],
    };

    const allowedFrom =
      allowedTransitions[action];

    if (
      !allowedFrom.includes(
        booking.status
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `This booking cannot be ${action}ed from its current status.`,
        },
        { status: 409 }
      );
    }

    /*
     * ---------------------------------------------------------
     * CONFIRMATION SLOT CHECK
     * ---------------------------------------------------------
     *
     * Before confirming, make sure another
     * active confirmed booking has not taken
     * this exact appointment slot.
     */
    if (action === "confirm") {
      const conflictingBooking =
        await Booking.exists({
          _id: {
            $ne: booking._id,
          },

          archived: {
            $ne: true,
          },

          "appointment.date":
            booking.appointment.date,

          "appointment.startTime":
            booking.appointment.startTime,

          status: "confirmed",
        });

      if (conflictingBooking) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This appointment slot is already confirmed for another booking.",
          },
          { status: 409 }
        );
      }
    }

    /*
     * ---------------------------------------------------------
     * STATUS UPDATE
     * ---------------------------------------------------------
     */
    if (action === "confirm") {
      booking.status = "confirmed";
    }

    if (action === "cancel") {
      booking.status = "cancelled";
    }

    if (action === "complete") {
      booking.status = "completed";
    }

    await booking.save();

    const actionMessages: Record<
      Exclude<BookingAction, "archive">,
      string
    > = {
      confirm:
        "Booking confirmed successfully.",
      cancel:
        "Booking cancelled successfully.",
      complete:
        "Booking completed successfully.",
    };

    return NextResponse.json({
      success: true,
      message: actionMessages[action],
      data: {
        id: String(booking._id),
        reference:
          booking.bookingReference,
        status: booking.status,
        archived:
          booking.archived,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN BOOKING PATCH ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update booking.",
      },
      { status: 500 }
    );
  }
}