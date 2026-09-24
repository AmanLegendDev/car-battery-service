import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";

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

    const { searchParams } = new URL(request.url);

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

    const query: Record<string, unknown> = {
      archived: true,
    };

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

    const [
      bookings,
      total,
      pendingCount,
      confirmedCount,
      completedCount,
      cancelledCount,
    ] = await Promise.all([
      Booking.find(query)
        .sort({ archivedAt: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Booking.countDocuments(query),

      Booking.countDocuments({
        ...query,
        status: "pending",
      }),

      Booking.countDocuments({
        ...query,
        status: "confirmed",
      }),

      Booking.countDocuments({
        ...query,
        status: "completed",
      }),

      Booking.countDocuments({
        ...query,
        status: "cancelled",
      }),
    ]);

    return NextResponse.json({
      success: true,

      data: bookings.map((booking) => ({
        ...booking,

        _id: String(booking._id),

        archived: true,

        archivedAt: booking.archivedAt
          ? booking.archivedAt
          : null,

        service: {
          ...booking.service,

          serviceId: booking.service.serviceId
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

      counts: {
        all: total,
        pending: pendingCount,
        confirmed: confirmedCount,
        completed: completedCount,
        cancelled: cancelledCount,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN ARCHIVED BOOKINGS GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load archived bookings.",
      },
      { status: 500 }
    );
  }
}