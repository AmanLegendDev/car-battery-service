import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import FAQ from "@/models/FAQ";
import Service from "@/models/Service";
import ServiceArea from "@/models/ServiceArea";
import { createFAQSchema } from "@/validations/faq";


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

    relatedServices: (faq.relatedServices ?? []).map((id) =>
      String(id)
    ),

    relatedServiceAreas: (faq.relatedServiceAreas ?? []).map(
      (id) => String(id)
    ),

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

  const invalidServiceId = serviceIds.find(
    (id) => !mongoose.isValidObjectId(id)
  );

  if (invalidServiceId) {
    return {
      success: false as const,
      message: "One or more related service IDs are invalid.",
      field: "relatedServices",
    };
  }

  const invalidAreaId = areaIds.find(
    (id) => !mongoose.isValidObjectId(id)
  );

  if (invalidAreaId) {
    return {
      success: false as const,
      message: "One or more related service area IDs are invalid.",
      field: "relatedServiceAreas",
    };
  }

  const [servicesCount, areasCount] = await Promise.all([
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
      message: "One or more related services do not exist.",
      field: "relatedServices",
    };
  }

  if (areasCount !== areaIds.length) {
    return {
      success: false as const,
      message: "One or more related service areas do not exist.",
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
 * GET /api/admin/faqs
 *
 * Admin FAQ listing + search + filters + pagination.
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
    const category =
      searchParams.get("category")?.trim() ?? "";

    const status = searchParams.get("status") ?? "";
    const featured = searchParams.get("featured") ?? "";

    const pageParam = Number(
      searchParams.get("page") ?? "1"
    );

    const limitParam = Number(
      searchParams.get("limit") ?? "20"
    );

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
          question: {
            $regex: search,
            $options: "i",
          },
        },
        {
          answer: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (category) {
      filter.category = {
        $regex: `^${category}$`,
        $options: "i",
      };
    }

    if (
      status === "active" ||
      status === "inactive"
    ) {
      filter.status = status;
    }

    if (featured === "true") {
      filter.featured = true;
    }

    if (featured === "false") {
      filter.featured = false;
    }

    const skip = (page - 1) * limit;

    const [faqs, total] = await Promise.all([
      FAQ.find(filter)
        .sort({
          displayOrder: 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      FAQ.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,

      data: faqs.map(serializeFAQ),

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Fetch FAQs error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch FAQs.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/faqs
 *
 * Create FAQ.
 */
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

    const parsed = createFAQSchema.safeParse(body);

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

    const relationshipCheck =
      await validateRelationships(
        data.relatedServices,
        data.relatedServiceAreas
      );

    if (!relationshipCheck.success) {
      return NextResponse.json(
        {
          success: false,
          message: relationshipCheck.message,
          field: relationshipCheck.field,
        },
        { status: 422 }
      );
    }

    const faq = await FAQ.create({
      ...data,

      relatedServices:
        relationshipCheck.relatedServices,

      relatedServiceAreas:
        relationshipCheck.relatedServiceAreas,
    });

    return NextResponse.json(
      {
        success: true,
        message: "FAQ created successfully.",
        data: serializeFAQ(faq),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Create FAQ error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to create FAQ. Please try again.",
      },
      { status: 500 }
    );
  }
}