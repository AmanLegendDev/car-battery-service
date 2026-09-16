import {
  ArrowDownRight,
  MapPin,
  Navigation,
} from "lucide-react";

import {
  SERVICE_AREAS_HERO_BOTTOM_LABEL,
  SERVICE_AREAS_HERO_DESCRIPTION,
  SERVICE_AREAS_HERO_EYEBROW,
  SERVICE_AREAS_HERO_LABEL,
  SERVICE_AREAS_HERO_TITLE,
} from "./servicesAreasListingHeroData";

interface ServiceAreasListingHeroProps {
  serviceAreaCount: number;
}

export default function ServiceAreasListingHero({
  serviceAreaCount,
}: ServiceAreasListingHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#061A2B] text-[#F8FAFC]">
      {/* Ambient atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#0D6E91]/20 blur-[120px]" />

        <div className="absolute -right-48 top-1/4 h-[38rem] w-[38rem] rounded-full bg-[#FFD400]/[0.055] blur-[140px]" />

        <div className="absolute bottom-[-20rem] left-1/3 h-[34rem] w-[34rem] rounded-full bg-[#0D6E91]/10 blur-[130px]" />
      </div>

      {/* Technical grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #F8FAFC 1px, transparent 1px),
            linear-gradient(to bottom, #F8FAFC 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,transparent_38%,#061A2B_100%)]"
      />

      <div className="relative mx-auto max-w-[1420px] px-4 pb-8 pt-16 sm:px-6 sm:pb-10 sm:pt-20 lg:px-8 lg:pb-12 lg:pt-24">
        {/* Top metadata */}
        <div className="flex items-center justify-between border-b border-[#F8FAFC]/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FFD400]/30 bg-[#FFD400]/10 text-[#FFD400]">
              <MapPin
                className="h-3.5 w-3.5"
                strokeWidth={1.8}
              />
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#F8FAFC]/60">
              {SERVICE_AREAS_HERO_LABEL}
            </span>
          </div>

          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F8FAFC]/30 sm:block">
            02 / Coverage
          </span>
        </div>

        {/* Main */}
        <div className="grid min-h-[620px] items-end gap-14 py-20 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)] lg:gap-20 lg:py-24">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-10 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFD400]">
                {SERVICE_AREAS_HERO_EYEBROW}
              </span>
            </div>

            <h1 className="max-w-5xl text-[clamp(3.2rem,8vw,8.6rem)] font-semibold leading-[0.86] tracking-[-0.075em]">
              Battery
              <br />

              <span className="text-[#F8FAFC]/35">
                assistance,
              </span>
              <br />

              <span className="text-[#FFD400]">
                closer to where you are.
              </span>
            </h1>

            <p className="sr-only">
              {SERVICE_AREAS_HERO_TITLE}
            </p>
          </div>

          <div className="flex flex-col justify-end lg:pb-3">
            <div className="mb-8 h-px w-full bg-[#F8FAFC]/10" />

            <p className="max-w-md text-sm leading-7 text-[#A8BBC8] sm:text-base">
              {SERVICE_AREAS_HERO_DESCRIPTION}
            </p>

            <div className="mt-10 grid grid-cols-2 border-y border-[#F8FAFC]/10">
              <div className="border-r border-[#F8FAFC]/10 py-5 pr-5">
                <div className="text-3xl font-semibold tracking-[-0.05em] text-[#F8FAFC] sm:text-4xl">
                  {String(serviceAreaCount).padStart(2, "0")}
                </div>

                <div className="mt-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#F8FAFC]/35">
                  Areas listed
                </div>
              </div>

              <div className="py-5 pl-5">
                <div className="flex items-center gap-2 text-[#FFD400]">
                  <Navigation
                    className="h-4 w-4"
                    strokeWidth={1.8}
                  />

                  <span className="text-sm font-semibold">
                    Mobile
                  </span>
                </div>

                <div className="mt-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#F8FAFC]/35">
                  Assistance
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom cue */}
        <div className="flex items-center justify-between border-t border-[#F8FAFC]/10 pt-5">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F8FAFC]/35">
            {SERVICE_AREAS_HERO_BOTTOM_LABEL}
          </span>

          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F8FAFC]/10 text-[#FFD400]">
            <ArrowDownRight
              className="h-4 w-4"
              strokeWidth={1.7}
            />
          </span>
        </div>
      </div>
    </section>
  );
}