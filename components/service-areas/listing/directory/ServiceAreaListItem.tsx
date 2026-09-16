import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  Check,
  Clock3,
  MapPin,
  Navigation,
} from "lucide-react";

import type { ServiceAreaListingItem } from "../ServiceAreasListingPage";

interface ServiceAreaListItemProps {
  serviceArea: ServiceAreaListingItem;
  index: number;
}

function formatList(items: string[], max = 5) {
  return items.filter(Boolean).slice(0, max);
}

export default function ServiceAreaListItem({
  serviceArea,
  index,
}: ServiceAreaListItemProps) {
  const suburbs = formatList(serviceArea.suburbs, 5);
  const postcodes = formatList(serviceArea.postcodes, 6);

  return (
    <article className="group border-b border-[#061A2B]/10 py-10 first:border-t sm:py-14 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-[80px_minmax(0,0.82fr)_minmax(360px,0.95fr)] lg:items-stretch lg:gap-10">
        {/* Number */}
        <div className="hidden lg:block">
          <span className="text-xs font-bold tracking-[0.16em] text-[#061A2B]/25">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Information */}
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center justify-between gap-4 lg:hidden">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#061A2B]/30">
              Area {String(index + 1).padStart(2, "0")}
            </span>

            {serviceArea.featured ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#061A2B]/10 bg-[#FFD400]/20 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em]">
                <Check className="h-3 w-3" strokeWidth={2} />
                Featured
              </span>
            ) : null}
          </div>

          <div className="mt-5 flex items-center gap-2 lg:mt-0">
            <MapPin
              className="h-4 w-4 text-[#0D6E91]"
              strokeWidth={1.8}
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#061A2B]/40">
              Service Area
            </span>
          </div>

          <div className="mt-4 flex items-start justify-between gap-4">
            <h3 className="max-w-xl text-3xl font-semibold tracking-[-0.055em] sm:text-4xl lg:text-5xl">
              {serviceArea.name}
            </h3>

            {serviceArea.featured ? (
              <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-[#061A2B]/10 bg-[#FFD400]/20 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] lg:inline-flex">
                <Check className="h-3 w-3" strokeWidth={2} />
                Featured
              </span>
            ) : null}
          </div>

          {serviceArea.shortDescription ? (
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#061A2B]/55 sm:text-base">
              {serviceArea.shortDescription}
            </p>
          ) : null}

          {/* Metadata */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {suburbs.length > 0 ? (
              <div>
                <div className="flex items-center gap-2">
                  <Navigation
                    className="h-3.5 w-3.5 text-[#0D6E91]"
                    strokeWidth={1.8}
                  />

                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#061A2B]/35">
                    Suburbs
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {suburbs.map((suburb) => (
                    <span
                      key={suburb}
                      className="rounded-full border border-[#061A2B]/10 px-3 py-1.5 text-xs text-[#061A2B]/60"
                    >
                      {suburb}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {postcodes.length > 0 ? (
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#0D6E91]">
                    #
                  </span>

                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#061A2B]/35">
                    Postcodes
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {postcodes.map((postcode) => (
                    <span
                      key={postcode}
                      className="rounded-full border border-[#061A2B]/10 bg-[#061A2B]/[0.025] px-3 py-1.5 text-xs font-medium text-[#061A2B]/60"
                    >
                      {postcode}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {serviceArea.serviceAvailability ? (
            <div className="mt-7 flex items-start gap-3 border-t border-[#061A2B]/10 pt-5">
              <Clock3
                className="mt-0.5 h-4 w-4 shrink-0 text-[#0D6E91]"
                strokeWidth={1.8}
              />

              <p className="text-xs leading-6 text-[#061A2B]/50">
                {serviceArea.serviceAvailability}
              </p>
            </div>
          ) : null}

          {/* CTA */}
          <div className="mt-8">
            <Link
              href={`/service-areas/${serviceArea.slug}`}
              className="group/link inline-flex min-h-12 items-center gap-3 rounded-full bg-[#061A2B] pl-5 pr-1.5 text-sm font-semibold text-[#F8FAFC] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#08263D]"
            >
              <span>Explore {serviceArea.name}</span>

              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B] transition-transform duration-300 group-hover/link:rotate-45">
                <ArrowUpRight
                  className="h-4 w-4"
                  strokeWidth={2}
                />
              </span>
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] bg-[#08263D] sm:min-h-[400px] lg:min-h-full">
          {serviceArea.heroImage?.secureUrl ? (
            <>
              <Image
                src={serviceArea.heroImage.secureUrl}
                alt={
                  serviceArea.heroImage.alt ||
                  `${serviceArea.name} service area`
                }
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              />

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#061A2B]/75 via-[#061A2B]/5 to-transparent"
              />

              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-7 sm:bottom-7">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/55">
                    Mobile service
                  </p>

                  <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-white">
                    {serviceArea.name}
                  </p>
                </div>

                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
                  <ArrowUpRight
                    className="h-5 w-5"
                    strokeWidth={1.8}
                  />
                </span>
              </div>
            </>
          ) : (
            /* Graceful fallback when admin has not uploaded an image */
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#0D6E91]/30 blur-[70px]" />

              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#FFD400]/10 blur-[70px]" />

              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #F8FAFC 1px, transparent 1px),
                    linear-gradient(to bottom, #F8FAFC 1px, transparent 1px)
                  `,
                  backgroundSize: "44px 44px",
                }}
              />

              <div className="relative flex h-full min-h-[320px] flex-col justify-between p-6 sm:min-h-[400px] sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F8FAFC]/10 text-[#FFD400]">
                    <MapPin
                      className="h-4 w-4"
                      strokeWidth={1.8}
                    />
                  </span>

                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#F8FAFC]/30">
                    Location
                  </span>
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#F8FAFC]/35">
                    Service Area
                  </p>

                  <h4 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#F8FAFC] sm:text-4xl">
                    {serviceArea.name}
                  </h4>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}