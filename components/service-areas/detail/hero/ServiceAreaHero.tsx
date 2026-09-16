import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Clock3,
  MapPin,
  Navigation,
} from "lucide-react";

import type { ServiceAreaDetailData } from "../ServiceAreaDetailPage";

interface ServiceAreaHeroProps {
  serviceArea: ServiceAreaDetailData;
}

export default function ServiceAreaHero({
  serviceArea,
}: ServiceAreaHeroProps) {
  const suburbCount = serviceArea.suburbs.length;
  const postcodeCount = serviceArea.postcodes.length;

  return (
    <section className="relative isolate overflow-hidden bg-[#061A2B] text-[#F8FAFC]">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-48 -top-48 h-[38rem] w-[38rem] rounded-full bg-[#0D6E91]/20 blur-[130px]" />

        <div className="absolute -right-48 top-[20%] h-[42rem] w-[42rem] rounded-full bg-[#FFD400]/[0.045] blur-[150px]" />

        <div className="absolute bottom-[-20rem] left-[35%] h-[34rem] w-[34rem] rounded-full bg-[#0D6E91]/10 blur-[130px]" />
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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_45%_35%,transparent_0%,transparent_38%,#061A2B_100%)]"
      />

      <div className="relative mx-auto max-w-[1420px] px-4 pb-10 pt-6 sm:px-6 sm:pb-12 sm:pt-8 lg:px-8 lg:pb-14 lg:pt-10">
        {/* Top navigation */}
        <div className="flex items-center justify-between border-b border-[#F8FAFC]/10 pb-5">
          <Link
            href="/service-areas"
            className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#F8FAFC]/45 transition-colors duration-300 hover:text-[#F8FAFC]"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1"
              strokeWidth={1.8}
            />

            <span>All service areas</span>
          </Link>

          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F8FAFC]/25 sm:block">
            Location / {serviceArea.slug}
          </span>
        </div>

        {/* Main composition */}
        <div className="grid gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,0.88fr)_minmax(420px,1.12fr)] lg:gap-16 lg:py-16 xl:gap-20">
          {/* Content */}
          <div className="flex flex-col justify-center lg:min-h-[680px]">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FFD400]/30 bg-[#FFD400]/10 text-[#FFD400]">
                <MapPin
                  className="h-3.5 w-3.5"
                  strokeWidth={1.8}
                />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#FFD400]">
                Service Area
              </span>
            </div>

            {/* Region */}
            <div className="mt-8 flex items-center gap-3">
              <span className="h-px w-9 bg-[#F8FAFC]/20" />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F8FAFC]/35">
                Melbourne West
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-5 max-w-3xl text-[clamp(3.5rem,7vw,7.5rem)] font-semibold leading-[0.84] tracking-[-0.075em]">
              {serviceArea.name}
              <span className="text-[#FFD400]">.</span>
            </h1>

            {serviceArea.shortDescription ? (
              <p className="mt-8 max-w-xl text-sm leading-7 text-[#A8BBC8] sm:text-base lg:text-lg lg:leading-8">
                {serviceArea.shortDescription}
              </p>
            ) : null}

            {/* Status / availability */}
            <div className="mt-9 flex flex-wrap gap-2">
              {serviceArea.featured ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-[#FFD400]/20 bg-[#FFD400]/10 px-3.5 py-2 text-[9px] font-bold uppercase tracking-[0.17em] text-[#FFD400]">
                  <Check
                    className="h-3 w-3"
                    strokeWidth={2}
                  />

                  Featured area
                </span>
              ) : null}

              {serviceArea.serviceAvailability ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-[#F8FAFC]/10 bg-[#F8FAFC]/[0.035] px-3.5 py-2 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#F8FAFC]/55">
                  <Clock3
                    className="h-3 w-3"
                    strokeWidth={1.8}
                  />

                  Service information available
                </span>
              ) : null}
            </div>

            {/* Stats */}
            <div className="mt-10 grid max-w-xl grid-cols-2 border-y border-[#F8FAFC]/10 sm:grid-cols-3">
              <div className="border-r border-[#F8FAFC]/10 py-5 pr-4 sm:pr-5">
                <div className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                  {String(suburbCount).padStart(2, "0")}
                </div>

                <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.18em] text-[#F8FAFC]/30">
                  Suburbs listed
                </p>
              </div>

              <div className="border-r-0 py-5 pl-4 sm:border-r sm:border-[#F8FAFC]/10 sm:px-5">
                <div className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                  {String(postcodeCount).padStart(2, "0")}
                </div>

                <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.18em] text-[#F8FAFC]/30">
                  Postcodes
                </p>
              </div>

              <div className="hidden py-5 pl-5 sm:block">
                <div className="flex items-center gap-2">
                  <Navigation
                    className="h-4 w-4 text-[#FFD400]"
                    strokeWidth={1.8}
                  />

                  <span className="text-sm font-semibold">
                    Mobile
                  </span>
                </div>

                <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.18em] text-[#F8FAFC]/30">
                  Service
                </p>
              </div>
            </div>

            {/* Availability */}
            {serviceArea.serviceAvailability ? (
              <div className="mt-7 flex max-w-xl items-start gap-3">
                <Clock3
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#FFD400]"
                  strokeWidth={1.7}
                />

                <p className="text-xs leading-6 text-[#A8BBC8]">
                  {serviceArea.serviceAvailability}
                </p>
              </div>
            ) : null}
          </div>

          {/* Visual */}
          <div className="relative min-h-[480px] sm:min-h-[580px] lg:min-h-[680px]">
            <div className="absolute -inset-3 rounded-[2.5rem] border border-[#F8FAFC]/[0.035]" />

            <div className="relative h-full min-h-[480px] overflow-hidden rounded-[2rem] bg-[#08263D] sm:min-h-[580px] lg:min-h-[680px]">
              {serviceArea.heroImage?.secureUrl ? (
                <>
                  <Image
                    src={serviceArea.heroImage.secureUrl}
                    alt={
                      serviceArea.heroImage.alt ||
                      `${serviceArea.name} service area`
                    }
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover transition-transform duration-1000 ease-out hover:scale-[1.025]"
                  />

                  {/* Image treatment */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-br from-[#061A2B]/30 via-transparent to-[#061A2B]/80"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_45%,rgba(6,26,43,0.9)_100%)]"
                  />

                  {/* Image top label */}
                  <div className="absolute left-5 top-5 right-5 flex items-start justify-between sm:left-7 sm:right-7 sm:top-7">
                    <span className="rounded-full border border-white/10 bg-[#061A2B]/35 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/60 backdrop-blur-md">
                      Mobile service location
                    </span>

                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#061A2B]/30 text-[#FFD400] backdrop-blur-md">
                      <MapPin
                        className="h-4 w-4"
                        strokeWidth={1.7}
                      />
                    </span>
                  </div>

                  {/* Image bottom information */}
                  <div className="absolute inset-x-5 bottom-5 sm:inset-x-7 sm:bottom-7">
                    <div className="flex items-end justify-between gap-5">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/45">
                          Current location
                        </p>

                        <p className="mt-2 text-2xl font-semibold tracking-[-0.045em] text-white sm:text-3xl">
                          {serviceArea.name}
                        </p>
                      </div>

                      <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B] sm:flex">
                        <ArrowUpRight
                          className="h-5 w-5"
                          strokeWidth={1.8}
                        />
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                /* Premium fallback when no image exists */
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#0D6E91]/30 blur-[100px]" />

                  <div className="absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#FFD400]/10 blur-[100px]" />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, #F8FAFC 1px, transparent 1px),
                        linear-gradient(to bottom, #F8FAFC 1px, transparent 1px)
                      `,
                      backgroundSize: "48px 48px",
                    }}
                  />

                  <div className="relative flex h-full min-h-[480px] flex-col justify-between p-6 sm:min-h-[580px] sm:p-8 lg:min-h-[680px] lg:p-10">
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F8FAFC]/10 bg-[#F8FAFC]/[0.025] text-[#FFD400]">
                        <MapPin
                          className="h-4 w-4"
                          strokeWidth={1.7}
                        />
                      </span>

                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#F8FAFC]/25">
                        Location
                      </span>
                    </div>

                    <div>
                      <div className="mb-5 h-px w-16 bg-[#FFD400]" />

                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#F8FAFC]/35">
                        Service Area
                      </p>

                      <h2 className="mt-3 max-w-lg text-5xl font-semibold leading-[0.9] tracking-[-0.065em] text-[#F8FAFC] sm:text-6xl">
                        {serviceArea.name}
                      </h2>

                      <p className="mt-5 max-w-md text-sm leading-6 text-[#A8BBC8]">
                        Location image has not been provided for this
                        service area.
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#F8FAFC]/10 pt-5">
                      <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#F8FAFC]/25">
                        Mobile assistance
                      </span>

                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F8FAFC]/10 text-[#FFD400]">
                        <Navigation
                          className="h-4 w-4"
                          strokeWidth={1.7}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom anchor */}
        <div className="flex items-center justify-between border-t border-[#F8FAFC]/10 pt-5">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />

            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#F8FAFC]/30">
              {serviceArea.name} / Service coverage
            </span>
          </div>

          <Link
            href="#coverage"
            className="group inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#F8FAFC]/40 transition-colors hover:text-[#F8FAFC]"
          >
            <span>Explore coverage</span>

            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.8}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}