import type { Metadata } from "next";

import TestimonialForm from "@/components/admin/testimonials/TestimonialForm";

export const metadata: Metadata = {
  title: "Add Testimonial | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewTestimonialPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Testimonial Management
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
          Add Testimonial
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Add genuine customer feedback to
          the testimonial library. Customer
          photos and ratings are optional.
        </p>
      </div>

      <TestimonialForm />
    </main>
  );
}