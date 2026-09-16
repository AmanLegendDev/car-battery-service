import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { connectDB } from "@/lib/db";
import FAQ from "@/models/FAQ";

import ServiceFAQAccordion from "./ServiceFAQAccordion";

interface ServiceFAQProps {
  serviceId: string;
  serviceTitle: string;
}

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
}

async function getServiceFAQs(
  serviceId: string,
): Promise<FAQItem[]> {
  await connectDB();

  const faqs = await FAQ.find({
    status: "active",
    relatedServices: serviceId,
  })
    .select("question answer featured displayOrder createdAt")
    .sort({
      featured: -1,
      displayOrder: 1,
      createdAt: -1,
    })
    .limit(8)
    .lean();

  return faqs.map((faq) => ({
    _id: String(faq._id),
    question: faq.question,
    answer: faq.answer,
  }));
}

export default async function ServiceFAQ({
  serviceId,
  serviceTitle,
}: ServiceFAQProps) {
  const faqs = await getServiceFAQs(serviceId);

  if (!faqs.length) {
    return null;
  }

  return (
    <section className="bg-[#F8FAFC] text-[#061A2B]">
      <div className="mx-auto max-w-[1420px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.38fr_0.62fr] lg:gap-24">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#061A2B]/45">
                Common Questions
              </span>
            </div>

            <h2 className="mt-6 max-w-md text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl">
              Questions about {serviceTitle}.
            </h2>

            <p className="mt-6 max-w-sm text-sm leading-7 text-[#061A2B]/50">
              Answers to questions specifically connected to this service.
            </p>

            <Link
              href="/faqs"
              className="group mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#061A2B]/60 transition-colors hover:text-[#061A2B]"
            >
              View all FAQs

              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#061A2B]/10 transition-all duration-300 group-hover:rotate-45 group-hover:border-[#061A2B]/25">
                <ArrowUpRight
                  className="h-3.5 w-3.5"
                  strokeWidth={1.8}
                />
              </span>
            </Link>
          </div>

          <ServiceFAQAccordion items={faqs} />
        </div>
      </div>
    </section>
  );
}