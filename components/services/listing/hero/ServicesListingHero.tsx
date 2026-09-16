import { ArrowDownRight, BatteryCharging, Zap } from "lucide-react";

import {
  SERVICES_LISTING_HERO_DESCRIPTION,
  SERVICES_LISTING_HERO_LABEL,
  SERVICES_LISTING_HERO_TITLE,
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
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 top-[-120px] h-[520px] w-[520px] rounded-full bg-[#0D6E91]/10 blur-[130px]" />

        <div className="absolute right-[-180px] top-[10%] h-[620px] w-[620px] rounded-full bg-[#0D6E91]/[0.08] blur-[150px]" />

        <div className="absolute bottom-[-260px] left-[35%] h-[500px] w-[500px] rounded-full bg-[#FFD400]/[0.025] blur-[130px]" />

        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="relative mx-auto max-w-[1420px] px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-14 lg:px-8 lg:pb-28 lg:pt-16">
        {/* Top meta */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#FFD400]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/45 sm:text-xs">
              {SERVICES_LISTING_HERO_LABEL}
            </span>
          </div>

          <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-white/25 sm:block">
            01 / SERVICES
          </span>
        </div>

        <div className="mt-16 grid items-end gap-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-20 xl:mt-20">
          {/* Main heading */}
          <div>
            <h1 className="max-w-6xl text-[clamp(3.6rem,8.5vw,8.5rem)] font-semibold leading-[0.86] tracking-[-0.07em]">
              Battery help,
              <br />
              <span className="text-white/35">
                without the
              </span>
              <br />
              usual hassle.
            </h1>
          </div>

          {/* Side information */}
          <div className="lg:pb-2">
            <div className="max-w-sm border-l border-white/[0.12] pl-6">
              <p className="text-sm leading-7 text-[#A8BBC8] sm:text-base">
                {SERVICES_LISTING_HERO_DESCRIPTION}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.035] px-3 py-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
                    <BatteryCharging
                      className="h-3.5 w-3.5"
                      strokeWidth={2}
                    />
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/65">
                    {serviceCount}{" "}
                    {serviceCount === 1 ? "Service" : "Services"}
                  </span>
                </div>

                {region ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.035] px-4 py-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-white/55">
                      {region}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom visual marker */}
        <div className="mt-16 flex items-center justify-between border-t border-white/[0.1] pt-6 sm:mt-20">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
            <Zap
              className="h-3.5 w-3.5 text-[#FFD400]"
              strokeWidth={1.8}
            />

            <span>Mobile battery assistance</span>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.1]">
            <ArrowDownRight
              className="h-4 w-4 text-[#FFD400]"
              strokeWidth={1.7}
            />
          </div>
        </div>
      </div>
    </section>
  );
}