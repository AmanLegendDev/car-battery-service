import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import Service from "@/models/Service";
import ServiceArea from "@/models/ServiceArea";
import { sanitizeBlogHtml } from "@/lib/blog/sanitizeBlogHtml";
import {
  updateBlogSchema,
} from "@/validations/blog";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

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
  return Array.from(
    new Set(
      tags
        .map((tag) => tag.trim())
        .filter(Boolean)
        .map((tag) =>
          tag
            .replace(/\s+/g, " ")
            .toLowerCase()
        )
    )
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

    coverImage:
      data.coverImage ?? null,

    authorName:
      data.authorName,

    authorRole:
      data.authorRole,

    authorImage:
      data.authorImage ?? null,

    category:
      data.category,

    tags:
      data.tags ?? [],

    status:
      data.status,

    featured:
      data.featured,

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
      Array.isArray(
        data.relatedServices
      )
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

    createdAt:
      data.createdAt,

    updatedAt:
      data.updatedAt,
  };
}

async function requireAdmin() {
  const session = await auth();

  if (
    session?.user?.role !==
    "admin"
  ) {
    return null;
  }

  return session;
}

async function getValidId(
  context: RouteContext
) {
  const { id } =
    await context.params;

  if (
    !mongoose.Types.ObjectId.isValid(
      id
    )
  ) {
    return null;
  }

  return id;
}

async function validateRelations(
  relatedServices: string[],
  relatedServiceAreas: string[]
) {
  if (relatedServices.length) {
    const count =
      await Service.countDocuments({
        _id: {
          $in: relatedServices,
        },
      });

    if (
      count !==
      relatedServices.length
    ) {
      return false;
    }
  }

  if (relatedServiceAreas.length) {
    const count =
      await ServiceArea.countDocuments({
        _id: {
          $in: relatedServiceAreas,
        },
      });

    if (
      count !==
      relatedServiceAreas.length
    ) {
      return false;
    }
  }

  return true;
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const session =
      await requireAdmin();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const id =
      await getValidId(context);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid blog post ID.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const blog =
      await Blog.findById(id).lean();

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Blog post not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serializeBlog(blog),
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch blog post.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const session =
      await requireAdmin();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const id =
      await getValidId(context);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid blog post ID.",
        },
        { status: 400 }
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
      updateBlogSchema.safeParse(body);

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

    await connectDB();

    const blog =
      await Blog.findById(id);

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Blog post not found.",
        },
        { status: 404 }
      );
    }

    if (data.slug !== undefined) {
      const normalizedSlug =
        slugify(data.slug);

      if (!normalizedSlug) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid slug.",
            field: "slug",
          },
          { status: 400 }
        );
      }

      const duplicate =
        await Blog.exists({
          slug: normalizedSlug,
          _id: {
            $ne: id,
          },
        });

      if (duplicate) {
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

      data.slug =
        normalizedSlug;
    }

    if (
      data.content !== undefined
    ) {
      const sanitized =
        sanitizeBlogHtml(
          data.content
        );

      if (!sanitized) {
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

      data.content = sanitized;
    }

    if (data.tags !== undefined) {
      data.tags =
        normalizeTags(
          data.tags
        );
    }

    if (
      data.relatedServices !==
        undefined ||
      data.relatedServiceAreas !==
        undefined
    ) {
      const relatedServices =
        data.relatedServices ??
        blog.relatedServices.map(
          (id) => String(id)
        );

      const relatedServiceAreas =
        data.relatedServiceAreas ??
        blog.relatedServiceAreas.map(
          (id) => String(id)
        );

      const relationsValid =
        await validateRelations(
          relatedServices,
          relatedServiceAreas
        );

      if (!relationsValid) {
        return NextResponse.json(
          {
            success: false,
            message:
              "One or more related content references are invalid.",
          },
          { status: 400 }
        );
      }
    }

    if (
      data.status === "published"
    ) {
      blog.publishedAt =
        data.publishedAt
          ? new Date(
              data.publishedAt
            )
          : blog.publishedAt ??
            new Date();

      blog.scheduledAt = null;
    }

    if (
      data.status === "draft"
    ) {
      blog.scheduledAt = null;
    }

    if (
      data.status === "scheduled"
    ) {
      blog.publishedAt = null;

      blog.scheduledAt =
        data.scheduledAt
          ? new Date(
              data.scheduledAt
            )
          : blog.scheduledAt;

      if (!blog.scheduledAt) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Scheduled posts require a scheduled date.",
            field: "scheduledAt",
          },
          { status: 400 }
        );
      }

      if (
        blog.scheduledAt.getTime() <=
        Date.now()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Scheduled date must be in the future.",
            field: "scheduledAt",
          },
          { status: 400 }
        );
      }
    }

    const mutableData =
      data as Record<
        string,
        unknown
      >;

    for (const [
      key,
      value,
    ] of Object.entries(
      mutableData
    )) {
      if (
        value !== undefined &&
        key !== "publishedAt" &&
        key !== "scheduledAt"
      ) {
        (
          blog as unknown as Record<
            string,
            unknown
          >
        )[key] = value;
      }
    }

    await blog.save();

    return NextResponse.json({
      success: true,
      message:
        "Blog post updated successfully.",
      data:
        serializeBlog(blog),
    });
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
          "Failed to update blog post.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    const session =
      await requireAdmin();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const id =
      await getValidId(context);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid blog post ID.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const blog =
      await Blog.findById(id);

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Blog post not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Deliberately do NOT delete Cloudinary
     * assets here. Media may be reused/shared.
     *
     * Asset cleanup can be handled later by
     * an explicit media-management workflow.
     */
    await Blog.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message:
        "Blog post deleted successfully.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete blog post.",
      },
      { status: 500 }
    );
  }
}