import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Testimonial from "@/models/Testimonial";

import { updateTestimonialSchema } from "@/validations/testimonial";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}



function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

/* =========================================================
   GET SINGLE TESTIMONIAL
========================================================= */

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const session = await auth();

   if (session?.user?.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid testimonial ID.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const testimonial = await Testimonial.findById(id).lean();

    if (!testimonial) {
      return NextResponse.json(
        {
          success: false,
          message: "Testimonial not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/testimonials/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load testimonial.",
      },
      { status: 500 },
    );
  }
}

/* =========================================================
   PATCH TESTIMONIAL
========================================================= */

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const session = await auth();

   if (session?.user?.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid testimonial ID.",
        },
        { status: 400 },
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
        { status: 400 },
      );
    }

    const parsed = updateTestimonialSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 422 },
      );
    }

    await connectDB();

    const existing = await Testimonial.findById(id);

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Testimonial not found.",
        },
        { status: 404 },
      );
    }

    const input = parsed.data;

    /* =====================================================
       UPDATE ONLY SUPPORTED TESTIMONIAL FIELDS
    ===================================================== */

    if (input.name !== undefined) {
      existing.name = input.name;
    }

    if (input.businessName !== undefined) {
      existing.businessName =
        input.businessName || undefined;
    }

    if (input.role !== undefined) {
      existing.role = input.role || undefined;
    }

    if (input.photo !== undefined) {
      existing.photo = input.photo;
    }

    if (input.testimonial !== undefined) {
      existing.testimonial = input.testimonial;
    }

    if (input.rating !== undefined) {
      existing.rating = input.rating;
    }

    if (input.featured !== undefined) {
      existing.featured = input.featured;
    }

    if (input.published !== undefined) {
      existing.published = input.published;
    }

    if (input.displayOrder !== undefined) {
      existing.displayOrder = input.displayOrder;
    }

    await existing.save();

    return NextResponse.json({
      success: true,
      message: "Testimonial updated successfully.",
      data: {
        id: existing._id.toString(),
      },
    });
  } catch (error) {
    console.error(
      "PATCH /api/admin/testimonials/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update testimonial.",
      },
      { status: 500 },
    );
  }
}

/* =========================================================
   DELETE TESTIMONIAL
========================================================= */

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid testimonial ID.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const testimonial =
      await Testimonial.findById(id);

    if (!testimonial) {
      return NextResponse.json(
        {
          success: false,
          message: "Testimonial not found.",
        },
        { status: 404 },
      );
    }

    await Testimonial.deleteOne({
      _id: id,
    });

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/testimonials/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete testimonial.",
      },
      { status: 500 },
    );
  }
}