import Link from "next/link";
import {
  ArrowUpRight,
  HelpCircle,
} from "lucide-react";

interface FAQsEmptyStateProps {
  businessName: string;
}

export default function FAQsEmptyState({
  businessName,
}: FAQsEmptyStateProps) {
  return (
    <section
      id="faqs"
      className="relative overflow-hidden bg-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0D6E91]/[0.035] blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <div className="rounded-[2rem] border border-[#061A2B]/[0.08] bg-[#F8FAFC] px-6 py-12 text-center shadow-[0_15px_50px_rgba(6,26,43,0.04)] sm:px-10 sm:py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#061A2B] text-[#FFD400]">
            <HelpCircle
              size={22}
              strokeWidth={1.7}
            />
          </div>

          <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0D6E91]">
            Frequently asked questions
          </p>

          <h2 className="mx-auto mt-4 max-w-xl text-3xl font-semibold tracking-[-0.04em] text-[#061A2B] sm:text-4xl">
            Questions and answers will appear here.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#061A2B]/45 sm:text-base">
            {businessName} has not published any FAQ
            content yet. Explore the available services
            to learn more.
          </p>

          <div className="mt-8">
            <Link
              href="/services"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#061A2B] px-6 text-sm font-bold text-white transition hover:bg-[#08263D]"
            >
              Explore services

              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}