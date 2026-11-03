
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

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: Request) {
  try {
    // ---------------------------------------------------------
    // ADMIN AUTHORIZATION
    // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // QUERY PARAMETERS
    // ---------------------------------------------------------

    const { searchParams } = new URL(request.url);

    const requestedStatus =
      searchParams.get("status") ?? "all";

    const status = VALID_STATUSES.includes(
      requestedStatus as BookingStatus
    )
      ? (requestedStatus as BookingStatus)
      : "all";

    const search =
      searchParams.get("search")?.trim() ?? "";

    const requestedPage = Number(
      searchParams.get("page") ?? 1
    );

    const requestedLimit = Number(
      searchParams.get("limit") ?? 20
    );

    const page =
      Number.isFinite(requestedPage) &&
      requestedPage > 0
        ? Math.floor(requestedPage)
        : 1;

    const limit =
      Number.isFinite(requestedLimit) &&
      requestedLimit > 0
        ? Math.min(Math.floor(requestedLimit), 100)
        : 20;

    const skip = (page - 1) * limit;

    // ---------------------------------------------------------
    // ACTIVE BOOKING QUERY
    // ---------------------------------------------------------

    // Older bookings may not have an archived field.
    // They must remain visible in the active booking list.

    const query: Record<string, unknown> = {
      archived: {
        $ne: true,
      },
    };

    if (status !== "all") {
      query.status = status;
    }

    // ---------------------------------------------------------
    // SEARCH
    // ---------------------------------------------------------

    if (search) {
      const safeSearch = escapeRegex(search);

      const searchRegex = {
        $regex: safeSearch,
        $options: "i",
      };

      query.$or = [
        // Booking reference
        {
          bookingReference: searchRegex,
        },

        // Customer information
        {
          "customer.fullName": searchRegex,
        },
        {
          "customer.phone": searchRegex,
        },
        {
          "customer.email": searchRegex,
        },

        // Vehicle information
        {
          "vehicle.registrationNumber": searchRegex,
        },
        {
          "vehicle.make": searchRegex,
        },
        {
          "vehicle.model": searchRegex,
        },
        {
          "vehicle.year": searchRegex,
        },

        // Service information
        {
          "service.serviceName": searchRegex,
        },
        {
          "service.issueDescription": searchRegex,
        },

        // Location information
        {
          "location.address": searchRegex,
        },
        {
          "location.suburb": searchRegex,
        },
        {
          "location.postcode": searchRegex,
        },
        {
          "location.serviceArea": searchRegex,
        },
      ];
    }

    // ---------------------------------------------------------
    // COUNTS
    // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------------

    const data = bookings.map((booking) => ({
      ...booking,

      _id: String(booking._id),

      bookingReference:
        booking.bookingReference,

      archived: booking.archived === true,

      archivedAt:
        booking.archivedAt ?? null,

      // Preserve every service field, including:
      // serviceId, serviceName, issueDescription,
      // images and video.

      service: {
        ...(booking.service ?? {}),

        serviceId: booking.service?.serviceId
          ? String(booking.service.serviceId)
          : null,
      },
    }));

    return NextResponse.json(
      {
        success: true,

        data,

        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },

        counts: {
          all:
            pendingCount +
            confirmedCount +
            completedCount +
            cancelledCount,

          pending: pendingCount,
          confirmed: confirmedCount,
          completed: completedCount,
          cancelled: cancelledCount,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "ADMIN BOOKINGS GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load bookings.",
      },
      { status: 500 }
    );
  }
}
