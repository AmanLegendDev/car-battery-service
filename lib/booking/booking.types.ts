import type {
  BOOKING_FUEL_TYPES,
  BOOKING_STATUSES,
  BOOKING_TIME_SLOTS,
  BOOKING_VEHICLE_ISSUES,
} from "./booking.constants";

export type BookingFuelType =
  (typeof BOOKING_FUEL_TYPES)[number];

export type BookingVehicleIssue =
  (typeof BOOKING_VEHICLE_ISSUES)[number];

export type BookingStatus =
  (typeof BOOKING_STATUSES)[number];

export type BookingTimeSlot =
  (typeof BOOKING_TIME_SLOTS)[number];

export interface BookingVehicleData {
  registrationNumber: string;
  make: string;
  model: string;
  year: string;
  fuelType: BookingFuelType | "";
  issue: BookingVehicleIssue | "";
  notes: string;
}

export interface BookingServiceData {
  serviceId: string;
  serviceName: string;
}

export interface BookingDateTimeData {
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface BookingCustomerData {
  fullName: string;
  phone: string;
  email: string;
  notes: string;
}

export interface BookingLocationData {
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  accessNotes: string;
}

export interface BookingFormData {
  vehicle: BookingVehicleData;
  service: BookingServiceData;
  appointment: BookingDateTimeData;
  customer: BookingCustomerData;
  location: BookingLocationData;
  termsAccepted: boolean;
}

export interface BookingSubmitPayload {
  vehicle: BookingVehicleData;
  service: BookingServiceData;
  appointment: BookingDateTimeData;
  customer: BookingCustomerData;
  location: BookingLocationData;
  termsAccepted: boolean;
}

export interface BookingReferenceResult {
  bookingReference: string;
}