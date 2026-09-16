import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";

export default function BlogEmptyState() {
  return (
    <section className="bg-[#F8FAFC] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#DDE7ED] bg-white px-6 py-14 text-center shadow-[0_20px_60px_rgba(6,26,43,0.07)] sm:px-10 sm:py-20">
          {/* Ambient Background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[#0D6E91]/[0.07] blur-3xl" />
            <div className="absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-[#FFD400]/[0.08] blur-3xl" />
          </div>

          {/* Icon */}
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#061A2B] text-[#FFD400] shadow-lg">
            <BookOpen size={27} strokeWidth={1.8} />
          </div>

          {/* Content */}
          <div className="relative mx-auto mt-7 max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#0D6E91]">
              Journal
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#061A2B] sm:text-4xl">
              Articles are on the way.
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-[#687B86] sm:text-base">
              There are no published articles available right now. You can
              explore the available battery services while the journal is
              being updated.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#061A2B] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#08263D]"
              >
                Explore Services
                <ArrowUpRight size={16} />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-[#CBD9E0] px-6 py-3.5 text-sm font-semibold text-[#061A2B] transition hover:border-[#0D6E91] hover:text-[#0D6E91]"
              >
                Back Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}