import { z } from "zod";

const mediaSchema = z
  .object({
    publicId: z.string().trim().min(1).max(500),

    secureUrl: z.string().trim().url().max(2000),

    width: z
      .number()
      .int()
      .positive()
      .max(100000),

    height: z
      .number()
      .int()
      .positive()
      .max(100000),

    format: z
      .string()
      .trim()
      .toLowerCase()
      .min(1)
      .max(20),

    bytes: z
      .number()
      .int()
      .min(0)
      .max(100 * 1024 * 1024),

    resourceType: z.literal("image"),

    alt: z
      .string()
      .trim()
      .max(200)
      .default(""),
  })
  .strict();

const stringArray = (
  minLength: number,
  maxLength: number,
  maxItems: number
) =>
  z
    .array(
      z
        .string()
        .trim()
        .min(minLength)
        .max(maxLength)
    )
    .max(maxItems);

const postcodeSchema = z
  .string()
  .trim()
  .regex(/^\d{4}$/, "Postcode must contain exactly 4 digits.");

export const createServiceAreaSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(120),

    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(2)
      .max(160)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug can only contain lowercase letters, numbers and hyphens."
      ),

    shortDescription: z
      .string()
      .trim()
      .min(10)
      .max(300),

    description: z
      .string()
      .trim()
      .min(20)
      .max(10000),

    suburbs: stringArray(2, 100, 50).default([]),

    postcodes: z
      .array(postcodeSchema)
      .max(50)
      .default([]),

    heroImage: mediaSchema.nullable().optional().default(null),

    mapUrl: z
      .string()
      .trim()
      .max(2000)
      .refine(
        (value) =>
          value === "" ||
          value.startsWith("https://") ||
          value.startsWith("http://"),
        {
          message: "Map URL must be a valid HTTP or HTTPS URL.",
        }
      )
      .default(""),

    serviceAvailability: z
      .string()
      .trim()
      .max(500)
      .default(""),

    featured: z
      .boolean()
      .default(false),

    displayOrder: z
      .number()
      .int()
      .min(0)
      .max(100000)
      .default(0),

    status: z
      .enum(["active", "draft"])
      .default("draft"),

    seoTitle: z
      .string()
      .trim()
      .max(70)
      .default(""),

    seoDescription: z
      .string()
      .trim()
      .max(170)
      .default(""),
  })
  .strict();

export const updateServiceAreaSchema =
  createServiceAreaSchema.partial().strict();

export type CreateServiceAreaInput = z.infer<
  typeof createServiceAreaSchema
>;

export type UpdateServiceAreaInput = z.infer<
  typeof updateServiceAreaSchema
>;