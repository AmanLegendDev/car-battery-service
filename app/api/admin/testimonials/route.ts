import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import {
  createTestimonialSchema,
} from "@/validations/testimonial";



function serializeTestimonial(testimonial: unknown) {
  const data = testimonial as Record<string, unknown>;

  // existing return yahin se
  return {
    id: String(data._id),
    name: data.name,
    businessName:
      data.businessName ?? "",
    role: data.role ?? "",
    photo: data.photo ?? undefined,
    testimonial:
      data.testimonial,
    rating:
      data.rating ?? undefined,
    featured:
      data.featured ?? false,
    published:
      data.published ?? false,
    displayOrder:
      data.displayOrder ?? 0,
    createdAt:
      data.createdAt,
    updatedAt:
      data.updatedAt,
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

    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const search =
      searchParams.get("search")?.trim() ||
      "";

    const publishedParam =
      searchParams.get("published");

    const featuredParam =
      searchParams.get("featured");

    const ratingParam =
      searchParams.get("rating");

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(searchParams.get("limit")) || 20,
        1
      ),
      100
    );

    const filter: Record<string, unknown> =
      {};

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          businessName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          testimonial: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (publishedParam === "true") {
      filter.published = true;
    }

    if (publishedParam === "false") {
      filter.published = false;
    }

    if (featuredParam === "true") {
      filter.featured = true;
    }

    if (featuredParam === "false") {
      filter.featured = false;
    }

    if (ratingParam) {
      const rating = Number(ratingParam);

      if (
        Number.isFinite(rating) &&
        rating >= 1 &&
        rating <= 5
      ) {
        filter.rating = rating;
      }
    }

    const skip = (page - 1) * limit;

    const [
      testimonials,
      total,
    ] = await Promise.all([
      Testimonial.find(filter)
        .sort({
          displayOrder: 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Testimonial.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: testimonials.map(
        (testimonial) =>
        serializeTestimonial(testimonial)
      ),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit
        ),
      },
    });
  } catch (error) {
    console.error(
      "GET /api/admin/testimonials error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load testimonials.",
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

    await connectDB();

    const body: unknown =
      await request.json();

    const parsed =
      createTestimonialSchema.safeParse(
        body
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors:
            parsed.error.flatten()
              .fieldErrors,
        },
        { status: 400 }
      );
    }

    const input = parsed.data;

    const testimonial =
      await Testimonial.create({
        name: input.name,
        businessName:
          input.businessName || undefined,
        role:
          input.role || undefined,
        photo: input.photo,
        testimonial:
          input.testimonial,
        rating: input.rating,
        featured: input.featured,
        published: input.published,
        displayOrder:
          input.displayOrder,
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Testimonial created successfully.",
        data: {
          id: testimonial._id.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/admin/testimonials error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create testimonial.",
      },
      { status: 500 }
    );
  }
}