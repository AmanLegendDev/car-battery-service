import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import ServiceArea from "@/models/ServiceArea";
import {
  createServiceAreaSchema,
} from "@/validations/serviceArea";

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}



function serializeServiceArea(area: unknown) {
  const data = area as Record<string, unknown>;
  return {
    id: String(data._id),
    name: data.name,
    slug: data.slug,
    shortDescription: data.shortDescription,
    description: data.description,
    suburbs: data.suburbs,
    postcodes: data.postcodes,
    heroImage: data.heroImage,
    mapUrl: data.mapUrl,
    serviceAvailability: data.serviceAvailability,
    featured: data.featured,
    displayOrder: data.displayOrder,
    status: data.status,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

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
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (status === "active" || status === "draft") {
      filter.status = status;
    }

    if (featured === "true") {
      filter.featured = true;
    }

    if (featured === "false") {
      filter.featured = false;
    }

    const skip = (page - 1) * limit;

    const [areas, total] = await Promise.all([
      ServiceArea.find(filter)
        .sort({
          displayOrder: 1,
          name: 1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      ServiceArea.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: areas.map(serializeServiceArea),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch service areas.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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
          message: "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    const parsed = createServiceAreaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const normalizedSlug = slugify(data.slug);

    if (!normalizedSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid slug.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const existingArea = await ServiceArea.exists({
      slug: normalizedSlug,
    });

    if (existingArea) {
      return NextResponse.json(
        {
          success: false,
          message: "A service area with this slug already exists.",
          field: "slug",
        },
        { status: 409 }
      );
    }

    const serviceArea = await ServiceArea.create({
      ...data,
      slug: normalizedSlug,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Service area created successfully.",
        data: serializeServiceArea(serviceArea),
      },
      { status: 201 }
    );
 } catch (error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === 11000
  ) {
      return NextResponse.json(
        {
          success: false,
          message: "A service area with this slug already exists.",
          field: "slug",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create service area.",
      },
      { status: 500 }
    );
  }
}