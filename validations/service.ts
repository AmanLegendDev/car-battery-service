import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const mediaSchema = z
  .object({
    publicId: z
      .string()
      .trim()
      .min(1, "Cloudinary public ID is required")
      .max(500),

    secureUrl: z
      .string()
      .trim()
      .url("Invalid media URL")
      .max(2000),

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
      .min(1)
      .max(20)
      .transform((value) => value.toLowerCase()),

    bytes: z
      .number()
      .int()
      .nonnegative()
      .max(100_000_000),

    resourceType: z.literal("image"),

    alt: z
      .string()
      .trim()
      .max(200, "Alt text cannot exceed 200 characters")
      .default(""),
  })
  .strict();

const stringArray = (label: string, maxItems: number) =>
  z
    .array(
      z
        .string()
        .trim()
        .min(1, `${label} item cannot be empty`)
        .max(300, `${label} item cannot exceed 300 characters`)
    )
    .max(maxItems, `${label} cannot contain more than ${maxItems} items`)
    .default([]);

const processStepSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Process step title is required")
      .max(120),

    description: z
      .string()
      .trim()
      .min(2, "Process step description is required")
      .max(500),
  })
  .strict();

export const createServiceSchema = z
  .object({
    /*
     * BASIC INFORMATION
     */

    title: z
      .string()
      .trim()
      .min(2, "Service title is required")
      .max(120, "Service title cannot exceed 120 characters"),

    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(2, "Service slug is required")
      .max(160, "Service slug cannot exceed 160 characters")
      .regex(
        slugRegex,
        "Slug can only contain lowercase letters, numbers and hyphens"
      ),

    shortDescription: z
      .string()
      .trim()
      .min(10, "Short description must be at least 10 characters")
      .max(300, "Short description cannot exceed 300 characters"),

    description: z
      .string()
      .trim()
      .min(20, "Description must be at least 20 characters")
      .max(10000, "Description cannot exceed 10,000 characters"),

    icon: z
      .string()
      .trim()
      .max(100, "Icon name cannot exceed 100 characters")
      .optional()
      .or(z.literal("")),

    /*
     * SERVICE CONTENT
     */

    benefits: stringArray("Benefit", 20),

    included: stringArray("Included item", 30),

    processSteps: z
      .array(processStepSchema)
      .max(12, "A maximum of 12 process steps is allowed")
      .default([]),

    suitableFor: stringArray("Suitable-for item", 20),

    /*
     * SERVICE DETAILS
     */

    estimatedTime: z
      .string()
      .trim()
      .max(100, "Estimated time cannot exceed 100 characters")
      .optional()
      .or(z.literal("")),

    emergencyService: z.boolean().default(false),

    onSiteService: z.boolean().default(false),

    /*
     * MEDIA
     */

    heroImage: mediaSchema.nullable().optional(),

    gallery: z
      .array(mediaSchema)
      .max(12, "A maximum of 12 gallery images is allowed")
      .default([]),

    ogImage: mediaSchema.nullable().optional(),

    /*
     * CTA
     */

    ctaText: z
      .string()
      .trim()
      .max(100, "CTA text cannot exceed 100 characters")
      .optional()
      .or(z.literal("")),

    ctaLink: z
      .string()
      .trim()
      .max(500, "CTA link cannot exceed 500 characters")
      .refine(
        (value) =>
          value === "" ||
          value.startsWith("/") ||
          value.startsWith("https://") ||
          value.startsWith("http://") ||
          value.startsWith("tel:") ||
          value.startsWith("mailto:"),
        "CTA link must be a valid internal path or URL"
      )
      .optional()
      .or(z.literal("")),

    /*
     * DISPLAY / PUBLISHING
     */

    featured: z.boolean().default(false),

    displayOrder: z
      .number()
      .int("Display order must be a whole number")
      .min(0, "Display order cannot be negative")
      .max(100000, "Display order is too large")
      .default(0),

    status: z.enum(["active", "inactive"]).default("inactive"),

    /*
     * SEO
     */

    seoTitle: z
      .string()
      .trim()
      .max(70, "SEO title cannot exceed 70 characters")
      .optional()
      .or(z.literal("")),

    seoDescription: z
      .string()
      .trim()
      .max(170, "SEO description cannot exceed 170 characters")
      .optional()
      .or(z.literal("")),
  })
  .strict()
  .superRefine((data, ctx) => {
    const hasCtaText = Boolean(data.ctaText?.trim());
    const hasCtaLink = Boolean(data.ctaLink?.trim());

    if (hasCtaText !== hasCtaLink) {
      ctx.addIssue({
        code: "custom",
        path: ["ctaText"],
        message: "CTA text and CTA link must be provided together",
      });
    }

    if (data.status === "active" && !data.title.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["title"],
        message: "An active service must have a title",
      });
    }
  });

export type CreateServiceInput = z.infer<typeof createServiceSchema>;