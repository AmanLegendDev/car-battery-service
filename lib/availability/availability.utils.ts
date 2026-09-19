import {
  APPOINTMENT_DURATION_MINUTES,
  BOOKING_TIMEZONE,
  WORKING_HOURS,
} from "./availability.constants";

import type {
  AppointmentSlot,
  AvailabilityTimeBlock,
} from "./availability.types";

function timeToMinutes(time: string): number {
  const [hours, minutes] = time
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    mins,
  ).padStart(2, "0")}`;
}

function formatSlotLabel(
  start: string,
  end: string,
): string {
  const format = (value: string) => {
    const [hoursString, minutesString] =
      value.split(":");

    const hours = Number(hoursString);
    const minutes = Number(minutesString);

    const suffix = hours >= 12 ? "PM" : "AM";

    const displayHour =
      hours % 12 === 0 ? 12 : hours % 12;

    return `${displayHour}:${String(minutes).padStart(
      2,
      "0",
    )} ${suffix}`;
  };

  return `${format(start)} - ${format(end)}`;
}

export function generateDailySlots(): AppointmentSlot[] {
  const slots: AppointmentSlot[] = [];

  const startMinutes = timeToMinutes(
    WORKING_HOURS.start,
  );

  const endMinutes = timeToMinutes(
    WORKING_HOURS.end,
  );

  for (
    let current = startMinutes;
    current + APPOINTMENT_DURATION_MINUTES <=
    endMinutes;
    current += APPOINTMENT_DURATION_MINUTES
  ) {
    const start = minutesToTime(current);

    const end = minutesToTime(
      current + APPOINTMENT_DURATION_MINUTES,
    );

    slots.push({
      start,
      end,
      label: formatSlotLabel(start, end),
    });
  }

  return slots;
}

export function isValidTimeFormat(
  time: string,
): boolean {
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return false;
  }

  const [hours, minutes] = time
    .split(":")
    .map(Number);

  return (
    hours >= 0 &&
    hours <= 23 &&
    minutes >= 0 &&
    minutes <= 59
  );
}

export function isValidDateFormat(
  date: string,
): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsed = new Date(`${date}T00:00:00Z`);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
}

export function isWorkingDay(
  dateString: string,
): boolean {
  if (!isValidDateFormat(dateString)) {
    return false;
  }

  const date = new Date(
    `${dateString}T12:00:00Z`,
  );

  const day = date.getUTCDay();

  return [0, 1, 2, 3, 4, 5, 6].includes(day);
}

export function isWithinWorkingHours(
  start: string,
  end: string,
): boolean {
  if (
    !isValidTimeFormat(start) ||
    !isValidTimeFormat(end)
  ) {
    return false;
  }

  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);

  const workingStart = timeToMinutes(
    WORKING_HOURS.start,
  );

  const workingEnd = timeToMinutes(
    WORKING_HOURS.end,
  );

  return (
    startMinutes >= workingStart &&
    endMinutes <= workingEnd &&
    endMinutes > startMinutes
  );
}

export function isValidAppointmentSlot(
  start: string,
  end: string,
): boolean {
  if (
    !isWithinWorkingHours(start, end)
  ) {
    return false;
  }

  const duration =
    timeToMinutes(end) -
    timeToMinutes(start);

  return duration === APPOINTMENT_DURATION_MINUTES;
}

export function doTimeBlocksOverlap(
  first: AvailabilityTimeBlock,
  second: AvailabilityTimeBlock,
): boolean {
  const firstStart = timeToMinutes(first.start);
  const firstEnd = timeToMinutes(first.end);

  const secondStart = timeToMinutes(
    second.start,
  );
  const secondEnd = timeToMinutes(
    second.end,
  );

  return (
    firstStart < secondEnd &&
    secondStart < firstEnd
  );
}

export function isSlotBlocked(
  slot: AppointmentSlot,
  blocks: AvailabilityTimeBlock[],
): boolean {
  return blocks.some((block) =>
    doTimeBlocksOverlap(slot, block),
  );
}

export function getAvailableSlots(
  blocks: AvailabilityTimeBlock[] = [],
): AppointmentSlot[] {
  return generateDailySlots().filter(
    (slot) => !isSlotBlocked(slot, blocks),
  );
}

export function getBookingTimezone(): string {
  return BOOKING_TIMEZONE;
}