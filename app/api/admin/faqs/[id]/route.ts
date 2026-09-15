import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import FAQ from "@/models/FAQ";
import Service from "@/models/Service";
import ServiceArea from "@/models/ServiceArea";
import { updateFAQSchema } from "@/validations/faq";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}



function serializeFAQ(faq: {
  _id: unknown;
  question: string;
  answer: string;
  category: string;
  relatedServices?: unknown[];
  relatedServiceAreas?: unknown[];
  featured: boolean;
  displayOrder: number;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: String(faq._id),
    question: faq.question,
    answer: faq.answer,
    category: faq.category,

    relatedServices: (faq.relatedServices ?? []).map(
      (id) => String(id)
    ),

    relatedServiceAreas: (
      faq.relatedServiceAreas ?? []
    ).map((id) => String(id)),

    featured: faq.featured,
    displayOrder: faq.displayOrder,
    status: faq.status,

    createdAt: faq.createdAt,
    updatedAt: faq.updatedAt,
  };
}

function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids)];
}

async function validateRelationships(
  relatedServices: string[],
  relatedServiceAreas: string[]
) {
  const serviceIds = uniqueIds(relatedServices);
  const areaIds = uniqueIds(relatedServiceAreas);

  if (
    serviceIds.some(
      (id) => !mongoose.isValidObjectId(id)
    )
  ) {
    return {
      success: false as const,
      message: "One or more related service IDs are invalid.",
      field: "relatedServices",
    };
  }

  if (
    areaIds.some(
      (id) => !mongoose.isValidObjectId(id)
    )
  ) {
    return {
      success: false as const,
      message:
        "One or more related service area IDs are invalid.",
      field: "relatedServiceAreas",
    };
  }

  const [servicesCount, areasCount] =
    await Promise.all([
      serviceIds.length
        ? Service.countDocuments({
            _id: { $in: serviceIds },
          })
        : 0,

      areaIds.length
        ? ServiceArea.countDocuments({
            _id: { $in: areaIds },
          })
        : 0,
    ]);

  if (servicesCount !== serviceIds.length) {
    return {
      success: false as const,
      message:
        "One or more related services do not exist.",
      field: "relatedServices",
    };
  }

  if (areasCount !== areaIds.length) {
    return {
      success: false as const,
      message:
        "One or more related service areas do not exist.",
      field: "relatedServiceAreas",
    };
  }

  return {
    success: true as const,
    relatedServices: serviceIds,
    relatedServiceAreas: areaIds,
  };
}

/**
 * GET /api/admin/faqs/[id]
 */
export async function GET(
  request: Request,
  context: RouteContext
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

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid FAQ ID.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const faq = await FAQ.findById(id).lean();

    if (!faq) {
      return NextResponse.json(
        {
          success: false,
          message: "FAQ not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serializeFAQ(faq),
    });
  } catch (error: unknown) {
    console.error("Fetch FAQ error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch FAQ.",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/faqs/[id]
 *
 * Edit FAQ
 * Publish / unpublish
 * Feature / unfeature
 * Reorder
 * Relationship management
 */
export async function PATCH(
  request: Request,
  context: RouteContext
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

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid FAQ ID.",
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

    const parsed = updateFAQSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors:
            parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const data = parsed.data;

    await connectDB();

    const existingFAQ = await FAQ.findById(id);

    if (!existingFAQ) {
      return NextResponse.json(
        {
          success: false,
          message: "FAQ not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Only validate relationships when the update
     * actually changes them.
     */
    if (
      data.relatedServices !== undefined ||
      data.relatedServiceAreas !== undefined
    ) {
      const relatedServices =
        data.relatedServices ??
        existingFAQ.relatedServices.map((item) =>
          item.toString()
        );

      const relatedServiceAreas =
        data.relatedServiceAreas ??
        existingFAQ.relatedServiceAreas.map((item) =>
          item.toString()
        );

      const relationshipCheck =
        await validateRelationships(
          relatedServices,
          relatedServiceAreas
        );

      if (!relationshipCheck.success) {
        return NextResponse.json(
          {
            success: false,
            message:
              relationshipCheck.message,
            field:
              relationshipCheck.field,
          },
          { status: 422 }
        );
      }

      data.relatedServices =
        relationshipCheck.relatedServices;

      data.relatedServiceAreas =
        relationshipCheck.relatedServiceAreas;
    }

    Object.assign(existingFAQ, data);

    await existingFAQ.save();

    return NextResponse.json({
      success: true,
      message: "FAQ updated successfully.",
      data: serializeFAQ(existingFAQ),
    });
  } catch (error: unknown) {
    console.error("Update FAQ error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update FAQ. Please try again.",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/faqs/[id]
 */
export async function DELETE(
  request: Request,
  context: RouteContext
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

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid FAQ ID.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const faq = await FAQ.findByIdAndDelete(id);

    if (!faq) {
      return NextResponse.json(
        {
          success: false,
          message: "FAQ not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "FAQ deleted successfully.",
    });
  } catch (error: unknown) {
    console.error("Delete FAQ error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to delete FAQ. Please try again.",
      },
      { status: 500 }
    );
  }
}