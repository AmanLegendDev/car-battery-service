
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  MessageSquareQuote,
  MapPin,
  Quote,
} from "lucide-react";

import { TESTIMONIALS_LISTING_HERO } from "./testimonialsListingHeroData";

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
    <section
      aria-labelledby="testimonials-hero-heading"
      className="relative isolate overflow-hidden bg-[#061A2B] text-[#F8FAFC]"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="absolute -left-40 top-0 h-[480px] w-[480px] rounded-full bg-[#0D6E91]/25 blur-[140px]" />

        <div className="absolute -right-40 top-[15%] h-[500px] w-[500px] rounded-full bg-[#FFD400]/[0.07] blur-[140px]" />

        <div className="absolute bottom-0 left-0 h-48 w-full bg-gradient-to-t from-[#061A2B] to-transparent" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0D6E91]/80 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1420px] px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8 lg:pb-20 lg:pt-20 mt-10">
        {/* Top identity row */}
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/[0.1] bg-white/[0.035] px-3 py-2 backdrop-blur-md sm:px-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
              <MessageSquareQuote
                aria-hidden="true"
                className="h-4 w-4"
                strokeWidth={1.9}
              />
            </span>

            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#D5E1E8] sm:text-[10px]">
              {hero.eyebrow}
            </span>
          </div>

          <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 sm:block">
            RAPID AUTO SERVICES
          </span>
        </div>

        {/* Hero content */}
        <div className="mt-10 grid items-center gap-10 sm:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.7fr)] lg:gap-16 xl:mt-16 xl:gap-24">
          {/* Main copy */}
          <div className="min-w-0">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.23em] text-[#FFD400]">
                Customer stories
              </span>
            </div>

            <h1
              id="testimonials-hero-heading"
              className="max-w-4xl text-[clamp(3rem,7.2vw,6.8rem)] font-semibold leading-[0.92] tracking-[-0.065em]"
            >
              Real experiences.
              <span className="mt-1 block text-white/40">
                Genuine words.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-sm leading-7 text-[#B8C8D2] sm:mt-9 sm:text-base sm:leading-8 lg:text-[17px]">
              {hero.description}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap">
              <a
                href={hero.primaryHref}
                className="group inline-flex min-h-14 items-center justify-between gap-5 rounded-full bg-[#FFD400] px-6 text-sm font-bold text-[#061A2B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F5B800] hover:shadow-[0_14px_34px_rgba(255,212,0,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-4 focus-visible:ring-offset-[#061A2B]"
              >
                <span>{hero.primaryCta}</span>

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#061A2B] text-[#FFD400] transition-transform duration-300 group-hover:translate-y-0.5">
                  <ArrowDown
                    aria-hidden="true"
                    className="h-4 w-4"
                  />
                </span>
              </a>

              <Link
                href={hero.secondaryHref}
                className="group inline-flex min-h-14 items-center justify-between gap-5 rounded-full border border-white/[0.15] bg-white/[0.04] px-6 text-sm font-semibold text-white transition-all duration-300 hover:border-[#0D6E91] hover:bg-[#0D6E91]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-4 focus-visible:ring-offset-[#061A2B]"
              >
                <span>{hero.secondaryCta}</span>

                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 text-[#FFD400] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>

            {/* Business details */}
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/[0.1] pt-6 sm:mt-12 sm:pt-7">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-white/65">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />
                {businessName}
              </span>

              {region ? (
                <span className="inline-flex items-center gap-2 text-xs font-medium text-white/55">
                  <MapPin
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-[#FFD400]"
                  />
                  {region}
                </span>
              ) : null}
            </div>
          </div>

          {/* Customer feedback summary card */}
          <div className="relative min-w-0">
            <div
              aria-hidden="true"
              className="absolute -inset-5 rounded-[36px] bg-gradient-to-br from-[#0D6E91]/20 via-transparent to-[#FFD400]/[0.08] blur-2xl"
            />

            <div className="relative overflow-hidden rounded-[28px] border border-white/[0.12] bg-gradient-to-br from-[#10354B] via-[#08263D] to-[#061A2B] shadow-[0_30px_90px_rgba(0,0,0,0.3)] sm:rounded-[32px]">
              {/* Card header */}
              <div className="flex items-center justify-between gap-4 border-b border-white/[0.1] px-5 py-5 sm:px-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFD400] text-[#061A2B]">
                    <Quote
                      aria-hidden="true"
                      className="h-5 w-5"
                      strokeWidth={1.8}
                    />
                  </span>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B8C8D2]/65">
                      Shared Feedback
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      Customer experiences
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-[#0D6E91]/40 bg-[#0D6E91]/20 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#B8E8F5]">
                  Testimonials
                </span>
              </div>

              {/* Count */}
              <div className="p-5 sm:p-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8C8D2]/60">
                  Published experiences
                </p>

                <div className="mt-4 flex items-end gap-3">
                  <span className="text-7xl font-semibold leading-[0.9] tracking-[-0.07em] text-white sm:text-8xl">
                    {testimonialCount}
                  </span>

                  <span className="mb-2 text-sm text-[#B8C8D2]/70">
                    {testimonialCount === 1
                      ? "experience"
                      : "experiences"}
                  </span>
                </div>

                <div className="mt-7 h-px bg-white/[0.1]" />

                <div className="mt-5 space-y-4">
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#B8C8D2]/55">
                        Business
                      </p>

                      <p className="mt-1.5 break-words text-sm font-semibold text-white/90">
                        {businessName}
                      </p>
                    </div>

                    {region ? (
                      <div className="min-w-0 text-right">
                        <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#B8C8D2]/55">
                          Region
                        </p>

                        <p className="mt-1.5 break-words text-sm font-semibold text-[#FFD400]">
                          {region}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Card footer */}
                <a
                  href={hero.primaryHref}
                  className="group mt-7 flex min-h-12 items-center justify-between gap-3 rounded-xl border border-white/[0.1] bg-white/[0.035] px-4 text-xs font-semibold text-white/80 transition-colors hover:border-[#0D6E91]/60 hover:bg-[#0D6E91]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
                >
                  <span>Browse customer feedback</span>

                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 text-[#FFD400] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom context */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.1] pt-5 sm:mt-16 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
          <p className="max-w-2xl text-xs leading-6 text-white/40">
            Feedback is presented as shared. The number above reflects the
            testimonial count supplied by the page.
          </p>

          <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
            <span className="h-px w-7 bg-[#FFD400]" />
            Explore customer feedback
          </div>
        </div>
      </div>
    </section>
  );
}
