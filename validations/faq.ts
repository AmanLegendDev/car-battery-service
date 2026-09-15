import { z } from "zod";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid ID.");

const questionSchema = z
  .string()
  .trim()
  .min(5, "Question must be at least 5 characters.")
  .max(300, "Question cannot exceed 300 characters.");

const answerSchema = z
  .string()
  .trim()
  .min(10, "Answer must be at least 10 characters.")
  .max(5000, "Answer cannot exceed 5000 characters.");

const categorySchema = z
  .string()
  .trim()
  .min(2, "Category must be at least 2 characters.")
  .max(100, "Category cannot exceed 100 characters.");

export const createFAQSchema = z
  .object({
    question: questionSchema,

    answer: answerSchema,

    category: categorySchema,

    relatedServices: z
      .array(objectIdSchema)
      .max(50, "Too many related services.")
      .default([]),

    relatedServiceAreas: z
      .array(objectIdSchema)
      .max(50, "Too many related service areas.")
      .default([]),

    featured: z
      .boolean()
      .default(false),

    displayOrder: z
      .number()
      .int("Display order must be a whole number.")
      .min(0, "Display order cannot be negative.")
      .max(100000, "Display order is too large.")
      .default(0),

    status: z
      .enum(["active", "inactive"])
      .default("inactive"),
  })
  .strict();

export const updateFAQSchema = createFAQSchema.partial().strict();

export type CreateFAQInput = z.infer<typeof createFAQSchema>;
export type UpdateFAQInput = z.infer<typeof updateFAQSchema>;