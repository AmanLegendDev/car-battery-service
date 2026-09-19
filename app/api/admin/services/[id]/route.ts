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

/*
 * GET /api/admin/services/[id]
 */
export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
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

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Service ID is required.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const service = await Service.findById(id).lean();

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serializeService(service),
    });
  } catch (error) {
    console.error("Fetch service error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch service.",
      },
      { status: 500 }
    );
  }
}

/*
 * PATCH /api/admin/services/[id]
 */
export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
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

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Service ID is required.",
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
          message: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const existingService = await Service.findById(id);

    if (!existingService) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Build a complete payload from the existing service
     * plus the incoming changes.
     */
    const currentData = {
      title: existingService.title,
      slug: existingService.slug,
      shortDescription: existingService.shortDescription,
      description: existingService.description,
      icon: existingService.icon ?? "",
      heroImage: existingService.heroImage ?? undefined,
      gallery: existingService.gallery ?? [],
      benefits: existingService.benefits ?? [],
      included: existingService.included ?? [],
      processSteps: existingService.processSteps ?? [],
      suitableFor: existingService.suitableFor ?? [],
      estimatedTime: existingService.estimatedTime ?? "",
      emergencyService: existingService.emergencyService,
      onSiteService: existingService.onSiteService,
      ctaText: existingService.ctaText ?? "",
      ctaLink: existingService.ctaLink ?? "",
      featured: existingService.featured,
      displayOrder: existingService.displayOrder,
      status: existingService.status,
      seoTitle: existingService.seoTitle ?? "",
      seoDescription: existingService.seoDescription ?? "",
      ogImage: existingService.ogImage ?? undefined,
    };

    const mergedData = {
      ...currentData,
      ...(typeof body === "object" &&
      body !== null &&
      !Array.isArray(body)
        ? body
        : {}),
    };

    /*
     * Normalize slug before validation.
     */
    if (typeof mergedData.slug === "string") {
      mergedData.slug = slugify(mergedData.slug);
    }

    /*
     * Validate the complete updated service.
     */
    const parsed = createServiceSchema.safeParse(
      mergedData
    );

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fix the validation errors.",
          errors:
            parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const data = parsed.data;

    /*
     * Check slug uniqueness, excluding current service.
     */
    const existingSlug = await Service.exists({
      slug: data.slug,
      _id: { $ne: id },
    });

    if (existingSlug) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A service with this slug already exists.",
          errors: {
            slug: ["This slug is already in use."],
          },
        },
        { status: 409 }
      );
    }

    /*
     * Update only the actual service fields.
     */
    existingService.set({
      ...data,
      slug: slugify(data.slug),
    });

    await existingService.save();

    return NextResponse.json({
      success: true,
      message: "Service updated successfully.",
      data: {
        id: existingService._id.toString(),
        title: existingService.title,
        slug: existingService.slug,
        status: existingService.status,
      },
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A service with this slug already exists.",
          errors: {
            slug: ["This slug is already in use."],
          },
        },
        { status: 409 }
      );
    }

    console.error("Update service error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update service. Please try again.",
      },
      { status: 500 }
    );
  }
}

/*
 * DELETE /api/admin/services/[id]
 */
export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
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

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Service ID is required.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const service = await Service.findById(id);

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found.",
        },
        { status: 404 }
      );
    }

    await Service.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully.",
    });
  } catch (error) {
    console.error("Delete service error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to delete service. Please try again",
      },
      { status: 500 }
    );
  }
}