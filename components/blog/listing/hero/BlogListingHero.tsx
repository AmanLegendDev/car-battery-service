
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Sparkles,
} from "lucide-react";

import { BLOG_LISTING_HERO } from "./blogListingHeroData";

interface BlogListingHeroProps {
  postCount: number;
}

export default function BlogListingHero({
  postCount,
}: BlogListingHeroProps) {
  const hero = BLOG_LISTING_HERO;

  const safePostCount = Math.max(0, postCount);

  return (
    <section className="relative isolate overflow-hidden bg-[#061A2B] text-white">
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-[#0D6E91]/20 blur-[130px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-12rem] top-[8rem] h-[30rem] w-[30rem] rounded-full bg-[#FFD400]/[0.07] blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-15rem] left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[#0D6E91]/10 blur-[120px]"
      />

      {/* Technical grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(248,250,252,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(248,250,252,0.8) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Edge vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(6,26,43,0.45)_100%)]"
      />

      {/* Main content */}
      <div className="relative mx-auto mt-4 max-w-[1420px] px-5 pb-14 pt-20 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-28">
        <div className="grid items-end gap-14 lg:grid-cols-[1fr_360px] lg:gap-20">
          {/* Left content */}
          <div className="max-w-5xl">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#FFD400]/20 bg-[#FFD400]/10">
                <BookOpen
                  className="h-[18px] w-[18px] text-[#FFD400]"
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#FFD400]">
                  {hero.eyebrow}
                </p>

                <p className="mt-1 text-xs text-[#A8BBC8]">
                  Information worth keeping handy
                </p>
              </div>
            </div>

            {/* Heading */}
            <h1 className="mt-8 max-w-5xl text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-[#F8FAFC]">
              Practical guidance
              <br />

              <span className="text-[#F8FAFC]/35">
                for every journey.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-8 max-w-2xl text-base leading-7 text-[#A8BBC8] sm:text-lg sm:leading-8">
              {hero.description}
            </p>

            {/* Actions */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={hero.primaryHref}
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl bg-[#FFD400] px-6 py-3.5 text-sm font-bold text-[#061A2B] transition duration-300 hover:bg-[#F5B800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061A2B]"
              >
                {hero.primaryCta}

                <ArrowDown
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
              </Link>

              <Link
                href={hero.secondaryHref}
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-[#F8FAFC] transition duration-300 hover:border-white/20 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                {hero.secondaryCta}

                <ArrowRight
                  className="h-4 w-4 text-[#FFD400] transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          {/* Published articles panel */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#08263D]/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7">
              <div
                aria-hidden="true"
                className="absolute right-6 top-6 h-16 w-16 rounded-full border border-[#FFD400]/15"
              />

              <div
                aria-hidden="true"
                className="absolute right-10 top-10 h-8 w-8 rounded-full border border-[#FFD400]/20"
              />

              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8BBC8]">
                    Published Library
                  </span>

                  <Sparkles
                    className="h-4 w-4 shrink-0 text-[#FFD400]"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                </div>

                <div className="mt-8">
                  <p className="text-6xl font-semibold tracking-[-0.06em] text-[#F8FAFC]">
                    {String(safePostCount).padStart(2, "0")}
                  </p>

                  <p className="mt-2 text-sm text-[#A8BBC8]">
                    {safePostCount === 1
                      ? "published article"
                      : "published articles"}
                  </p>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-sm leading-6 text-[#A8BBC8]">
                    Explore automotive knowledge, maintenance
                    guidance and helpful information for your
                    next vehicle service decision.
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-[#FFD400]"
                  />

                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A8BBC8]/70">
                    Automotive Knowledge
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom context */}
        <div className="mt-16 border-t border-white/10 pt-5 sm:mt-20">
          <div className="flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[#A8BBC8]/60">
              Automotive guides, maintenance advice and practical
              vehicle information.
            </p>

            <a
              href={hero.primaryHref}
              className="group inline-flex items-center gap-3 text-[#A8BBC8]/50 transition hover:text-[#FFD400]"
            >
              <span className="h-px w-8 bg-white/15 transition group-hover:bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                Scroll to explore
              </span>

              <ArrowDown
                className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5"
                strokeWidth={1.6}
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
