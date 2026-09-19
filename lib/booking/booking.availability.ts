import { connectDB } from "@/lib/db";
import Availability from "@/models/Availability";
import Booking from "@/models/Booking";

import {
  BOOKING_TIMEZONE,
  BOOKING_TIME_SLOTS,
} from "./booking.constants";

import {
  getMelbourneDateString,
} from "./booking.utils";

export type PublicSlotStatus =
  | "available"
  | "blocked"
  | "booked";

export interface PublicAvailabilitySlot {
  start: string;
  end: string;
  label: string;
  status: PublicSlotStatus;
  reason: string | null;
}

export interface PublicAvailabilityDay {
  date: string;
  isToday: boolean;
  isPast: boolean;
  isWorkingDay: boolean;
  allDayBlocked: boolean;
  available: boolean;
  slots: PublicAvailabilitySlot[];
}

const BOOKING_BLOCKING_STATUSES = [
  "pending",
  "confirmed",
  "in-progress",
] as const;

function parseDateParts(date: string) {
  const [year, month, day] = date
    .split("-")
    .map(Number);

  return {
    year,
    month,
    day,
  };
}

function addDays(date: string, amount: number): string {
  const { year, month, day } = parseDateParts(date);

  const result = new Date(
    Date.UTC(year, month - 1, day)
  );

  result.setUTCDate(
    result.getUTCDate() + amount
  );

  return result
    .toISOString()
    .slice(0, 10);
}

function compareDates(
  first: string,
  second: string
): number {
  if (first < second) return -1;
  if (first > second) return 1;
  return 0;
}

function isValidDateFormat(
  value: string
): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const { year, month, day } =
    parseDateParts(value);

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function getDayOfWeek(
  date: string
): number {
  const { year, month, day } =
    parseDateParts(date);

  return new Date(
    Date.UTC(year, month - 1, day)
  ).getUTCDay();
}

function isWorkingDay(
  date: string
): boolean {
  /*
   * Business is currently open Monday-Sunday.
   *
   * Sunday = 0
   * Monday = 1
   * ...
   * Saturday = 6
   */
  const day = getDayOfWeek(date);

  return day >= 0 && day <= 6;
}

function createBaseSlots(): PublicAvailabilitySlot[] {
  return BOOKING_TIME_SLOTS.map((slot) => ({
    start: slot.start,
    end: slot.end,
    label: slot.label,
    status: "available",
    reason: null,
  }));
}

export async function getPublicAvailability(
  from: string,
  to: string
): Promise<PublicAvailabilityDay[]> {
  if (
    !isValidDateFormat(from) ||
    !isValidDateFormat(to)
  ) {
    throw new Error(
      "Invalid availability date range."
    );
  }

  if (compareDates(from, to) > 0) {
    throw new Error(
      "Availability start date cannot be after end date."
    );
  }

  await connectDB();

  const today =
    getMelbourneDateString();

  const availabilityRecords =
    await Availability.find({
      date: {
        $gte: from,
        $lte: to,
      },
    })
      .select({
        date: 1,
        allDayBlocked: 1,
        timeBlocks: 1,
        reason: 1,
      })
      .lean();

  const bookings =
    await Booking.find({
      "appointment.date": {
        $gte: from,
        $lte: to,
      },

      status: {
        $in: BOOKING_BLOCKING_STATUSES,
      },
    })
      .select({
        "appointment.date": 1,
        "appointment.startTime": 1,
        "appointment.endTime": 1,
        status: 1,
      })
      .lean();

  const availabilityByDate =
    new Map<
      string,
      {
        allDayBlocked: boolean;
        timeBlocks: Array<{
          start: string;
          end: string;
        }>;
        reason: string;
      }
    >();

  for (const record of availabilityRecords) {
    availabilityByDate.set(
      record.date,
      {
        allDayBlocked:
          record.allDayBlocked === true,

        timeBlocks:
          record.timeBlocks ?? [],

        reason:
          record.reason ?? "",
      }
    );
  }

  const bookedSlotsByDate =
    new Map<
      string,
      Set<string>
    >();

  for (const booking of bookings) {
    const date =
      booking.appointment?.date;

    const startTime =
      booking.appointment?.startTime;

    const endTime =
      booking.appointment?.endTime;

    if (
      !date ||
      !startTime ||
      !endTime
    ) {
      continue;
    }

    const slotKey =
      `${startTime}-${endTime}`;

    if (
      !bookedSlotsByDate.has(date)
    ) {
      bookedSlotsByDate.set(
        date,
        new Set()
      );
    }

    bookedSlotsByDate
      .get(date)!
      .add(slotKey);
  }

  const days: PublicAvailabilityDay[] = [];

  let cursor = from;

  while (
    compareDates(cursor, to) <= 0
  ) {
    const isToday =
      cursor === today;

    const isPast =
      compareDates(cursor, today) < 0;

    const workingDay =
      isWorkingDay(cursor);

    const record =
      availabilityByDate.get(cursor);

    const allDayBlocked =
      record?.allDayBlocked === true;

    const bookedSlots =
      bookedSlotsByDate.get(cursor) ??
      new Set<string>();

    const slots =
      createBaseSlots();

    for (const slot of slots) {
      if (isPast || isToday) {
        slot.status = "blocked";
        slot.reason = isToday
          ? "Bookings are not available for today."
          : "This date has already passed.";

        continue;
      }

      if (!workingDay) {
        slot.status = "blocked";
        slot.reason =
          "Bookings are not available on this day.";

        continue;
      }

      if (allDayBlocked) {
        slot.status = "blocked";
        slot.reason =
          record?.reason ||
          "This date has been blocked.";

        continue;
      }

      const adminBlocked =
        record?.timeBlocks?.some(
          (block) =>
            block.start === slot.start &&
            block.end === slot.end
        ) ?? false;

      if (adminBlocked) {
        slot.status = "blocked";
        slot.reason =
          record?.reason ||
          "This time has been blocked.";

        continue;
      }

      const slotKey =
        `${slot.start}-${slot.end}`;

      if (
        bookedSlots.has(slotKey)
      ) {
        slot.status = "booked";
        slot.reason =
          "This time has already been booked.";

        continue;
      }

      slot.status = "available";
      slot.reason = null;
    }

    const available =
      slots.some(
        (slot) =>
          slot.status === "available"
      );

    days.push({
      date: cursor,
      isToday,
      isPast,
      isWorkingDay: workingDay,
      allDayBlocked,
      available,
      slots,
    });

    cursor = addDays(
      cursor,
      1
    );
  }

  return days;
}

export async function isBookingSlotAvailable(
  date: string,
  startTime: string,
  endTime: string
): Promise<boolean> {
  const result =
    await getPublicAvailability(
      date,
      date
    );

  const day = result[0];

  if (!day) {
    return false;
  }

  const slot =
    day.slots.find(
      (item) =>
        item.start === startTime &&
        item.end === endTime
    );

  return (
    slot?.status === "available"
  );
}