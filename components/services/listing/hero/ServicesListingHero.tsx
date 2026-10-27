
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  Wrench,
  Zap,
} from "lucide-react";

import {
  SERVICES_LISTING_HERO_DESCRIPTION,
  SERVICES_LISTING_HERO_LABEL,
  SERVICES_LISTING_HERO_TITLE,
  SERVICES_LISTING_HERO_PRIMARY_CTA,
  SERVICES_LISTING_HERO_SECONDARY_CTA,
  SERVICES_LISTING_HERO_CARD_LABEL,
  SERVICES_LISTING_HERO_CARD_TITLE,
  SERVICES_LISTING_HERO_CARD_DESCRIPTION,
} from "./servicesListingHeroData";

interface ServicesListingHeroProps {
  serviceCount: number;
  region?: string;
}

export default function ServicesListingHero({
  serviceCount,
  region,
}: ServicesListingHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#061A2B] text-[#F8FAFC]">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#0D6E91]/25 blur-[130px]" />

        <div className="absolute -right-32 top-[10%] h-[560px] w-[560px] rounded-full bg-[#0D6E91]/20 blur-[140px]" />

        <div className="absolute bottom-[-260px] left-[35%] h-[500px] w-[500px] rounded-full bg-[#FFD400]/[0.09] blur-[130px]" />

        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0D6E91]/70 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1420px] px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8 lg:pb-24 lg:pt-14 mt-14">
        {/* Eyebrow */}
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 backdrop-blur-md sm:px-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
              <Wrench
                aria-hidden="true"
                className="h-4 w-4"
                strokeWidth={2}
              />
            </span>

            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#D5E1E8] sm:text-[10px]">
              {SERVICES_LISTING_HERO_LABEL}
            </span>
          </div>

          <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 sm:block">
            RAPID AUTO SERVICES
          </span>
        </div>

        {/* Main hero */}
        <div className="mt-10 grid items-center gap-10 sm:mt-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.75fr)] lg:gap-16 xl:mt-16 xl:gap-24">
          {/* Copy and actions */}
          <div className="min-w-0">
            <div className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-[#A8BBC8]">
              <span className="h-2 w-2 rounded-full bg-[#FFD400] shadow-[0_0_14px_rgba(255,212,0,0.55)]" />
              Vehicle care made easier
            </div>

            <h1 className="max-w-4xl text-[clamp(3.25rem,7.4vw,7rem)] font-semibold leading-[0.91] tracking-[-0.065em]">
              The right care for{" "}
              <span className="relative inline-block text-[#FFD400]">
                every journey.
                <span
                  aria-hidden="true"
                  className="absolute -bottom-2 left-1 h-[3px] w-[42%] rounded-full bg-[#0D6E91] sm:-bottom-3 sm:h-1"
                />
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-sm leading-7 text-[#B8C8D2] sm:mt-9 sm:text-base sm:leading-8 lg:text-[17px]">
              {SERVICES_LISTING_HERO_DESCRIPTION}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap">
              <a
                href="#available-services"
                className="group inline-flex min-h-14 items-center justify-between gap-5 rounded-full bg-[#FFD400] px-6 text-sm font-bold text-[#061A2B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F5B800] hover:shadow-[0_14px_34px_rgba(255,212,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-4 focus-visible:ring-offset-[#061A2B]"
              >
                <span>{SERVICES_LISTING_HERO_PRIMARY_CTA}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#061A2B] text-[#FFD400] transition-transform duration-300 group-hover:translate-y-0.5">
                  <ArrowDown
                    aria-hidden="true"
                    className="h-4 w-4"
                  />
                </span>
              </a>

              <Link
                href="/book-service"
                className="group inline-flex min-h-14 items-center justify-between gap-5 rounded-full border border-white/15 bg-white/[0.045] px-6 text-sm font-semibold text-white transition-all duration-300 hover:border-[#0D6E91] hover:bg-[#0D6E91]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-4 focus-visible:ring-offset-[#061A2B]"
              >
                <span>{SERVICES_LISTING_HERO_SECONDARY_CTA}</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 text-[#FFD400] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>

            {/* Live data points */}
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6 sm:mt-12 sm:pt-7">
              <div className="inline-flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D6E91]/25 text-[#FFD400]">
                  <Zap aria-hidden="true" className="h-4 w-4" />
                </span>
                <span className="text-xs font-semibold text-white/75">
                  {serviceCount}{" "}
                  {serviceCount === 1 ? "service" : "services"} to explore
                </span>
              </div>

              {region ? (
                <div className="inline-flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-[#FFD400]">
                    <MapPin aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-semibold text-white/75">
                    {region}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Feature card */}
          <div className="relative min-w-0 lg:pl-2">
            <div
              aria-hidden="true"
              className="absolute -inset-5 rounded-[34px] bg-gradient-to-br from-[#0D6E91]/25 via-transparent to-[#FFD400]/10 blur-2xl"
            />

            <div className="relative overflow-hidden rounded-[28px] border border-white/[0.12] bg-gradient-to-br from-[#10354B] via-[#08263D] to-[#061A2B] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.3)] sm:rounded-[32px] sm:p-7 lg:p-8">
              {/* Decorative circles */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/[0.07]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-7 -top-7 h-36 w-36 rounded-full border border-[#FFD400]/15"
              />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFD400] text-[#061A2B] shadow-[0_12px_32px_rgba(255,212,0,0.14)]">
                  <Wrench
                    aria-hidden="true"
                    className="h-6 w-6"
                    strokeWidth={1.8}
                  />
                </div>

                <span className="rounded-full border border-[#0D6E91]/50 bg-[#0D6E91]/20 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#B8E8F5]">
                  Our Services
                </span>
              </div>

              <div className="relative mt-8">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#FFD400]">
                  {SERVICES_LISTING_HERO_CARD_LABEL}
                </p>

                <h2 className="mt-4 max-w-md text-2xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-3xl">
                  {SERVICES_LISTING_HERO_CARD_TITLE}
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-[#B8C8D2]">
                  {SERVICES_LISTING_HERO_CARD_DESCRIPTION}
                </p>
              </div>

              <div className="relative mt-7 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#061A2B]/45 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0D6E91]/25 text-[#FFD400]">
                    <CheckCircle2
                      aria-hidden="true"
                      className="h-5 w-5"
                    />
                  </span>

                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
                      Service options
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {serviceCount}{" "}
                      {serviceCount === 1 ? "option" : "options"} available
                    </p>
                  </div>

                  <ArrowRight
                    aria-hidden="true"
                    className="ml-auto h-4 w-4 shrink-0 text-[#FFD400]"
                  />
                </div>

                {region ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#061A2B]/45 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0D6E91]/25 text-[#FFD400]">
                      <MapPin
                        aria-hidden="true"
                        className="h-5 w-5"
                      />
                    </span>

                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
                        Service region
                      </p>
                      <p className="mt-1 break-words text-sm font-semibold text-white">
                        {region}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="relative mt-6 flex items-center gap-2 border-t border-white/[0.09] pt-5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/45">
                  {SERVICES_LISTING_HERO_LABEL}
                </span>
                <span className="ml-auto text-[9px] font-semibold text-white/30">
                  RAPID AUTO SERVICES
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="mt-12 flex items-center justify-between border-t border-white/[0.08] pt-5 sm:mt-16 sm:pt-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-7 bg-[#FFD400]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
              Explore your options
            </span>
          </div>

          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
            {String(serviceCount).padStart(2, "0")}{" "}
            {serviceCount === 1 ? "SERVICE" : "SERVICES"}
          </span>
        </div>
      </div>
    </section>
  );
}
