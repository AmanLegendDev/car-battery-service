
import type {
  BOOKING_STATUSES,
  BOOKING_TIME_SLOTS,
} from "./booking.constants";

/* =========================================
   REGISTRATION STATES
========================================= */

export const REGISTRATION_STATES = [
  "ACT",
  "NSW",
  "NT",
  "QLD",
  "SA",
  "TAS",
  "VIC",
  "WA",
] as const;

export type RegistrationState =
  (typeof REGISTRATION_STATES)[number];

/* =========================================
   SHARED TYPES
========================================= */

export type BookingStatus =
  (typeof BOOKING_STATUSES)[number];

export type BookingTimeSlot =
  (typeof BOOKING_TIME_SLOTS)[number];

/* =========================================
   STEP 1 — VEHICLE
========================================= */

export interface BookingVehicleData {
  registrationNumber: string;
  registrationState: RegistrationState;
  make: string;
  model: string;
  notes: string;
}

/* =========================================
   STEP 2 — CONTACT
========================================= */

export interface BookingCustomerData {
  fullName: string;
  phone: string;
  email: string;
}

/* =========================================
   STEP 3 — SERVICE
========================================= */

export interface BookingServiceData {
  serviceId: string;
  serviceName: string;
  issueDescription: string;
  images: string[];
  video: string;
}

/* =========================================
   STEP 4 — LOCATION
========================================= */

export interface BookingLocationData {
  address: string;
  suburb: string;
  postcode: string;
  serviceArea: string;
  state: string;
  accessNotes: string;
}

/* =========================================
   APPOINTMENT
   STEP 4 — PREFERRED DATE & TIME
========================================= */

export interface BookingDateTimeData {
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
}

/* =========================================
   COMPLETE BOOKING FORM
========================================= */

export interface BookingFormData {
  vehicle: BookingVehicleData;
  customer: BookingCustomerData;
  service: BookingServiceData;
  location: BookingLocationData;
  appointment: BookingDateTimeData;

  // Client-side confirmation only.
  termsAccepted: boolean;
}

/* =========================================
   API SUBMISSION PAYLOAD
========================================= */

export interface BookingSubmitPayload {
  vehicle: BookingVehicleData;
  customer: BookingCustomerData;
  service: BookingServiceData;
  location: BookingLocationData;
  appointment: BookingDateTimeData;
  termsAccepted: boolean;
}

/* =========================================
   BOOKING RESPONSE
========================================= */

export interface BookingReferenceResult {
  bookingReference: string;
}
