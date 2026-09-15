import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import Service from "@/models/Service";
import ServiceArea from "@/models/ServiceArea";
import { sanitizeBlogHtml } from "@/lib/blog/sanitizeBlogHtml";
import {
  createBlogSchema,
} from "@/validations/blog";

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeTags(
  tags: string[]
): string[] {
  const normalized = tags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) =>
      tag
        .replace(/\s+/g, " ")
        .toLowerCase()
    );

  return Array.from(
    new Set(normalized)
  );
}



function serializeBlog(blog: unknown) {
  const data =
    blog as Record<string, unknown>;

  return {
    id: String(data._id),
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    coverImage: data.coverImage ?? null,

    authorName: data.authorName,
    authorRole: data.authorRole,
    authorImage: data.authorImage ?? null,

    category: data.category,
    tags: data.tags ?? [],

    status: data.status,
    featured: data.featured,

    publishedAt:
      data.publishedAt ?? null,

    scheduledAt:
      data.scheduledAt ?? null,

    displayOrder:
      data.displayOrder ?? 0,

    seoTitle:
      data.seoTitle ?? "",

    seoDescription:
      data.seoDescription ?? "",

    canonicalUrl:
      data.canonicalUrl ?? "",

    noIndex:
      data.noIndex ?? false,

    ogTitle:
      data.ogTitle ?? "",

    ogDescription:
      data.ogDescription ?? "",

    ogImage:
      data.ogImage ?? null,

    relatedServices:
      Array.isArray(data.relatedServices)
        ? data.relatedServices.map(
            (id) => String(id)
          )
        : [],

    relatedServiceAreas:
      Array.isArray(
        data.relatedServiceAreas
      )
        ? data.relatedServiceAreas.map(
            (id) => String(id)
          )
        : [],

    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

async function validateRelations(
  relatedServices: string[],
  relatedServiceAreas: string[]
) {
  if (relatedServices.length > 0) {
    const count =
      await Service.countDocuments({
        _id: {
          $in: relatedServices,
        },
      });

    if (
      count !== relatedServices.length
    ) {
      return {
        valid: false,
        message:
          "One or more related services are invalid.",
        field: "relatedServices",
      };
    }
  }

  if (
    relatedServiceAreas.length > 0
  ) {
    const count =
      await ServiceArea.countDocuments({
        _id: {
          $in: relatedServiceAreas,
        },
      });

    if (
      count !== relatedServiceAreas.length
    ) {
      return {
        valid: false,
        message:
          "One or more related service areas are invalid.",
        field: "relatedServiceAreas",
      };
    }
  }

  return {
    valid: true,
  };
}

export async function GET(
  request: Request
) {
  try {
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const { searchParams } =
      new URL(request.url);

    const search =
      searchParams
        .get("search")
        ?.trim() ?? "";

    const status =
      searchParams
        .get("status")
        ?.trim() ?? "";

    const category =
      searchParams
        .get("category")
        ?.trim() ?? "";

    const featured =
      searchParams
        .get("featured")
        ?.trim() ?? "";

    const pageValue = Number(
      searchParams.get("page") ?? "1"
    );

    const limitValue = Number(
      searchParams.get("limit") ?? "20"
    );

    const page =
      Number.isInteger(pageValue) &&
      pageValue > 0
        ? pageValue
        : 1;

    const limit =
      Number.isInteger(limitValue) &&
      limitValue > 0 &&
      limitValue <= 100
        ? limitValue
        : 20;

    const filter: Record<
      string,
      unknown
    > = {};

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          slug: {
            $regex: search,
            $options: "i",
          },
        },
        {
          excerpt: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (
      status === "draft" ||
      status === "published" ||
      status === "scheduled"
    ) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (featured === "true") {
      filter.featured = true;
    }

    if (featured === "false") {
      filter.featured = false;
    }

    await connectDB();

    const skip =
      (page - 1) * limit;

    const [blogs, total] =
      await Promise.all([
        Blog.find(filter)
          .sort({
            displayOrder: 1,
            publishedAt: -1,
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit)
          .lean(),

        Blog.countDocuments(filter),
      ]);

    return NextResponse.json({
      success: true,

      data: blogs.map(
        serializeBlog
      ),

      pagination: {
        page,
        limit,
        total,
        totalPages:
          Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch blog posts.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    const parsed =
      createBlogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Validation failed.",
          errors:
            parsed.error.flatten()
              .fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const normalizedSlug =
      slugify(data.slug);

    if (!normalizedSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid slug.",
          field: "slug",
        },
        { status: 400 }
      );
    }

    const sanitizedContent =
      sanitizeBlogHtml(
        data.content
      );

    if (!sanitizedContent) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Blog content cannot be empty.",
          field: "content",
        },
        { status: 400 }
      );
    }

    const normalizedTags =
      normalizeTags(data.tags);

    await connectDB();

    const existingBlog =
      await Blog.exists({
        slug: normalizedSlug,
      });

    if (existingBlog) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A blog post with this slug already exists.",
          field: "slug",
        },
        { status: 409 }
      );
    }

    const relationCheck =
      await validateRelations(
        data.relatedServices,
        data.relatedServiceAreas
      );

    if (!relationCheck.valid) {
      return NextResponse.json(
        {
          success: false,
          message:
            relationCheck.message,
          field:
            relationCheck.field,
        },
        { status: 400 }
      );
    }

    let publishedAt: Date | null =
      data.publishedAt
        ? new Date(data.publishedAt)
        : null;

    let scheduledAt: Date | null =
      data.scheduledAt
        ? new Date(data.scheduledAt)
        : null;

    if (data.status === "published") {
      if (!publishedAt) {
        publishedAt = new Date();
      }

      scheduledAt = null;
    }

    if (data.status === "draft") {
      scheduledAt = null;
    }

    if (data.status === "scheduled") {
      publishedAt = null;
    }

    const blog =
      await Blog.create({
        ...data,

        slug: normalizedSlug,

        content:
          sanitizedContent,

        tags: normalizedTags,

        publishedAt,

        scheduledAt,
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Blog post created successfully.",
        data:
          serializeBlog(blog),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: number })
        .code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A blog post with this slug already exists.",
          field: "slug",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create blog post.",
      },
      { status: 500 }
    );
  }
}