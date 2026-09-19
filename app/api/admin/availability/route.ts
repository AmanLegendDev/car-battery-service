import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";

import Availability from "@/models/Availability";

import {
  validateAvailabilityInput,
} from "@/lib/availability/availability.validation";

import {
  isValidDateFormat,
} from "@/lib/availability/availability.utils";

import type { AvailabilityTimeBlock } from "@/lib/availability/availability.types";

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

/**
 * GET
 *
 * Returns admin availability records.
 *
 * Optional:
 * ?from=2026-09-01&to=2026-09-30
 */
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return unauthorizedResponse();
    }

    await connectDB();

    const { searchParams } = new URL(request.url);

    const from = searchParams.get("from") ?? "";
    const to = searchParams.get("to") ?? "";

    const query: Record<string, unknown> = {};

    if (from) {
      if (!isValidDateFormat(from)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid 'from' date.",
          },
          {
            status: 400,
          },
        );
      }

      query.date = {
        $gte: from,
      };
    }

    if (to) {
      if (!isValidDateFormat(to)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid 'to' date.",
          },
          {
            status: 400,
          },
        );
      }

      query.date = {
        ...(query.date as Record<string, string> | undefined),
        $lte: to,
      };
    }

    const records = await Availability.find(query)
      .sort({ date: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: records.map((record) => ({
        id: record._id.toString(),
        date: record.date,
        allDayBlocked: record.allDayBlocked,
        timeBlocks: record.timeBlocks ?? [],
        reason: record.reason ?? "",
      })),
    });
  } catch (error) {
    console.error(
      "GET /api/admin/availability error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load availability.",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * POST
 *
 * Creates or updates availability
 * blocking for one date.
 */
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return unauthorizedResponse();
    }

    await connectDB();

    const body = await request.json();

    const date =
      typeof body.date === "string"
        ? body.date.trim()
        : "";

    const allDayBlocked =
      body.allDayBlocked === true;

    const rawTimeBlocks: unknown[] =
      Array.isArray(body.timeBlocks)
        ? body.timeBlocks
        : [];

    const reason =
      typeof body.reason === "string"
        ? body.reason.trim()
        : "";

    /**
     * Normalize incoming time blocks.
     */
    const timeBlocks: AvailabilityTimeBlock[] =
      rawTimeBlocks.map((rawBlock): AvailabilityTimeBlock => {
        const block =
          typeof rawBlock === "object" &&
          rawBlock !== null
            ? rawBlock as {
                start?: unknown;
                end?: unknown;
              }
            : {};

        return {
          start:
            typeof block.start === "string"
              ? block.start.trim()
              : "",
          end:
            typeof block.end === "string"
              ? block.end.trim()
              : "",
        };
      });

    const validation =
      validateAvailabilityInput({
        date,
        allDayBlocked,
        timeBlocks,
        reason,
      });

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            validation.errors[0] ??
            "Invalid availability data.",
          errors: validation.errors,
        },
        {
          status: 400,
        },
      );
    }

    /**
     * Prevent past dates from being blocked.
     *
     * The date is interpreted as a calendar date,
     * not a UTC timestamp.
     */
    const today = new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "Australia/Melbourne",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      },
    ).format(new Date());

    if (date < today) {
      return NextResponse.json(
        {
          success: false,
          message: "Past dates cannot be blocked.",
        },
        {
          status: 400,
        },
      );
    }

    /**
     * Remove duplicate slots.
     */
    const uniqueTimeBlocks: AvailabilityTimeBlock[] =
      Array.from(
        new Map<string, AvailabilityTimeBlock>(
          timeBlocks.map(
            (
              block: AvailabilityTimeBlock,
            ) => [
              `${block.start}-${block.end}`,
              block,
            ],
          ),
        ).values(),
      );

    /**
     * Prevent overlapping blocks.
     */
    for (
      let i = 0;
      i < uniqueTimeBlocks.length;
      i++
    ) {
      const first =
        uniqueTimeBlocks[i];

      if (!first) {
        continue;
      }

      for (
        let j = i + 1;
        j < uniqueTimeBlocks.length;
        j++
      ) {
        const second =
          uniqueTimeBlocks[j];

        if (!second) {
          continue;
        }

        const firstStart =
          Number(first.start.slice(0, 2)) * 60 +
          Number(first.start.slice(3, 5));

        const firstEnd =
          Number(first.end.slice(0, 2)) * 60 +
          Number(first.end.slice(3, 5));

        const secondStart =
          Number(second.start.slice(0, 2)) * 60 +
          Number(second.start.slice(3, 5));

        const secondEnd =
          Number(second.end.slice(0, 2)) * 60 +
          Number(second.end.slice(3, 5));

        const overlaps =
          firstStart < secondEnd &&
          secondStart < firstEnd;

        if (overlaps) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Time blocks cannot overlap.",
            },
            {
              status: 400,
            },
          );
        }
      }
    }

    /**
     * Upsert one availability record per date.
     */
    const record =
      await Availability.findOneAndUpdate(
        {
          date,
        },
        {
          $set: {
            date,
            allDayBlocked,
            timeBlocks:
              allDayBlocked
                ? []
                : uniqueTimeBlocks,
            reason,
          },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        },
      ).lean();

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to save availability.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          allDayBlocked
            ? "Entire day blocked successfully."
            : uniqueTimeBlocks.length > 0
              ? "Time slots blocked successfully."
              : "Availability updated successfully.",
        data: {
          id: record._id.toString(),
          date: record.date,
          allDayBlocked:
            record.allDayBlocked,
          timeBlocks:
            record.timeBlocks ?? [],
          reason:
            record.reason ?? "",
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "POST /api/admin/availability error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save availability.",
      },
      {
        status: 500,
      },
    );
  }
}