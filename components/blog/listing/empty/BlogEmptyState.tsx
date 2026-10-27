
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Wrench,
} from "lucide-react";

export default function BlogEmptyState() {
  return (
    <section
      aria-labelledby="blog-empty-heading"
      className="bg-[#F8FAFC] px-5 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-4xl">
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-[#DDE7ED] bg-white px-6 py-14 text-center shadow-[0_20px_60px_rgba(6,26,43,0.07)] sm:px-10 sm:py-20">
          {/* Ambient background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[#0D6E91]/[0.07] blur-3xl" />

            <div className="absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-[#FFD400]/[0.10] blur-3xl" />

            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(6,26,43,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(6,26,43,0.8) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          {/* Icon */}
          <div
            aria-hidden="true"
            className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#061A2B] text-[#FFD400] shadow-lg shadow-[#061A2B]/15"
          >
            <BookOpen size={27} strokeWidth={1.8} />
          </div>

          {/* Content */}
          <div className="relative mx-auto mt-7 max-w-xl">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#0D6E91]">
              <span
                aria-hidden="true"
                className="h-px w-6 bg-[#FFD400]"
              />

              Automotive Journal

              <span
                aria-hidden="true"
                className="h-px w-6 bg-[#FFD400]"
              />
            </p>

            <h2
              id="blog-empty-heading"
              className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#061A2B] sm:text-4xl"
            >
              Fresh insights are on the way.
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#687B86] sm:text-base sm:leading-8">
              There are no published articles available right now.
              In the meantime, explore our automotive services or
              get in touch if you need help choosing the right
              service for your vehicle.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/services"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#061A2B] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#08263D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D6E91] focus-visible:ring-offset-2"
              >
                <Wrench size={16} aria-hidden="true" />

                Explore Services

                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href="/contact"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#CBD9E0] px-6 py-3.5 text-sm font-semibold text-[#061A2B] transition-colors hover:border-[#0D6E91] hover:text-[#0D6E91] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D6E91] focus-visible:ring-offset-2"
              >
                Contact Us

                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Supporting note */}
            <p className="mt-8 text-xs leading-5 text-[#8796A0]">
              Practical automotive information, designed to help
              you make more informed decisions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
