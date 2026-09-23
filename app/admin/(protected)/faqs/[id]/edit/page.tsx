import { notFound } from "next/navigation";
import { Types } from "mongoose";

import FAQ from "@/models/FAQ";
import { connectDB } from "@/lib/db";
import FAQForm, {
  type FAQFormState,
} from "@/components/admin/faqs/FAQForm";

export const dynamic = "force-dynamic";

interface EditFAQPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditFAQPage({
  params,
}: EditFAQPageProps) {
  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    notFound();
  }

  await connectDB();

  const faq = await FAQ.findById(id)
    .select(
      "question answer category relatedServices relatedServiceAreas featured displayOrder status"
    )
    .lean();

  if (!faq) {
    notFound();
  }

  const initialData: FAQFormState = {
    question: faq.question,
    answer: faq.answer,
    category: faq.category,

    relatedServices:
      Array.isArray(
        faq.relatedServices
      )
        ? faq.relatedServices.map(
            (value) =>
              value.toString()
          )
        : [],

    relatedServiceAreas:
      Array.isArray(
        faq.relatedServiceAreas
      )
        ? faq.relatedServiceAreas.map(
            (value) =>
              value.toString()
          )
        : [],

    featured: faq.featured,
    displayOrder:
      faq.displayOrder,
    status: faq.status,
  };

  return (
    <main className="min-h-screen bg-[#061A2B]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#FFD400]">
              FAQ Management
            </p>

            <span className="rounded-full border border-[#0D6E91]/30 bg-[#0D6E91]/10 px-2.5 py-1 text-[10px] font-black text-[#6FB9FF]">
              Editing
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Edit FAQ
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#A8BBC8]">
            Update the question, answer,
            relationships, featured visibility,
            display order or publishing status.
          </p>
        </div>

        <FAQForm
          mode="edit"
          faqId={id}
          initialData={initialData}
        />
      </div>
    </main>
  );
}