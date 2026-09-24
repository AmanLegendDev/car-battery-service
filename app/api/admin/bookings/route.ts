import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";

const VALID_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
] as const;

type BookingStatus =
  (typeof VALID_STATUSES)[number];

export async function GET(request: Request) {
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

    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const status =
      searchParams.get("status") ?? "all";

    const search =
      searchParams.get("search")?.trim() ?? "";

    const page = Math.max(
      Number(searchParams.get("page") ?? 1),
      1
    );

    const limit = Math.min(
      Math.max(
        Number(
          searchParams.get("limit") ?? 20
        ),
        1
      ),
      100
    );

    /*
     * ---------------------------------------------------------
     * ACTIVE BOOKING QUERY
     * ---------------------------------------------------------
     *
     * We intentionally use:
     *
     * archived: { $ne: true }
     *
     * instead of:
     *
     * archived: false
     *
     * because older bookings created before the
     * archive field existed may not have the field.
     *
     * Those old bookings should still appear here.
     */
    const query: Record<string, unknown> = {
      archived: {
        $ne: true,
      },
    };

    /*
     * ---------------------------------------------------------
     * STATUS FILTER
     * ---------------------------------------------------------
     */
    if (
      status !== "all" &&
      VALID_STATUSES.includes(
        status as BookingStatus
      )
    ) {
      query.status = status;
    }

    /*
     * ---------------------------------------------------------
     * SEARCH
     * ---------------------------------------------------------
     */
    if (search) {
      query.$or = [
        {
          bookingReference: {
            $regex: search,
            $options: "i",
          },
        },

        {
          "customer.fullName": {
            $regex: search,
            $options: "i",
          },
        },

        {
          "customer.phone": {
            $regex: search,
            $options: "i",
          },
        },

        {
          "vehicle.registrationNumber": {
            $regex: search,
            $options: "i",
          },
        },

        {
          "service.serviceName": {
            $regex: search,
            $options: "i",
          },
        },

        {
          "location.suburb": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    /*
     * ---------------------------------------------------------
     * COUNTS
     * ---------------------------------------------------------
     *
     * Counts are ONLY for active/non-archived bookings.
     */
    const activeQuery = {
      archived: {
        $ne: true,
      },
    };

    const [
      bookings,
      total,
      pendingCount,
      confirmedCount,
      completedCount,
      cancelledCount,
    ] = await Promise.all([
      Booking.find(query)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Booking.countDocuments(query),

      Booking.countDocuments({
        ...activeQuery,
        status: "pending",
      }),

      Booking.countDocuments({
        ...activeQuery,
        status: "confirmed",
      }),

      Booking.countDocuments({
        ...activeQuery,
        status: "completed",
      }),

      Booking.countDocuments({
        ...activeQuery,
        status: "cancelled",
      }),
    ]);

    /*
     * ---------------------------------------------------------
     * RESPONSE
     * ---------------------------------------------------------
     */
    return NextResponse.json({
      success: true,

      data: bookings.map((booking) => ({
        ...booking,

        _id: String(booking._id),

        bookingReference:
          booking.bookingReference,

        archived:
          booking.archived === true,

        archivedAt:
          booking.archivedAt
            ? booking.archivedAt
            : null,

        service: {
          ...booking.service,

          serviceId:
            booking.service.serviceId
              ? String(
                  booking.service.serviceId
                )
              : null,
        },
      })),

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit
        ),
      },

      /*
       * These are the exact counters used
       * by the booking management page.
       */
      counts: {
        all:
          pendingCount +
          confirmedCount +
          completedCount +
          cancelledCount,

        pending:
          pendingCount,

        confirmed:
          confirmedCount,

        completed:
          completedCount,

        cancelled:
          cancelledCount,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN BOOKINGS GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load bookings.",
      },
      { status: 500 }
    );
  }
}