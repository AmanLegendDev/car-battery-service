import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";

import Availability from "@/models/Availability";

import mongoose from "mongoose";

export const dynamic = "force-dynamic";

function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      message: "Unauthorized.",
    },
    {
      status: 401,
    },
  );
}

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * DELETE
 *
 * Removes the complete availability
 * block record for a date.
 */
export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return unauthorizedResponse();
    }

    const { id } = await context.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid availability ID.",
        },
        {
          status: 400,
        },
      );
    }

    await connectDB();

    const deleted =
      await Availability.findByIdAndDelete(
        id,
      );

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Availability block not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Availability block removed successfully.",
      data: {
        id: deleted._id.toString(),
        date: deleted.date,
      },
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/availability/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to remove availability block.",
      },
      {
        status: 500,
      },
    );
  }
}