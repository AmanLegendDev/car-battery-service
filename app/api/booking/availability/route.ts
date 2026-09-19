import { NextRequest, NextResponse } from "next/server";

import {
  getPublicAvailability,
} from "@/lib/booking/booking.availability";
import type { AvailabilityTimeBlock } from "@/lib/availability/availability.types";

import {
  getMelbourneDateString,
  isValidDateString,
} from "@/lib/booking/booking.utils";

const MAX_RANGE_DAYS = 93;

function addDays(
  date: string,
  amount: number
): string {
  const [year, month, day] =
    date.split("-").map(Number);

  const result = new Date(
    Date.UTC(
      year,
      month - 1,
      day
    )
  );

  result.setUTCDate(
    result.getUTCDate() + amount
  );

  return result
    .toISOString()
    .slice(0, 10);
}

function getDateDifferenceInDays(
  from: string,
  to: string
): number {
  const fromDate = new Date(
    `${from}T00:00:00Z`
  );

  const toDate = new Date(
    `${to}T00:00:00Z`
  );

  return Math.floor(
    (toDate.getTime() -
      fromDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

export async function GET(
  request: NextRequest
) {
  try {
    const searchParams =
      request.nextUrl.searchParams;

    const today =
      getMelbourneDateString();

    const requestedFrom =
      searchParams.get("from");

    const requestedTo =
      searchParams.get("to");

    /*
     * Default:
     * Tomorrow → 93 days ahead
     *
     * Today is deliberately excluded.
     */
    const from =
      requestedFrom || addDays(today, 1);

    const to =
      requestedTo ||
      addDays(
        from,
        MAX_RANGE_DAYS - 1
      );

    if (
      !isValidDateString(from) ||
      !isValidDateString(to)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid availability date range.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      from < addDays(today, 1)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Bookings are available from tomorrow onward.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      to < from
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The end date cannot be before the start date.",
        },
        {
          status: 400,
        }
      );
    }

    const range =
      getDateDifferenceInDays(
        from,
        to
      ) + 1;

    if (
      range > MAX_RANGE_DAYS
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            `Availability can be requested for up to ${MAX_RANGE_DAYS} days at a time.`,
        },
        {
          status: 400,
        }
      );
    }

    const days =
      await getPublicAvailability(
        from,
        to
      );

    return NextResponse.json(
      {
        success: true,

        timezone:
          "Australia/Melbourne",

        workingHours: {
          start: "08:00",
          end: "17:00",
        },

        appointmentDurationMinutes: 60,

        today,

        bookingStartsFrom:
          addDays(today, 1),

        days,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "[BOOKING_AVAILABILITY_GET]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load booking availability.",
      },
      {
        status: 500,
      }
    );
  }
}