import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  FileText,
  MessageSquareQuote,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import Testimonial from "@/models/Testimonial";

import TestimonialForm, {
  type TestimonialFormData,
} from "@/components/admin/testimonials/TestimonialForm";

export const metadata: Metadata = {
  title: "Edit Review | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface EditReviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

function mapPhoto(
  photo:
    | {
        publicId?: string;
        secureUrl?: string;
        width?: number;
        height?: number;
        format?: string;
        bytes?: number;
        resourceType?: "image";
        alt?: string;
      }
    | null
    | undefined
) {
  if (!photo?.publicId || !photo.secureUrl) {
    return null;
  }

  return {
    publicId: photo.publicId,
    secureUrl: photo.secureUrl,
    width: Number(photo.width ?? 0),
    height: Number(photo.height ?? 0),
    format: String(photo.format ?? "jpg"),
    bytes: Number(photo.bytes ?? 0),
    resourceType: "image" as const,
    alt: String(photo.alt ?? ""),
  };
}

export default async function EditReviewPage({
  params,
}: EditReviewPageProps) {
  const { id } = await params;

  /*
   * Invalid MongoDB ObjectId should behave
   * like a missing review instead of throwing.
   */
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    notFound();
  }

  await connectDB();

  const testimonial = await Testimonial.findById(id)
    .select(
      [
        "name",
        "businessName",
        "role",
        "photo",
        "testimonial",
        "rating",
        "featured",
        "published",
        "displayOrder",
      ].join(" ")
    )
    .lean();

  if (!testimonial) {
    notFound();
  }

  const initialData: Partial<TestimonialFormData> = {
    name: testimonial.name ?? "",
    businessName: testimonial.businessName ?? "",
    role: testimonial.role ?? "",

    photo: mapPhoto(testimonial.photo),

    testimonial: testimonial.testimonial ?? "",

    rating:
      typeof testimonial.rating === "number"
        ? testimonial.rating
        : null,

    featured: Boolean(testimonial.featured),
    published: Boolean(testimonial.published),

    displayOrder: String(
      testimonial.displayOrder ?? 0
    ),
  };

  return (
    <main className="min-h-screen bg-[#061A2B] text-[#F8FAFC]">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">

        {/* PAGE HEADER */}
        <div className="mb-7">

          <Link
            href="/admin/reviews"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#A8BBC8] transition hover:text-[#FFD400]"
          >
            <ArrowLeft size={16} />
            Back to Reviews
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFD400] text-[#061A2B] shadow-lg shadow-[#FFD400]/10">
                <MessageSquareQuote size={21} />
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFD400]">
                  Customer Feedback
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#F8FAFC] sm:text-3xl">
                  Edit Review
                </h1>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-[#A8BBC8]">
                  Update customer details, genuine feedback,
                  rating and public visibility.
                </p>
              </div>

            </div>

            <div className="hidden items-center gap-2 rounded-xl border border-white/[0.07] bg-[#08263D] px-3 py-2 sm:flex">
              <FileText
                size={15}
                className="text-[#57C7EE]"
              />

              <span className="text-xs font-medium text-[#718895]">
                Review ID
              </span>

              <span className="font-mono text-xs text-[#A8BBC8]">
                {id.slice(-8)}
              </span>
            </div>

          </div>
        </div>

        {/* EDIT FORM */}
        <TestimonialForm
          mode="edit"
          testimonialId={id}
          initialData={initialData}
        />

      </div>
    </main>
  );
}