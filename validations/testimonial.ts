import { z } from "zod";



const photoSchema = z
  .object({
    publicId: z
      .string()
      .trim()
      .min(1, "Photo public ID is required."),

    secureUrl: z
      .string()
      .trim()
      .url("Invalid photo URL."),

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

    resourceType: z
      .literal("image"),

    alt: z
      .string()
      .trim()
      .max(200)
      .default(""),
  })
  .strict();

export const createTestimonialSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name cannot exceed 100 characters."),

    businessName: z
      .string()
      .trim()
      .max(150, "Business name cannot exceed 150 characters.")
      .optional()
      .or(z.literal("")),

    role: z
      .string()
      .trim()
      .max(100, "Role cannot exceed 100 characters.")
      .optional()
      .or(z.literal("")),

    photo: photoSchema.optional(),

    testimonial: z
      .string()
      .trim()
      .min(10, "Testimonial must be at least 10 characters.")
      .max(
        3000,
        "Testimonial cannot exceed 3000 characters."
      ),

    rating: z
      .number()
      .min(1, "Rating must be between 1 and 5.")
      .max(5, "Rating must be between 1 and 5.")
      .optional(),

   

    featured: z
      .boolean()
      .default(false),

    published: z
      .boolean()
      .default(false),

    displayOrder: z
      .number()
      .int()
      .min(0)
      .max(100000)
      .default(0),
  })
  .strict();

export const updateTestimonialSchema =
  createTestimonialSchema.partial().strict();

export type CreateTestimonialInput = z.infer<
  typeof createTestimonialSchema
>;

export type UpdateTestimonialInput = z.infer<
  typeof updateTestimonialSchema
>;