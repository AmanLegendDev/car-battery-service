import { connectDB } from "@/lib/db";
import Availability from "@/models/Availability";
import Booking, {
  type BookingStatus,
} from "@/models/Booking";
import SiteSettings from "@/models/SiteSettings";

import {
  BOOKING_DURATION_MINUTES,
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

interface BusinessHour {
  day: string;
  enabled: boolean;
  open: string;
  close: string;
}

const BOOKING_BLOCKING_STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
];

/* ============================================================
   DATE HELPERS
============================================================ */

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

function addDays(
  date: string,
  amount: number
): string {
  const {
    year,
    month,
    day,
  } = parseDateParts(date);

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
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const {
    year,
    month,
    day,
  } = parseDateParts(value);

  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day
    )
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
  const {
    year,
    month,
    day,
  } = parseDateParts(date);

  return new Date(
    Date.UTC(
      year,
      month - 1,
      day
    )
  ).getUTCDay();
}

/* ============================================================
   BUSINESS HOURS
============================================================ */

function getBusinessDayName(
  date: string
): string {
  const day = getDayOfWeek(date);

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return dayNames[day];
}

function isValidTime(
  value: string
): boolean {
  return /^\d{2}:\d{2}$/.test(value);
}

function timeToMinutes(
  value: string
): number {
  if (!isValidTime(value)) {
    return -1;
  }

  const [
    hours,
    minutes,
  ] = value
    .split(":")
    .map(Number);

  if (
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return -1;
  }

  return (
    hours * 60 +
    minutes
  );
}

function minutesToTime(
  totalMinutes: number
): string {
  const hours =
    Math.floor(
      totalMinutes / 60
    );

  const minutes =
    totalMinutes % 60;

  return `${String(hours).padStart(
    2,
    "0"
  )}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}

function formatTimeLabel(
  time: string
): string {
  const minutes =
    timeToMinutes(time);

  if (minutes < 0) {
    return time;
  }

  const hours24 =
    Math.floor(
      minutes / 60
    );

  const minute =
    minutes % 60;

  const period =
    hours24 >= 12
      ? "PM"
      : "AM";

  const hours12 =
    hours24 % 12 || 12;

  return `${hours12}:${String(
    minute
  ).padStart(2, "0")} ${period}`;
}

function createSlotLabel(
  start: string,
  end: string
): string {
  return `${formatTimeLabel(
    start
  )} – ${formatTimeLabel(end)}`;
}

/* ============================================================
   DYNAMIC SLOT GENERATION
============================================================ */

function createBaseSlots(
  businessHours: BusinessHour | null
): PublicAvailabilitySlot[] {
  if (!businessHours) {
    return [];
  }

  if (
    businessHours.enabled !== true
  ) {
    return [];
  }

  const openMinutes =
    timeToMinutes(
      businessHours.open
    );

  const closeMinutes =
    timeToMinutes(
      businessHours.close
    );

  if (
    openMinutes < 0 ||
    closeMinutes < 0 ||
    closeMinutes <= openMinutes
  ) {
    return [];
  }

  const slots: PublicAvailabilitySlot[] =
    [];

  let cursor = openMinutes;

  while (
    cursor +
      BOOKING_DURATION_MINUTES <=
    closeMinutes
  ) {
    const start =
      minutesToTime(cursor);

    const end =
      minutesToTime(
        cursor +
          BOOKING_DURATION_MINUTES
      );

    slots.push({
      start,
      end,
      label: createSlotLabel(
        start,
        end
      ),
      status: "available",
      reason: null,
    });

    cursor +=
      BOOKING_DURATION_MINUTES;
  }

  return slots;
}

/* ============================================================
   PUBLIC AVAILABILITY
============================================================ */

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

  if (
    compareDates(from, to) > 0
  ) {
    throw new Error(
      "Availability start date cannot be after end date."
    );
  }

  await connectDB();

  const today =
    getMelbourneDateString();

  /* ==========================================================
     SITE SETTINGS
  ========================================================== */

  const settings =
    await SiteSettings.findOne()
      .select({
        businessHours: 1,
      })
      .lean();

  const businessHours =
    Array.isArray(
      settings?.businessHours
    )
      ? (
          settings.businessHours as BusinessHour[]
        )
      : [];

  const businessHoursByDay =
    new Map<
      string,
      BusinessHour
    >();

  for (
    const hours of businessHours
  ) {
    if (
      !hours ||
      typeof hours.day !==
        "string"
    ) {
      continue;
    }

    businessHoursByDay.set(
      hours.day,
      {
        day: hours.day,
        enabled:
          hours.enabled === true,
        open:
          typeof hours.open ===
          "string"
            ? hours.open
            : "",
        close:
          typeof hours.close ===
          "string"
            ? hours.close
            : "",
      }
    );
  }

  /* ==========================================================
     ADMIN AVAILABILITY BLOCKS
  ========================================================== */

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

  /* ==========================================================
     EXISTING BOOKINGS
  ========================================================== */

 const bookings =
  await Booking.find({
    "appointment.date": {
      $gte: from,
      $lte: to,
    },

    status: {
      $in: BOOKING_BLOCKING_STATUSES,
    },

    archived: {
      $ne: true,
    },
  })
      .select({
        "appointment.date": 1,
        "appointment.startTime": 1,
        "appointment.endTime": 1,
        status: 1,
      })
      .lean();

  /* ==========================================================
     INDEX ADMIN AVAILABILITY
  ========================================================== */

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

  for (
    const record of availabilityRecords
  ) {
    availabilityByDate.set(
      record.date,
      {
        allDayBlocked:
          record.allDayBlocked ===
          true,

        timeBlocks:
          record.timeBlocks ?? [],

        reason:
          record.reason ?? "",
      }
    );
  }

  /* ==========================================================
     INDEX BOOKED SLOTS
  ========================================================== */

  const bookedSlotsByDate =
    new Map<
      string,
      Set<string>
    >();

  for (
    const booking of bookings
  ) {
    const date =
      booking.appointment?.date;

    const startTime =
      booking.appointment
        ?.startTime;

    const endTime =
      booking.appointment
        ?.endTime;

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
      !bookedSlotsByDate.has(
        date
      )
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

  /* ==========================================================
     BUILD DAYS
  ========================================================== */

  const days: PublicAvailabilityDay[] =
    [];

  let cursor = from;

  while (
    compareDates(
      cursor,
      to
    ) <= 0
  ) {
    const isToday =
      cursor === today;

    const isPast =
      compareDates(
        cursor,
        today
      ) < 0;

    const dayName =
      getBusinessDayName(
        cursor
      );

    const configuredBusinessHours =
      businessHoursByDay.get(
        dayName
      ) ?? null;

    const workingDay =
      configuredBusinessHours
        ?.enabled === true;

    const record =
      availabilityByDate.get(
        cursor
      );

    const allDayBlocked =
      record?.allDayBlocked ===
      true;

    const bookedSlots =
      bookedSlotsByDate.get(
        cursor
      ) ??
      new Set<string>();

    const slots =
      createBaseSlots(
        configuredBusinessHours
      );

    /* ========================================================
       INVALID / MISSING BUSINESS HOURS
    ======================================================== */

    if (
      !workingDay &&
      slots.length === 0
    ) {
      days.push({
        date: cursor,
        isToday,
        isPast,
        isWorkingDay: false,
        allDayBlocked,
        available: false,
        slots: [],
      });

      cursor = addDays(
        cursor,
        1
      );

      continue;
    }

    /* ========================================================
       PROCESS EACH SLOT
    ======================================================== */

    for (
      const slot of slots
    ) {
      if (
        isPast ||
        isToday
      ) {
        slot.status =
          "blocked";

        slot.reason = isToday
          ? "Bookings are not available for today."
          : "This date has already passed.";

        continue;
      }

      if (!workingDay) {
        slot.status =
          "blocked";

        slot.reason =
          "Bookings are not available on this day.";

        continue;
      }

      if (allDayBlocked) {
        slot.status =
          "blocked";

        slot.reason =
          record?.reason ||
          "This date has been blocked.";

        continue;
      }

      const adminBlocked =
        record?.timeBlocks?.some(
          (block) =>
            block.start ===
              slot.start &&
            block.end ===
              slot.end
        ) ?? false;

      if (adminBlocked) {
        slot.status =
          "blocked";

        slot.reason =
          record?.reason ||
          "This time has been blocked.";

        continue;
      }

      const slotKey =
        `${slot.start}-${slot.end}`;

      if (
        bookedSlots.has(
          slotKey
        )
      ) {
        slot.status =
          "booked";

        slot.reason =
          "This time has already been booked.";

        continue;
      }

      slot.status =
        "available";

      slot.reason = null;
    }

    const available =
      slots.some(
        (slot) =>
          slot.status ===
          "available"
      );

    days.push({
      date: cursor,
      isToday,
      isPast,
      isWorkingDay:
        workingDay,
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

/* ============================================================
   SINGLE SLOT CHECK
============================================================ */

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

  const day =
    result[0];

  if (!day) {
    return false;
  }

  const slot =
    day.slots.find(
      (item) =>
        item.start ===
          startTime &&
        item.end ===
          endTime
    );

  return (
    slot?.status ===
    "available"
  );
}