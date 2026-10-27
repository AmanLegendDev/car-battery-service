
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  HelpCircle,
} from "lucide-react";

import { FAQS_LISTING_HERO } from "./faqsListingHeroData";

interface FAQsListingHeroProps {
  faqCount: number;
  region: string;
  businessName: string;
}

export default function FAQsListingHero({
  faqCount,
  region,
  businessName,
}: FAQsListingHeroProps) {
  const hero = FAQS_LISTING_HERO;

  return (
    <section className="relative isolate overflow-hidden bg-[#061A2B] text-white">
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

        <div className="absolute -left-40 -top-20 h-[460px] w-[460px] rounded-full bg-[#0D6E91]/20 blur-[135px]" />

        <div className="absolute -right-40 top-1/3 h-[420px] w-[420px] rounded-full bg-[#FFD400]/[0.08] blur-[140px]" />

        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#061A2B] to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative mx-auto mt-4 max-w-7xl px-5 pb-12 pt-20 sm:px-8 sm:pb-16 lg:px-10 lg:pb-20 lg:pt-28">
        <div className="grid items-end gap-14 lg:grid-cols-[1fr_360px] lg:gap-20">
          {/* Left content */}
          <div className="max-w-4xl">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#FFD400]">
                {hero.eyebrow}
              </span>
            </div>

            <h1 className="max-w-4xl text-[clamp(2.75rem,7vw,6.5rem)] font-semibold leading-[0.94] tracking-[-0.055em]">
              Clear answers
              <br />

              <span className="text-white/35">
                for every journey.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
              {hero.description}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={hero.primaryHref}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-6 text-sm font-bold text-[#061A2B] transition hover:bg-[#F5B800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061A2B]"
              >
                {hero.primaryCta}

                <ArrowDown
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-y-0.5"
                />
              </Link>

              <Link
                href={hero.secondaryHref}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                {hero.secondaryCta}

                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>

          {/* Information panel */}
          <div className="relative">
            <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD400]/10 text-[#FFD400]">
                    <HelpCircle
                      size={19}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
                      Help Centre
                    </p>

                    <p className="mt-0.5 text-xs font-semibold text-white/80">
                      Frequently asked questions
                    </p>
                  </div>
                </div>

                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-[#FFD400]"
                />
              </div>

              <div className="px-6 py-8">
                <div className="flex items-end gap-3">
                  <span className="text-6xl font-semibold leading-none tracking-[-0.06em] text-white">
                    {faqCount}
                  </span>

                  <span className="mb-1.5 text-xs leading-4 text-white/35">
                    published
                    <br />
                    FAQs
                  </span>
                </div>

                <div className="mt-7 h-px bg-white/10" />

                <div className="mt-5 flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
                      Business
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-white/75">
                      {businessName}
                    </p>
                  </div>

                  {region ? (
                    <div className="shrink-0 text-right">
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
                        Service Region
                      </p>

                      <p className="mt-1 max-w-32 text-sm font-medium text-[#FFD400]">
                        {region}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom context */}
        <div className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-xs leading-5 text-white/40">
            Get familiar with our services, booking process and
            available support before deciding on the next step
            for your vehicle.
          </p>

          <a
            href={hero.primaryHref}
            className="group inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white/40 transition hover:text-[#FFD400]"
          >
            <span className="h-px w-7 bg-white/20 transition group-hover:bg-[#FFD400]" />

            Scroll to explore

            <ArrowDown
              size={13}
              aria-hidden="true"
              className="transition-transform group-hover:translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
