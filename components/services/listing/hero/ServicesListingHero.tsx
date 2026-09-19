import {
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  MapPin,
  Zap,
} from "lucide-react";

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
        {/* Top left glow */}
        <div className="absolute -left-48 -top-40 h-[620px] w-[620px] rounded-full bg-[#0D6E91]/[0.13] blur-[150px]" />

        {/* Right glow */}
        <div className="absolute -right-48 top-[12%] h-[680px] w-[680px] rounded-full bg-[#0D6E91]/[0.10] blur-[160px]" />

        {/* Bottom warm accent */}
        <div className="absolute bottom-[-280px] left-[38%] h-[560px] w-[560px] rounded-full bg-[#FFD400]/[0.035] blur-[150px]" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:72px_72px]" />

        {/* Soft center atmosphere */}
        <div className="absolute left-1/2 top-[42%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#0D6E91]/[0.035] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1420px] px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-14 lg:px-8 lg:pb-28 lg:pt-16">
        {/* Top label */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 sm:px-4">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
              <BatteryCharging
                aria-hidden="true"
                className="h-3.5 w-3.5"
                strokeWidth={2.2}
              />
            </span>

            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#A8BBC8] sm:text-[10px]">
              {SERVICES_LISTING_HERO_LABEL}
            </span>
          </div>

          <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-white/[0.22] sm:block">
            01 / SERVICES
          </span>
        </div>

        {/* Main layout */}
        <div className="mt-12 grid items-center gap-12 sm:mt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.72fr)] lg:gap-20 xl:mt-20 xl:gap-28">
          {/* Left content */}
          <div>
            <h1 className="max-w-4xl text-[clamp(3.4rem,7.2vw,7.6rem)] font-semibold leading-[0.88] tracking-[-0.065em]">
              {SERVICES_LISTING_HERO_TITLE}
            </h1>

            <p className="mt-8 max-w-2xl text-[15px] leading-7 text-[#A8BBC8] sm:mt-10 sm:text-base sm:leading-8 lg:text-[17px]">
              {SERVICES_LISTING_HERO_DESCRIPTION}
            </p>

            {/* Quick facts */}
            <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
              {/* Service count */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.035] px-3 py-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
                  <Zap
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                    strokeWidth={2.2}
                  />
                </span>

                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/65">
                  {serviceCount}{" "}
                  {serviceCount === 1 ? "Service" : "Services"}
                </span>
              </div>

              {/* Region */}
              {region ? (
                <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.035] px-3.5 py-2">
                  <MapPin
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-[#FFD400]"
                    strokeWidth={2}
                  />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-white/60">
                    {region}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Right information card */}
          <div className="relative lg:pb-2">
            {/* Card glow */}
            <div
              aria-hidden="true"
              className="absolute -inset-6 rounded-[40px] bg-[#0D6E91]/[0.06] blur-3xl"
            />

            <div className="relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-white/[0.045] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-6 lg:p-7">
              {/* Card top */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[17px] bg-[#FFD400] text-[#061A2B] shadow-[0_12px_30px_rgba(255,212,0,0.12)]">
                  <BatteryCharging
                    aria-hidden="true"
                    className="h-6 w-6"
                    strokeWidth={2}
                  />
                </div>

                <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#A8BBC8]">
                  Mobile Service
                </span>
              </div>

              {/* Card heading */}
              <div className="mt-8">
                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#718895]">
                  Car Battery Service
                </p>

                <h2 className="mt-3 max-w-md text-[25px] font-semibold leading-[1.18] tracking-[-0.035em] text-[#F8FAFC] sm:text-[29px]">
                  Battery assistance for your vehicle
                </h2>
              </div>

              {/* Service region */}
              {region ? (
                <div className="mt-7 rounded-[18px] border border-white/[0.08] bg-[#061A2B]/[0.28] p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-[#0D6E91]/[0.28]">
                      <MapPin
                        aria-hidden="true"
                        className="h-5 w-5 text-[#FFD400]"
                        strokeWidth={2}
                      />
                    </span>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#718895]">
                        Service Region
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#F8FAFC]">
                        {region}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Service availability */}
              <div className="mt-3 rounded-[18px] border border-white/[0.08] bg-[#061A2B]/[0.28] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-[#0D6E91]/[0.28]">
                      <CheckCircle2
                        aria-hidden="true"
                        className="h-5 w-5 text-[#FFD400]"
                        strokeWidth={2}
                      />
                    </span>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#718895]">
                        Available Services
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#F8FAFC]">
                        {serviceCount}{" "}
                        {serviceCount === 1
                          ? "service"
                          : "services"}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 text-[#FFD400]"
                    strokeWidth={1.8}
                  />
                </div>
              </div>

              {/* Bottom accent */}
              <div className="mt-6 flex items-center gap-2 border-t border-white/[0.07] pt-5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400] shadow-[0_0_10px_rgba(255,212,0,0.5)]" />

                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#718895]">
                  Mobile battery assistance
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="mt-14 flex items-center justify-between border-t border-white/[0.08] pt-5 sm:mt-20 sm:pt-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-7 bg-[#FFD400]" />

            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/[0.28]">
              Explore our services
            </span>
          </div>

          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/[0.18]">
            {serviceCount}{" "}
            {serviceCount === 1 ? "Service" : "Services"}
          </span>
        </div>
      </div>
    </section>
  );
}