import { z } from "zod";

const mediaSchema = z
  .object({
    publicId: z.string().trim().min(1).max(500),

    secureUrl: z
      .string()
      .trim()
      .url()
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

const objectIdSchema = z
  .string()
  .regex(
    /^[a-f\d]{24}$/i,
    "Invalid ID."
  );

const tagSchema = z
  .string()
  .trim()
  .min(1)
  .max(50);

const baseBlogSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5)
      .max(160),

    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(2)
      .max(180)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug can only contain lowercase letters, numbers and hyphens."
      ),

    excerpt: z
      .string()
      .trim()
      .min(20)
      .max(400),

    content: z
      .string()
      .trim()
      .min(20)
      .max(500000)
      .refine(
        (value) => {
          const text = value
            .replace(/<[^>]*>/g, " ")
            .replace(/&nbsp;/g, " ")
            .trim();

          return text.length >= 10;
        },
        {
          message:
            "Blog content cannot be empty.",
        }
      ),

    coverImage: mediaSchema
      .nullable()
      .optional()
      .default(null),

    authorName: z
      .string()
      .trim()
      .min(2)
      .max(100),

    authorRole: z
      .string()
      .trim()
      .max(120)
      .default(""),

    authorImage: mediaSchema
      .nullable()
      .optional()
      .default(null),

    category: z
      .string()
      .trim()
      .min(2)
      .max(80),

    tags: z
      .array(tagSchema)
      .max(20)
      .default([]),

    status: z
      .enum([
        "draft",
        "published",
        "scheduled",
      ])
      .default("draft"),

    featured: z
      .boolean()
      .default(false),

    publishedAt: z
      .string()
      .datetime({
        offset: true,
      })
      .nullable()
      .optional()
      .default(null),

    scheduledAt: z
      .string()
      .datetime({
        offset: true,
      })
      .nullable()
      .optional()
      .default(null),

    displayOrder: z
      .number()
      .int()
      .min(0)
      .max(100000)
      .default(0),

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

    canonicalUrl: z
      .string()
      .trim()
      .max(2000)
      .refine(
        (value) =>
          value === "" ||
          value.startsWith("https://") ||
          value.startsWith("http://"),
        {
          message:
            "Canonical URL must be HTTP or HTTPS.",
        }
      )
      .default(""),

    noIndex: z
      .boolean()
      .default(false),

    ogTitle: z
      .string()
      .trim()
      .max(120)
      .default(""),

    ogDescription: z
      .string()
      .trim()
      .max(300)
      .default(""),

    ogImage: mediaSchema
      .nullable()
      .optional()
      .default(null),

    relatedServices: z
      .array(objectIdSchema)
      .max(20)
      .default([]),

    relatedServiceAreas: z
      .array(objectIdSchema)
      .max(20)
      .default([]),
  })
  .strict();

export const createBlogSchema =
  baseBlogSchema.superRefine(
    (data, context) => {
      if (
        data.status === "scheduled" &&
        !data.scheduledAt
      ) {
        context.addIssue({
          code: "custom",
          path: ["scheduledAt"],
          message:
            "Scheduled posts require a scheduled date.",
        });
      }

      if (
        data.status === "scheduled" &&
        data.scheduledAt
      ) {
        const scheduledDate =
          new Date(data.scheduledAt);

        if (
          Number.isNaN(
            scheduledDate.getTime()
          )
        ) {
          context.addIssue({
            code: "custom",
            path: ["scheduledAt"],
            message:
              "Scheduled date is invalid.",
          });
        } else if (
          scheduledDate.getTime() <=
          Date.now()
        ) {
          context.addIssue({
            code: "custom",
            path: ["scheduledAt"],
            message:
              "Scheduled date must be in the future.",
          });
        }
      }

      if (
        data.status === "published" &&
        data.scheduledAt
      ) {
        context.addIssue({
          code: "custom",
          path: ["scheduledAt"],
          message:
            "Published posts cannot have a scheduled date.",
        });
      }
    }
  );

export const updateBlogSchema =
  baseBlogSchema
    .partial()
    .superRefine(
      (data, context) => {
        if (
          data.status === "scheduled" &&
          !data.scheduledAt
        ) {
          context.addIssue({
            code: "custom",
            path: ["scheduledAt"],
            message:
              "Scheduled posts require a scheduled date.",
          });
        }

        if (
          data.status === "scheduled" &&
          data.scheduledAt
        ) {
          const date = new Date(
            data.scheduledAt
          );

          if (
            Number.isNaN(date.getTime())
          ) {
            context.addIssue({
              code: "custom",
              path: ["scheduledAt"],
              message:
                "Scheduled date is invalid.",
            });
          }
        }

        if (
          data.status === "published" &&
          data.scheduledAt
        ) {
          context.addIssue({
            code: "custom",
            path: ["scheduledAt"],
            message:
              "Published posts cannot have a scheduled date.",
          });
        }
      }
    );

export type CreateBlogInput = z.infer<
  typeof createBlogSchema
>;

export type UpdateBlogInput = z.infer<
  typeof updateBlogSchema
>;