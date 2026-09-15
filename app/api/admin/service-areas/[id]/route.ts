import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import ServiceArea from "@/models/ServiceArea";
import {
  updateServiceAreaSchema,
} from "@/validations/serviceArea";

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

function serializeServiceArea(area: any) {
  return {
    id: String(area._id),
    name: area.name,
    slug: area.slug,
    shortDescription: area.shortDescription,
    description: area.description,
    suburbs: area.suburbs,
    postcodes: area.postcodes,
    heroImage: area.heroImage,
    mapUrl: area.mapUrl,
    serviceAvailability: area.serviceAvailability,
    featured: area.featured,
    displayOrder: area.displayOrder,
    status: area.status,
    seoTitle: area.seoTitle,
    seoDescription: area.seoDescription,
    createdAt: area.createdAt,
    updatedAt: area.updatedAt,
  };
}

async function getAuthenticatedAdmin() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return null;
  }

  return session;
}

async function getId(context: RouteContext) {
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return id;
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const session = await getAuthenticatedAdmin();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const id = await getId(context);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid service area ID.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const serviceArea = await ServiceArea.findById(id).lean();

    if (!serviceArea) {
      return NextResponse.json(
        {
          success: false,
          message: "Service area not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serializeServiceArea(serviceArea),
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch service area.",
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
    const session = await getAuthenticatedAdmin();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const id = await getId(context);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid service area ID.",
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
          message: "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    const parsed = updateServiceAreaSchema.safeParse(body);

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

    await connectDB();

    const existingArea = await ServiceArea.findById(id);

    if (!existingArea) {
      return NextResponse.json(
        {
          success: false,
          message: "Service area not found.",
        },
        { status: 404 }
      );
    }

    if (data.slug !== undefined) {
      const normalizedSlug = slugify(data.slug);

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

      const duplicate = await ServiceArea.exists({
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
              "A service area with this slug already exists.",
            field: "slug",
          },
          { status: 409 }
        );
      }

      data.slug = normalizedSlug;
    }

    Object.assign(existingArea, data);

    await existingArea.save();

    return NextResponse.json({
      success: true,
      message: "Service area updated successfully.",
      data: serializeServiceArea(existingArea),
    });
  } catch (error: any) {
    if (error?.code === 11000) {
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
        message: "Failed to update service area.",
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
    const session = await getAuthenticatedAdmin();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const id = await getId(context);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid service area ID.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const serviceArea = await ServiceArea.findById(id);

    if (!serviceArea) {
      return NextResponse.json(
        {
          success: false,
          message: "Service area not found.",
        },
        { status: 404 }
      );
    }

    await ServiceArea.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Service area deleted successfully.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete service area.",
      },
      { status: 500 }
    );
  }
}