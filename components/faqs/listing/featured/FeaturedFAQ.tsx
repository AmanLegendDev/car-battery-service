import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  HelpCircle,
} from "lucide-react";

import type { PublicFAQ } from "../FAQsListingPage";

interface FeaturedFAQProps {
  faq: PublicFAQ | null;
}

export default function FeaturedFAQ({
  faq,
}: FeaturedFAQProps) {
  if (!faq) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#0D6E91]/[0.05] blur-[110px]" />

        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#FFD400]/[0.06] blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        {/* Section label */}
        <div className="mb-8 flex items-center gap-3">
          <span className="h-px w-10 bg-[#0D6E91]" />

          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0D6E91]">
            Featured question
          </span>
        </div>

        {/* Featured card */}
        <article className="relative overflow-hidden rounded-[2rem] bg-[#061A2B]">
          {/* Atmosphere */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#0D6E91]/20 blur-[110px]" />

            <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#FFD400]/[0.07] blur-[100px]" />
          </div>

          <div className="relative grid lg:grid-cols-[0.35fr_1fr]">
            {/* Side information */}
            <div className="border-b border-white/10 p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFD400]/10 text-[#FFD400]">
                <HelpCircle
                  size={21}
                  strokeWidth={1.7}
                />
              </div>

              <p className="mt-8 text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
                {faq.category}
              </p>

              <p className="mt-2 text-sm leading-6 text-white/55">
                A commonly highlighted question from
                the available FAQ collection.
              </p>
            </div>

            {/* Question + answer */}
            <div className="p-7 sm:p-10 lg:p-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFD400]">
                Question
              </p>

              <h2 className="mt-5 max-w-3xl text-[clamp(1.7rem,3vw,3rem)] font-semibold leading-[1.1] tracking-[-0.04em] text-white">
                {faq.question}
              </h2>

              <div className="my-8 h-px bg-white/10" />

              <p className="max-w-3xl whitespace-pre-line text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
                {faq.answer}
              </p>

              <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
                  {faq.category}
                </span>

                <Link
                  href="#faqs"
                  className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-white/70 transition hover:text-[#FFD400]"
                >
                  Browse all questions

                  <ArrowDown
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-y-0.5"
                  />
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}