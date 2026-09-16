import {
  ArrowDownRight,
  MapPin,
  Navigation,
  ScanLine,
} from "lucide-react";

import type { ServiceAreaDetailData } from "../ServiceAreaDetailPage";

interface ServiceAreaCoverageProps {
  serviceArea: ServiceAreaDetailData;
}

export default function ServiceAreaCoverage({
  serviceArea,
}: ServiceAreaCoverageProps) {
  const suburbs = Array.from(
  new Set(
    serviceArea.suburbs
      .filter(Boolean)
      .map((suburb) => String(suburb).trim())
      .filter(Boolean),
  ),
);

const postcodes = Array.from(
  new Set(
    serviceArea.postcodes
      .filter(Boolean)
      .map((postcode) => String(postcode).trim())
      .filter(Boolean),
  ),
);

  return (
    <section
      id="coverage"
      className="relative overflow-hidden bg-[#F8FAFC] text-[#061A2B]"
    >
      {/* Subtle technical atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-12rem] top-[-12rem] h-[30rem] w-[30rem] rounded-full bg-[#0D6E91]/[0.07] blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-14rem] left-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[#FFD400]/[0.08] blur-[110px]"
      />

      <div className="relative mx-auto max-w-[1420px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        {/* Section heading */}
        <div className="grid gap-10 border-b border-[#061A2B]/10 pb-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end lg:gap-20">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#061A2B] text-[#FFD400]">
                <MapPin
                  className="h-3.5 w-3.5"
                  strokeWidth={1.8}
                />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#061A2B]/40">
                Local Coverage
              </span>
            </div>

            <h2 className="mt-6 max-w-5xl text-4xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-5xl lg:text-7xl">
              Coverage details for
              <br />
              <span className="text-[#061A2B]/30">
                {serviceArea.name}.
              </span>
            </h2>
          </div>

          <div>
            <p className="text-sm leading-7 text-[#061A2B]/55 sm:text-base">
              Use the information below to understand the suburbs and
              postcodes currently listed for this service area.
            </p>
          </div>
        </div>

        {/* Main coverage composition */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
          {/* Description panel */}
          <div className="relative overflow-hidden rounded-[2rem] bg-[#061A2B] p-7 text-[#F8FAFC] sm:p-9 lg:p-11">
            <div
              aria-hidden="true"
              className="absolute right-[-5rem] top-[-5rem] h-48 w-48 rounded-full bg-[#0D6E91]/20 blur-[70px]"
            />

            <div
              aria-hidden="true"
              className="absolute bottom-[-6rem] left-[-4rem] h-44 w-44 rounded-full bg-[#FFD400]/[0.06] blur-[65px]"
            />

            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #F8FAFC 1px, transparent 1px),
                  linear-gradient(to bottom, #F8FAFC 1px, transparent 1px)
                `,
                backgroundSize: "56px 56px",
              }}
            />

            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#FFD400]">
                  Area information
                </span>

                <ScanLine
                  className="h-4 w-4 text-[#F8FAFC]/20"
                  strokeWidth={1.5}
                />
              </div>

              <div className="mt-12">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F8FAFC]/30">
                  {serviceArea.name}
                </p>

                <h3 className="mt-3 max-w-xl text-3xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-4xl">
                  A closer look at the location.
                </h3>

                {serviceArea.description ? (
                  <div className="mt-7 max-w-2xl space-y-4">
                    {serviceArea.description
                      .split(/\n{2,}/)
                      .filter(Boolean)
                      .map((paragraph, index) => (
                        <p
                          key={`${serviceArea.id}-description-${index}`}
                          className="text-sm leading-7 text-[#A8BBC8]"
                        >
                          {paragraph.trim()}
                        </p>
                      ))}
                  </div>
                ) : (
                  <p className="mt-7 max-w-xl text-sm leading-7 text-[#A8BBC8]">
                    Detailed information for this service area has not
                    been provided yet.
                  </p>
                )}
              </div>

              {/* Bottom stats */}
              <div className="mt-12 grid grid-cols-2 border-t border-[#F8FAFC]/10 pt-6">
                <div className="border-r border-[#F8FAFC]/10 pr-5">
                  <div className="text-3xl font-semibold tracking-[-0.05em]">
                    {String(suburbs.length).padStart(2, "0")}
                  </div>

                  <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.2em] text-[#F8FAFC]/30">
                    Suburbs
                  </p>
                </div>

                <div className="pl-5">
                  <div className="text-3xl font-semibold tracking-[-0.05em]">
                    {String(postcodes.length).padStart(2, "0")}
                  </div>

                  <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.2em] text-[#F8FAFC]/30">
                    Postcodes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Coverage data */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {/* Suburbs */}
            <div className="rounded-[2rem] border border-[#061A2B]/10 bg-white p-7 sm:p-9">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2">
                    <Navigation
                      className="h-4 w-4 text-[#0D6E91]"
                      strokeWidth={1.8}
                    />

                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#061A2B]/35">
                      Suburbs
                    </span>
                  </div>

                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.045em]">
                    Listed suburbs
                  </h3>
                </div>

                <span className="text-2xl font-semibold tracking-[-0.05em] text-[#061A2B]/20">
                  {String(suburbs.length).padStart(2, "0")}
                </span>
              </div>

              {suburbs.length > 0 ? (
                <div className="mt-7 flex flex-wrap gap-2">
                  {suburbs.map((suburb) => (
                    <span
                      key={suburb}
                      className="rounded-full border border-[#061A2B]/10 bg-[#061A2B]/[0.02] px-3.5 py-2 text-xs font-medium text-[#061A2B]/65 transition-colors duration-300 hover:border-[#0D6E91]/30 hover:text-[#061A2B]"
                    >
                      {suburb}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-7 text-sm leading-6 text-[#061A2B]/40">
                  No suburb list has been provided for this service
                  area yet.
                </p>
              )}
            </div>

            {/* Postcodes */}
            <div className="rounded-[2rem] border border-[#061A2B]/10 bg-white p-7 sm:p-9">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#0D6E91]">
                      #
                    </span>

                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#061A2B]/35">
                      Postcodes
                    </span>
                  </div>

                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.045em]">
                    Listed postcodes
                  </h3>
                </div>

                <span className="text-2xl font-semibold tracking-[-0.05em] text-[#061A2B]/20">
                  {String(postcodes.length).padStart(2, "0")}
                </span>
              </div>

              {postcodes.length > 0 ? (
                <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {postcodes.map((postcode) => (
                    <span
                      key={postcode}
                      className="flex min-h-10 items-center justify-center rounded-xl border border-[#061A2B]/10 bg-[#061A2B]/[0.02] px-3 text-xs font-medium text-[#061A2B]/65 transition-colors duration-300 hover:border-[#0D6E91]/30 hover:text-[#061A2B]"
                    >
                      {postcode}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-7 text-sm leading-6 text-[#061A2B]/40">
                  No postcode list has been provided for this service
                  area yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Service availability */}
        {serviceArea.serviceAvailability ? (
          <div className="mt-8 flex flex-col gap-5 rounded-[1.75rem] border border-[#061A2B]/10 bg-[#061A2B]/[0.025] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#061A2B] text-[#FFD400]">
                <ClockIcon />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#061A2B]/35">
                  Service availability
                </p>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#061A2B]/65">
                  {serviceArea.serviceAvailability}
                </p>
              </div>
            </div>

            <ArrowDownRight
              className="hidden h-5 w-5 shrink-0 text-[#061A2B]/20 sm:block"
              strokeWidth={1.6}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M12 8v4l2.5 1.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}