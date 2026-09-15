import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Service from "@/models/Service";
import { createServiceSchema } from "@/validations/service";

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}


function serializeService(service: {
  _id: unknown;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  icon?: string;
  heroImage?: unknown;
  gallery?: unknown[];
  benefits?: string[];
  included?: string[];
  processSteps?: unknown[];
  suitableFor?: string[];
  estimatedTime?: string;
  emergencyService?: boolean;
  onSiteService?: boolean;
  ctaText?: string;
  ctaLink?: string;
  featured?: boolean;
  displayOrder?: number;
  status?: "active" | "inactive";
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: unknown;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: String(service._id),
    title: service.title,
    slug: service.slug,
    shortDescription: service.shortDescription ?? "",
    description: service.description ?? "",
    icon: service.icon ?? "",
    heroImage: service.heroImage ?? null,
    gallery: service.gallery ?? [],
    benefits: service.benefits ?? [],
    included: service.included ?? [],
    processSteps: service.processSteps ?? [],
    suitableFor: service.suitableFor ?? [],
    estimatedTime: service.estimatedTime ?? "",
    emergencyService: service.emergencyService ?? false,
    onSiteService: service.onSiteService ?? false,
    ctaText: service.ctaText ?? "",
    ctaLink: service.ctaLink ?? "",
    featured: service.featured ?? false,
    displayOrder: service.displayOrder ?? 0,
    status: service.status ?? "inactive",
    seoTitle: service.seoTitle ?? "",
    seoDescription: service.seoDescription ?? "",
    ogImage: service.ogImage ?? null,
    createdAt: service.createdAt ?? null,
    updatedAt: service.updatedAt ?? null,
  };
}

/**
 * GET /api/admin/services
 *
 * Used by:
 * - Admin service listing
 * - Blog relationship selector
 * - Other admin CMS modules
 */
export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status") ?? "";
    const featured = searchParams.get("featured") ?? "";

    const pageParam = Number(searchParams.get("page") ?? "1");
    const limitParam = Number(searchParams.get("limit") ?? "20");

    const page =
      Number.isInteger(pageParam) && pageParam > 0
        ? pageParam
        : 1;

    const limit =
      Number.isInteger(limitParam) &&
      limitParam > 0 &&
      limitParam <= 100
        ? limitParam
        : 20;

    await connectDB();

    const filter: Record<string, unknown> = {};

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
      ];
    }

    if (status === "active" || status === "inactive") {
      filter.status = status;
    }

    if (featured === "true") {
      filter.featured = true;
    }

    if (featured === "false") {
      filter.featured = false;
    }

    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      Service.find(filter)
        .sort({
          displayOrder: 1,
          title: 1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Service.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: services.map(serializeService),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Fetch services error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch services.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/services
 *
 * Creates a new service.
 */
export async function POST(request: Request) {
  try {
    /* 1. AUTHENTICATION */

    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    /* 2. PARSE REQUEST */

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
        },
        { status: 400 }
      );
    }

    /* 3. SERVER-SIDE VALIDATION */

    const parsed = createServiceSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      return NextResponse.json(
        {
          success: false,
          message: "Please fix the validation errors.",
          errors: fieldErrors,
        },
        { status: 422 }
      );
    }

    const data = parsed.data;

    /* 4. NORMALIZE SLUG */

    const normalizedSlug = slugify(data.slug);

    if (!normalizedSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid service slug.",
          errors: {
            slug: ["Invalid service slug"],
          },
        },
        { status: 422 }
      );
    }

    /* 5. DATABASE CONNECTION */

    await connectDB();

    /* 6. UNIQUE SLUG CHECK */

    const existingService = await Service.exists({
      slug: normalizedSlug,
    });

    if (existingService) {
      return NextResponse.json(
        {
          success: false,
          message: "A service with this slug already exists.",
          errors: {
            slug: ["This slug is already in use."],
          },
        },
        { status: 409 }
      );
    }

    /* 7. CREATE SERVICE */

  const service = new Service({
  ...data,
  slug: normalizedSlug,
  heroImage: data.heroImage ?? undefined,
});

await service.save();

    /* 8. SAFE RESPONSE */

  return NextResponse.json(
  {
    success: true,
    message: "Service created successfully.",
    data: {
      id: service._id.toString(),
      title: service.title,
      slug: service.slug,
      status: service.status,
    },
  },
  { status: 201 }
);
  } catch (error: unknown) {
    /* MongoDB duplicate-key protection */

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A service with this slug already exists.",
          errors: {
            slug: ["This slug is already in use."],
          },
        },
        { status: 409 }
      );
    }

    console.error("Create service error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create service. Please try again.",
      },
      { status: 500 }
    );
  }
}