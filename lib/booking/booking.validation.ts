import { z } from "zod";

import {
  BOOKING_MAX_ADDRESS_LENGTH,
  BOOKING_MAX_EMAIL_LENGTH,
  BOOKING_MAX_NAME_LENGTH,
  BOOKING_MAX_NOTES_LENGTH,
  BOOKING_MAX_PHONE_LENGTH,
  BOOKING_MAX_POSTCODE_LENGTH,
  BOOKING_MAX_SUBURB_LENGTH,
  BOOKING_VEHICLE_ISSUES,
  BOOKING_TIMEZONE,
} from "./booking.constants";

const optionalEmailSchema = z
  .string()
  .trim()
  .max(BOOKING_MAX_EMAIL_LENGTH)
  .email("Please enter a valid email address.")
  .or(z.literal(""));

export const bookingVehicleSchema = z.object({
  registrationNumber: z
    .string()
    .trim()
    .min(1, "Registration number is required.")
    .max(30, "Registration number is too long."),

  issue: z
    .enum(BOOKING_VEHICLE_ISSUES)
    .or(z.literal("")),

  notes: z
    .string()
    .trim()
    .max(
      BOOKING_MAX_NOTES_LENGTH,
      "Vehicle notes are too long."
    ),
});

export const bookingServiceSchema = z.object({
  serviceId: z
    .string()
    .trim()
    .min(1, "Please select a service."),

  serviceName: z
    .string()
    .trim()
    .min(1, "Please select a service.")
    .max(
      150,
      "Service name is too long."
    ),
});

export const bookingAppointmentSchema = z.object({
  date: z
    .string()
    .trim()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Please select a valid booking date."
    ),

  startTime: z
    .string()
    .trim()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "Please select a valid start time."
    ),

  endTime: z
    .string()
    .trim()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "Please select a valid end time."
    ),

  timezone: z
    .string()
    .trim()
    .default(BOOKING_TIMEZONE),
});

export const bookingCustomerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required.")
    .max(
      BOOKING_MAX_NAME_LENGTH,
      "Full name is too long."
    ),

  phone: z
    .string()
    .trim()
    .min(
      7,
      "Please enter a valid mobile number."
    )
    .max(
      BOOKING_MAX_PHONE_LENGTH,
      "Mobile number is too long."
    ),

  email: optionalEmailSchema,

  notes: z
    .string()
    .trim()
    .max(
      BOOKING_MAX_NOTES_LENGTH,
      "Customer notes are too long."
    ),
});

export const bookingLocationSchema = z.object({
  address: z
    .string()
    .trim()
    .min(3, "Address is required.")
    .max(
      BOOKING_MAX_ADDRESS_LENGTH,
      "Address is too long."
    ),

  suburb: z
    .string()
    .trim()
    .min(2, "Suburb is required.")
    .max(
      BOOKING_MAX_SUBURB_LENGTH,
      "Suburb is too long."
    ),

  state: z
    .string()
    .trim()
    .min(2, "State is required.")
    .max(
      10,
      "State is invalid."
    ),

  postcode: z
    .string()
    .trim()
    .min(3, "Postcode is required.")
    .max(
      BOOKING_MAX_POSTCODE_LENGTH,
      "Postcode is too long."
    ),

  accessNotes: z
    .string()
    .trim()
    .max(
      BOOKING_MAX_NOTES_LENGTH,
      "Access notes are too long."
    ),
});

export const bookingFormSchema = z.object({
  vehicle: bookingVehicleSchema,

  service: bookingServiceSchema,

  appointment: bookingAppointmentSchema,

  customer: bookingCustomerSchema,

  location: bookingLocationSchema,

  termsAccepted: z
    .boolean()
    .refine(
      (value) => value === true,
      {
        message:
          "You must confirm the booking information before submitting.",
      }
    ),
});

export type BookingFormValidationData =
  z.infer<
    typeof bookingFormSchema
  >;