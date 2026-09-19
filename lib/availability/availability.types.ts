export interface AvailabilityTimeBlock {
  start: string;
  end: string;
}

export interface AvailabilityRecord {
  id: string;
  date: string;
  allDayBlocked: boolean;
  timeBlocks: AvailabilityTimeBlock[];
  reason: string;
}

export interface AppointmentSlot {
  start: string;
  end: string;
  label: string;
}

export type SlotAvailabilityStatus =
  | "available"
  | "blocked"
  | "booked";

export interface AvailabilitySlot
  extends AppointmentSlot {
  status: SlotAvailabilityStatus;
}