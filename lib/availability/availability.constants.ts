export const BOOKING_TIMEZONE =
  "Australia/Melbourne";

export const WORKING_HOURS = {
  start: "08:00",
  end: "17:00",
} as const;

export const APPOINTMENT_DURATION_MINUTES = 60;

export const WORKING_DAYS = [
  1, // Monday
  2, // Tuesday
  3, // Wednesday
  4, // Thursday
  5, // Friday
  6, // Saturday
  0, // Sunday
] as const;

export const WORKING_DAY_NAMES = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
} as const;