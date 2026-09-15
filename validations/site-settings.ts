import { z } from "zod";

const mediaSchema = z
  .object({
    publicId: z
      .string()
      .trim()
      .min(1),

    secureUrl: z
      .string()
      .trim()
      .url(),

    width: z
      .number()
      .int()
      .positive(),

    height: z
      .number()
      .int()
      .positive(),

    format: z
      .string()
      .trim()
      .min(1),

    bytes: z
      .number()
      .int()
      .nonnegative(),

    resourceType:
      z.literal("image"),

    alt: z
      .string()
      .trim()
      .max(200)
      .default(""),
  })
  .strict();

const businessHourSchema =
  z
    .object({
      day: z.enum([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ]),

      enabled: z.boolean(),

      open: z
        .string()
        .trim()
        .regex(
          /^([01]\d|2[0-3]):[0-5]\d$/,
          "Invalid opening time."
        )
        .optional(),

      close: z
        .string()
        .trim()
        .regex(
          /^([01]\d|2[0-3]):[0-5]\d$/,
          "Invalid closing time."
        )
        .optional(),
    })
    .strict();

const socialSchema = z
  .object({
    instagram: z
      .string()
      .trim()
      .url("Invalid Instagram URL.")
      .optional()
      .or(z.literal("")),

    facebook: z
      .string()
      .trim()
      .url("Invalid Facebook URL.")
      .optional()
      .or(z.literal("")),

    googleBusiness: z
      .string()
      .trim()
      .url("Invalid Google Business URL.")
      .optional()
      .or(z.literal("")),

    other: z
      .string()
      .trim()
      .url("Invalid social URL.")
      .optional()
      .or(z.literal("")),
  })
  .strict();

export const updateSiteSettingsSchema =
  z
    .object({
      businessName: z
        .string()
        .trim()
        .min(
          2,
          "Business name must be at least 2 characters."
        )
        .max(150),

      tagline: z
        .string()
        .trim()
        .max(250)
        .optional()
        .or(z.literal("")),

      description: z
        .string()
        .trim()
        .max(3000)
        .optional()
        .or(z.literal("")),

      logo: mediaSchema
        .optional()
        .nullable(),

      phone: z
        .string()
        .trim()
        .min(
          5,
          "Business phone is required."
        )
        .max(50),

      primaryCallNumber: z
        .string()
        .trim()
        .min(
          5,
          "Primary call number is required."
        )
        .max(50),

      whatsapp: z
        .string()
        .trim()
        .max(50)
        .optional()
        .or(z.literal("")),

      email: z
        .string()
        .trim()
        .email("Invalid email address.")
        .max(254)
        .optional()
        .or(z.literal("")),

      address: z
        .string()
        .trim()
        .max(500)
        .optional()
        .or(z.literal("")),

      primaryServiceRegion: z
        .string()
        .trim()
        .max(200)
        .optional()
        .or(z.literal("")),

      serviceAreaInformation: z
        .string()
        .trim()
        .max(1000)
        .optional()
        .or(z.literal("")),

      businessHours:
        z.array(
          businessHourSchema
        ),

      emergencyAvailability: z
        .string()
        .trim()
        .max(500)
        .optional()
        .or(z.literal("")),

      social: socialSchema,

      bookingCta: z
        .string()
        .trim()
        .max(100)
        .optional()
        .or(z.literal("")),

      quoteCta: z
        .string()
        .trim()
        .max(100)
        .optional()
        .or(z.literal("")),

      defaultSiteTitle: z
        .string()
        .trim()
        .max(160)
        .optional()
        .or(z.literal("")),

      defaultSiteDescription: z
        .string()
        .trim()
        .max(320)
        .optional()
        .or(z.literal("")),

      defaultOgImage: mediaSchema
        .optional()
        .nullable(),
    })
    .strict();

export type UpdateSiteSettingsInput =
  z.infer<
    typeof updateSiteSettingsSchema
  >;