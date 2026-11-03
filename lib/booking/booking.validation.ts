
import { z } from "zod";

import {
  BOOKING_MAX_ADDRESS_LENGTH,
  BOOKING_MAX_EMAIL_LENGTH,
  BOOKING_MAX_NAME_LENGTH,
  BOOKING_MAX_NOTES_LENGTH,
  BOOKING_MAX_PHONE_LENGTH,
  BOOKING_MAX_POSTCODE_LENGTH,
  BOOKING_MAX_SUBURB_LENGTH,
  BOOKING_TIMEZONE,
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

/* =========================================
   COMMON VALIDATION
========================================= */

const optionalEmailSchema = z
  .string()
  .trim()
  .max(
    BOOKING_MAX_EMAIL_LENGTH,
    "Email address is too long."
  )
  .email("Please enter a valid email address.")
  .or(z.literal(""));

const cloudinaryUrlSchema = z
  .string()
  .url("Invalid media URL.")
  .refine(
    (value) =>
      value.startsWith("https://res.cloudinary.com/"),
    "Only secure Cloudinary media URLs are allowed."
  );

/* =========================================
   STEP 1 — VEHICLE
========================================= */

export const bookingVehicleSchema = z.object({
  registrationNumber: z
    .string()
    .trim()
    .max(20, "Registration number is too long.")
    .default(""),

  registrationState: z
    .enum(REGISTRATION_STATES)
    .default("VIC"),

  make: z
    .string()
    .trim()
    .min(2, "Please enter your vehicle make.")
    .max(80, "Vehicle make is too long."),

  model: z
    .string()
    .trim()
    .min(1, "Please enter your vehicle model.")
    .max(100, "Vehicle model is too long."),

  notes: z
    .string()
    .trim()
    .max(
      BOOKING_MAX_NOTES_LENGTH,
      "Vehicle notes are too long."
    )
    .default(""),
});

/* =========================================
   STEP 2 — CONTACT
========================================= */

export const bookingCustomerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(
      BOOKING_MAX_NAME_LENGTH,
      "Full name is too long."
    ),

  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid mobile number.")
    .max(
      BOOKING_MAX_PHONE_LENGTH,
      "Mobile number is too long."
    ),

  email: optionalEmailSchema,
});

/* =========================================
   STEP 3 — SERVICE
========================================= */

export const bookingServiceSchema = z.object({
  serviceId: z
    .string()
    .trim()
    .default(""),

  serviceName: z
    .string()
    .trim()
    .min(1, "Please select a service.")
    .max(150, "Service name is too long."),

  issueDescription: z
    .string()
    .trim()
    .max(
      BOOKING_MAX_NOTES_LENGTH,
      "Issue description is too long."
    )
    .default(""),

  images: z
    .array(cloudinaryUrlSchema)
    .max(5, "Maximum 5 vehicle images are allowed.")
    .default([]),

  video: z
    .union([
      cloudinaryUrlSchema,
      z.literal(""),
    ])
    .default(""),
});

/* =========================================
   APPOINTMENT
   STEP 4 — DATE & TIME
========================================= */

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

/* =========================================
   STEP 4 — LOCATION
========================================= */

export const bookingLocationSchema = z.object({
  address: z
    .string()
    .trim()
    .min(3, "Please enter your service address.")
    .max(
      BOOKING_MAX_ADDRESS_LENGTH,
      "Address is too long."
    ),

  suburb: z
    .string()
    .trim()
    .min(2, "Please enter your suburb.")
    .max(
      BOOKING_MAX_SUBURB_LENGTH,
      "Suburb is too long."
    ),

  postcode: z
    .string()
    .trim()
    .min(3, "Please enter your postcode.")
    .max(
      BOOKING_MAX_POSTCODE_LENGTH,
      "Postcode is too long."
    ),

  serviceArea: z
    .string()
    .trim()
    .min(1, "Please select your service area.")
    .max(100, "Service area is too long."),

  state: z
    .string()
    .trim()
    .min(2, "Please enter your state.")
    .max(10, "State is invalid.")
    .default("VIC"),

  accessNotes: z
    .string()
    .trim()
    .max(
      BOOKING_MAX_NOTES_LENGTH,
      "Access notes are too long."
    )
    .default(""),
});

/* =========================================
   COMPLETE BOOKING FORM
========================================= */

export const bookingFormSchema = z.object({
  vehicle: bookingVehicleSchema,

  customer: bookingCustomerSchema,

  service: bookingServiceSchema,

  appointment: bookingAppointmentSchema,

  location: bookingLocationSchema,

  termsAccepted: z
    .boolean()
    .refine(
      (value) => value === true,
      {
        message:
          "You must accept the terms before submitting.",
      }
    ),
});

/* =========================================
   INFERRED TYPES
========================================= */

export type BookingFormValidationData = z.infer<
  typeof bookingFormSchema
>;
