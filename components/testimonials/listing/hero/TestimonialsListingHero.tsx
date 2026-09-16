import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  MessageSquareQuote,
} from "lucide-react";

import {
  TESTIMONIALS_LISTING_HERO,
} from "./testimonialsListingHeroData";

interface TestimonialsListingHeroProps {
  testimonialCount: number;
  region: string;
  businessName: string;
}

export default function TestimonialsListingHero({
  testimonialCount,
  region,
  businessName,
}: TestimonialsListingHeroProps) {
  const hero = TESTIMONIALS_LISTING_HERO;

  return (
    <section className="relative isolate overflow-hidden bg-[#061A2B] text-white">
      {/* =====================================================
          ATMOSPHERE
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize:
              "52px 52px",
          }}
        />

        {/* Blue glow */}
        <div className="absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-[#0D6E91]/20 blur-[130px]" />

        {/* Yellow glow */}
        <div className="absolute -right-40 top-1/3 h-[420px] w-[420px] rounded-full bg-[#FFD400]/[0.08] blur-[140px]" />

        {/* Bottom vignette */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#061A2B] to-transparent" />
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-20 sm:px-8 sm:pb-12 lg:px-10 lg:pt-28">
        <div className="grid items-end gap-14 lg:grid-cols-[1fr_360px] lg:gap-20">
          {/* =================================================
              LEFT
          ================================================== */}

          <div className="max-w-4xl">
            {/* Eyebrow */}

            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#FFD400]">
                {hero.eyebrow}
              </span>
            </div>

            {/* Heading */}

            <h1 className="max-w-4xl text-[clamp(2.8rem,7vw,6.8rem)] font-semibold leading-[0.94] tracking-[-0.055em]">
              Real experiences.
              <br />

              <span className="text-white/35">
                Genuine words.
              </span>
            </h1>

            {/* Description */}

            <p className="mt-8 max-w-2xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
              {hero.description}
            </p>

            {/* CTAs */}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={hero.primaryHref}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-6 text-sm font-bold text-[#061A2B] transition hover:bg-[#F5B800]"
              >
                {hero.primaryCta}

                <ArrowDown
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-y-0.5"
                />
              </Link>

              <Link
                href={hero.secondaryHref}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/[0.08]"
              >
                {hero.secondaryCta}

                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>

          {/* =================================================
              RIGHT INFORMATION PANEL
          ================================================== */}

          <div className="relative">
            <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] backdrop-blur-sm">
              {/* Icon / label */}

              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD400]/10 text-[#FFD400]">
                    <MessageSquareQuote
                      size={18}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
                      Feedback
                    </p>

                    <p className="mt-0.5 text-xs font-semibold text-white/80">
                      Customer experiences
                    </p>
                  </div>
                </div>

                <span className="h-2 w-2 rounded-full bg-[#FFD400]" />
              </div>

              {/* Main number */}

              <div className="px-6 py-8">
                <div className="flex items-end gap-3">
                  <span className="text-6xl font-semibold leading-none tracking-[-0.06em] text-white">
                    {testimonialCount}
                  </span>

                  <span className="mb-1.5 text-xs text-white/35">
                    published
                    <br />
                    experiences
                  </span>
                </div>

                <div className="mt-7 h-px bg-white/10" />

                <div className="mt-5 flex items-start justify-between gap-6">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
                      Business
                    </p>

                    <p className="mt-1 text-sm font-medium text-white/75">
                      {businessName}
                    </p>
                  </div>

                  {region && (
                    <div className="text-right">
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
                        Region
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#FFD400]">
                        {region}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            BOTTOM CONTEXT BAR
        ================================================== */}

        <div className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-lg text-xs leading-5 text-white/30">
            Customer feedback is presented as shared. No
            additional claims or ratings are added to the
            original experience.
          </p>

          <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
            <span className="h-px w-7 bg-white/20" />
            Scroll to explore
          </div>
        </div>
      </div>
    </section>
  );
}