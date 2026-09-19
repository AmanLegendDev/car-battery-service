import Counter from "@/models/Counter";

import {
  BOOKING_COUNTER_KEY,
  BOOKING_REFERENCE_PREFIX,
  BOOKING_TIMEZONE,
  BOOKING_TIME_SLOTS,
} from "./booking.constants";

export function normalizeRegistrationNumber(
  value: string
): string {
  return value.trim().toUpperCase();
}

export function normalizePhoneNumber(
  value: string
): string {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value
    .split("-")
    .map(Number);

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function isValidTimeString(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function getSlotByTime(
  startTime: string,
  endTime: string
) {
  return BOOKING_TIME_SLOTS.find(
    (slot) =>
      slot.start === startTime &&
      slot.end === endTime
  );
}

export function isValidBookingSlot(
  startTime: string,
  endTime: string
): boolean {
  return Boolean(
    getSlotByTime(startTime, endTime)
  );
}

export function getBookingTimezone(): string {
  return BOOKING_TIMEZONE;
}

export function getMelbourneDateString(
  date = new Date()
): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Generates:
 *
 * BCS-1
 * BCS-2
 * BCS-3
 *
 * This function must only be called from server-side code.
 */
export async function generateBookingReference(): Promise<string> {
  const counter = await Counter.findOneAndUpdate(
    {
      key: BOOKING_COUNTER_KEY,
    },
    {
      $inc: {
        value: 1,
      },
      $setOnInsert: {
        key: BOOKING_COUNTER_KEY,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  if (!counter) {
    throw new Error(
      "Unable to generate booking reference."
    );
  }

  return `${BOOKING_REFERENCE_PREFIX}-${counter.value}`;
}