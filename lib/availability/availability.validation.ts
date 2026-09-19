import {
  isValidAppointmentSlot,
  isValidDateFormat,
  isValidTimeFormat,
  isWithinWorkingHours,
} from "./availability.utils";

export interface ValidateAvailabilityInput {
  date: string;
  allDayBlocked?: boolean;
  timeBlocks?: Array<{
    start: string;
    end: string;
  }>;
  reason?: string;
}

export function validateAvailabilityInput(
  input: ValidateAvailabilityInput,
): {
  success: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!input.date) {
    errors.push("Date is required.");
  } else if (!isValidDateFormat(input.date)) {
    errors.push(
      "Date must use YYYY-MM-DD format.",
    );
  }

  const timeBlocks = input.timeBlocks ?? [];

  if (
    input.allDayBlocked &&
    timeBlocks.length > 0
  ) {
    errors.push(
      "An entire day cannot also contain individual time blocks.",
    );
  }

  for (const block of timeBlocks) {
    if (
      !isValidTimeFormat(block.start) ||
      !isValidTimeFormat(block.end)
    ) {
      errors.push(
        "Time blocks must use HH:mm format.",
      );

      continue;
    }

    if (
      !isWithinWorkingHours(
        block.start,
        block.end,
      )
    ) {
      errors.push(
        "Blocked time must fall within working hours.",
      );

      continue;
    }

    if (
      !isValidAppointmentSlot(
        block.start,
        block.end,
      )
    ) {
      errors.push(
        "Blocked time must be exactly one appointment slot.",
      );
    }
  }

  const reason = input.reason?.trim() ?? "";

  if (reason.length > 300) {
    errors.push(
      "Reason cannot exceed 300 characters.",
    );
  }

  return {
    success: errors.length === 0,
    errors,
  };
}