
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronRight,
  Map,
  MapPin,
  Navigation,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import ServiceArea from "@/models/ServiceArea";

const SERVICE_AREA_LIMIT = 3;

interface HomepageServiceAreaMedia {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: "image";
  alt: string;
}

interface HomepageServiceArea {
  _id: unknown;
  name: string;
  slug: string;
  shortDescription: string;
  suburbs: string[];
  postcodes: string[];
  heroImage: HomepageServiceAreaMedia | null;
  mapUrl: string;
  serviceAvailability: string;
  featured: boolean;
  displayOrder: number;
}

export default async function ServiceAreasOverview() {
  let serviceAreas: HomepageServiceArea[] = [];

  try {
    await connectDB();

    const results = await ServiceArea.find({
      status: "active",
    })
      .select({
        name: 1,
        slug: 1,
        shortDescription: 1,
        suburbs: 1,
        postcodes: 1,
        heroImage: 1,
        mapUrl: 1,
        serviceAvailability: 1,
        featured: 1,
        displayOrder: 1,
      })
      .sort({
        featured: -1,
        displayOrder: 1,
        name: 1,
      })
      .limit(SERVICE_AREA_LIMIT)
      .lean();

    serviceAreas = results as unknown as HomepageServiceArea[];
  } catch (error) {
    console.error("Failed to load homepage service areas:", error);
  }

  if (serviceAreas.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="service-areas-heading"
      className="relative isolate overflow-hidden bg-[#F8FAFC] text-[#061A2B]"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 h-[420px] w-[420px] rounded-full bg-[#0D6E91]/[0.055] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-0 h-[360px] w-[360px] rounded-full bg-[#FFD400]/[0.07] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-[6%] top-0 h-full w-px bg-[#061A2B]/[0.035]" />
        <div className="absolute right-[6%] top-0 h-full w-px bg-[#061A2B]/[0.035]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        {/* Section heading */}
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 bg-[#FFD400]"
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#0D6E91]">
                Service Areas
              </span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <MapPin
                aria-hidden="true"
                className="h-4 w-4 text-[#0D6E91]"
                strokeWidth={1.6}
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Local automotive coverage
              </span>
            </div>
          </div>

          <div className="max-w-4xl lg:ml-auto">
            <h2
              id="service-areas-heading"
              className="text-4xl font-black leading-[0.98] tracking-[-0.05em] sm:text-5xl lg:text-6xl"
            >
              Find service in
              <br />
              <span className="text-[#0D6E91]">
                your area.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Explore our published service areas to check listed
              suburbs, postcodes and local coverage information.
              Choose an area for more details about services and
              availability.
            </p>
          </div>
        </div>

        {/* Published service areas */}
        <div className="mt-14 lg:mt-20">
          {serviceAreas.map((area, index) => {
            const imageUrl = area.heroImage?.secureUrl || null;

            const suburbs = Array.isArray(area.suburbs)
              ? area.suburbs.filter(
                  (suburb): suburb is string =>
                    typeof suburb === "string" &&
                    suburb.trim().length > 0,
                )
              : [];

            const postcodes = Array.isArray(area.postcodes)
              ? area.postcodes.filter(
                  (postcode): postcode is string =>
                    typeof postcode === "string" &&
                    postcode.trim().length > 0,
                )
              : [];

            const areaHref = `/service-areas/${area.slug}`;

            return (
              <article
                key={String(area._id)}
                className="group relative border-t border-[#061A2B]/10"
              >
                <div className="grid lg:grid-cols-[70px_0.8fr_1.2fr_250px] lg:items-stretch xl:grid-cols-[90px_0.8fr_1.2fr_270px]">
                  {/* Index */}
                  <div className="hidden border-r border-[#061A2B]/10 py-10 lg:flex lg:items-start">
                    <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-slate-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Area image */}
                  <Link
                    href={areaHref}
                    aria-label={`Explore ${area.name} service area`}
                    className="relative mt-6 block aspect-[16/10] overflow-hidden bg-[#08263D] outline-none focus-visible:ring-2 focus-visible:ring-[#0D6E91] focus-visible:ring-offset-4 lg:my-7 lg:mr-8 lg:mt-7 lg:aspect-auto"
                  >
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={
                          area.heroImage?.alt ||
                          `${area.name} service area`
                        }
                        fill
                        sizes="(max-width: 1023px) 100vw, (max-width: 1279px) 30vw, 330px"
                        className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="absolute inset-0"
                      >
                        <div className="absolute left-1/2 top-1/2 h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#A8BBC8]/10 sm:h-[250px] sm:w-[250px]" />

                        <div className="absolute left-1/2 top-1/2 h-[145px] w-[145px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0D6E91]/30" />

                        <div className="absolute left-1/2 top-1/2 h-px w-[75%] -translate-x-1/2 bg-[#0D6E91]/20" />

                        <div className="absolute left-1/2 top-1/2 h-[75%] w-px -translate-x-1/2 bg-[#0D6E91]/20" />

                        <div className="absolute left-[28%] top-[34%] h-2 w-2 bg-[#A8BBC8]/30" />

                        <div className="absolute right-[25%] top-[30%] h-2 w-2 bg-[#A8BBC8]/20" />

                        <div className="absolute bottom-[27%] left-[31%] h-2 w-2 bg-[#A8BBC8]/20" />

                        <div className="absolute bottom-[32%] right-[28%] h-2 w-2 bg-[#A8BBC8]/30" />

                        <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-[#FFD400]/50 bg-[#061A2B] shadow-[0_0_50px_rgba(13,110,145,0.25)]">
                          <MapPin
                            className="h-7 w-7 text-[#FFD400]"
                            strokeWidth={1.3}
                          />
                        </div>
                      </div>
                    )}

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#061A2B]/80 via-[#061A2B]/10 to-transparent"
                    />

                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 sm:bottom-5 sm:left-5 sm:right-5">
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#FFD400]">
                          Service Area
                        </p>

                        <p className="mt-1 break-words text-xl font-black tracking-[-0.025em] text-[#F8FAFC] sm:text-2xl">
                          {area.name}
                        </p>
                      </div>

                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/25 bg-[#061A2B]/60"
                      >
                        <ArrowUpRight className="h-4 w-4 text-[#F8FAFC] transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>

                  {/* Area information */}
                  <div className="flex min-w-0 flex-col justify-center py-8 lg:py-10 lg:pr-8 xl:pr-10">
                    <div className="mb-4 flex items-center gap-3 lg:hidden">
                      <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-slate-500">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="h-px w-8 bg-[#FFD400]" />
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0D6E91]">
                          Local Coverage
                        </p>

                        <h3 className="mt-2 text-2xl font-black leading-tight tracking-[-0.035em] sm:text-3xl lg:text-4xl">
                          <Link
                            href={areaHref}
                            className="rounded-sm outline-none transition-colors duration-300 hover:text-[#0D6E91] focus-visible:ring-2 focus-visible:ring-[#0D6E91] focus-visible:ring-offset-4"
                          >
                            {area.name}
                          </Link>
                        </h3>
                      </div>

                      <Link
                        href={areaHref}
                        aria-label={`View details for ${area.name}`}
                        className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#061A2B]/15 outline-none transition-colors duration-300 hover:border-[#FFD400] hover:bg-[#FFD400] focus-visible:ring-2 focus-visible:ring-[#0D6E91] focus-visible:ring-offset-2 lg:flex"
                      >
                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-4 w-4"
                        />
                      </Link>
                    </div>

                    {area.shortDescription?.trim() && (
                      <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                        {area.shortDescription}
                      </p>
                    )}

                    {/* Coverage counts */}
                    <div className="mt-7 grid grid-cols-2 gap-3 sm:max-w-md">
                      <div className="border border-[#061A2B]/10 bg-white px-4 py-4">
                        <p className="font-mono text-2xl font-bold tracking-[-0.03em] text-[#061A2B]">
                          {suburbs.length}
                        </p>
                        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                          Suburbs listed
                        </p>
                      </div>

                      <div className="border border-[#061A2B]/10 bg-white px-4 py-4">
                        <p className="font-mono text-2xl font-bold tracking-[-0.03em] text-[#061A2B]">
                          {postcodes.length}
                        </p>
                        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                          Postcodes listed
                        </p>
                      </div>
                    </div>

                    {/* Selected suburbs */}
                    {suburbs.length > 0 && (
                      <div className="mt-7">
                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                          Selected Suburbs
                        </p>

                        <ul className="mt-3 flex flex-wrap gap-2">
                          {suburbs.slice(0, 5).map((suburb) => (
                            <li
                              key={suburb}
                              className="border border-[#061A2B]/10 bg-white px-3 py-2 text-[10px] font-semibold text-[#061A2B]"
                            >
                              {suburb}
                            </li>
                          ))}

                          {suburbs.length > 5 && (
                            <li className="border border-[#061A2B]/10 bg-white px-3 py-2 text-[10px] font-semibold text-slate-500">
                              +{suburbs.length - 5} more
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Availability and map */}
                  <div className="flex min-w-0 flex-col justify-between border-t border-[#061A2B]/10 py-7 lg:border-l lg:border-t-0 lg:py-10 lg:pl-6 xl:pl-8">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        Area Details
                      </p>

                      {area.serviceAvailability?.trim() ? (
                        <div className="mt-4 flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center bg-[#FFD400]"
                          >
                            <Navigation
                              className="h-3.5 w-3.5 text-[#061A2B]"
                              strokeWidth={2}
                            />
                          </span>

                          <p className="text-xs font-semibold leading-5 text-[#061A2B]">
                            {area.serviceAvailability}
                          </p>
                        </div>
                      ) : (
                        <p className="mt-4 text-xs leading-5 text-slate-600">
                          Contact our team with your vehicle details
                          and location to discuss service availability.
                        </p>
                      )}

                      {postcodes.length > 0 && (
                        <div className="mt-6">
                          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                            Postcodes
                          </p>

                          <p className="mt-2 break-words font-mono text-xs font-semibold leading-6 tracking-[0.04em] text-[#061A2B]">
                            {postcodes.slice(0, 4).join(" · ")}
                            {postcodes.length > 4 ? " · …" : ""}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-8">
                      {area.mapUrl?.trim() ? (
                        <a
                          href={area.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open map for ${area.name} service area (opens in a new tab)`}
                          className="group/map inline-flex items-center gap-2 rounded-sm text-xs font-bold uppercase tracking-[0.1em] text-[#061A2B] outline-none focus-visible:ring-2 focus-visible:ring-[#0D6E91] focus-visible:ring-offset-4"
                        >
                          <Map
                            aria-hidden="true"
                            className="h-4 w-4 text-[#0D6E91]"
                          />

                          <span className="border-b border-transparent transition-colors group-hover/map:border-[#FFD400]">
                            View Area Map
                          </span>

                          <ChevronRight
                            aria-hidden="true"
                            className="h-3.5 w-3.5 transition-transform duration-300 motion-safe:group-hover/map:translate-x-1"
                          />
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                          <MapPin
                            aria-hidden="true"
                            className="h-3.5 w-3.5"
                          />
                          Area information
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* All service areas CTA */}
        <div className="mt-10 border-t border-[#061A2B]/10 pt-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#061A2B]"
              >
                <Map className="h-5 w-5 text-[#FFD400]" strokeWidth={1.5} />
              </div>

              <div>
                <p className="text-sm font-bold text-[#061A2B]">
                  Can’t find your area?
                </p>

                <p className="mt-1 max-w-xl text-xs leading-5 text-slate-600 sm:text-sm">
                  Browse all published service areas to check the
                  available coverage information.
                </p>
              </div>
            </div>

            <Link
              href="/service-areas"
              className="group inline-flex w-fit items-center gap-3 rounded-sm text-xs font-bold uppercase tracking-[0.12em] text-[#061A2B] outline-none focus-visible:ring-2 focus-visible:ring-[#0D6E91] focus-visible:ring-offset-4"
            >
              <span className="border-b-2 border-[#FFD400] pb-1">
                View All Service Areas
              </span>

              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
