import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  MapPin,
} from "lucide-react";

interface RelatedServiceAreaItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;

  heroImage: {
    publicId: string;
    secureUrl: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
    resourceType: "image";
    alt: string;
  } | null;

  suburbs: string[];
  postcodes: string[];

  featured: boolean;
  displayOrder: number;
}

interface RelatedServiceAreasProps {
  currentAreaName: string;
  areas: RelatedServiceAreaItem[];
}

export default function RelatedServiceAreas({
  currentAreaName,
  areas,
}: RelatedServiceAreasProps) {
  if (!areas.length) {
    return null;
  }

  return (
    <section className="bg-[#F8FAFC] text-[#061A2B]">
      <div className="mx-auto max-w-[1420px] px-4 pb-20 pt-4 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28">
        <div className="border-t border-[#061A2B]/10 pt-16 sm:pt-20">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#FFD400]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#061A2B]/40">
                  More locations
                </span>
              </div>

              <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-5xl lg:text-6xl">
                Other listed
                <br />
                <span className="text-[#061A2B]/30">
                  service areas.
                </span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-[#061A2B]/45">
              Explore other active service areas listed by Car Battery
              Service.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {areas.map((area, index) => (
              <Link
                key={area.id}
                href={`/service-areas/${area.slug}`}
                className="group relative min-h-[330px] overflow-hidden rounded-[2rem] bg-[#08263D] text-white"
              >
                {area.heroImage?.secureUrl ? (
                  <>
                    <Image
                      src={area.heroImage.secureUrl}
                      alt={
                        area.heroImage.alt ||
                        `${area.name} service area`
                      }
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-[1.035]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#061A2B] via-[#061A2B]/40 to-transparent" />
                  </>
                ) : (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(13,110,145,0.3),transparent_42%),linear-gradient(135deg,#08263D,#061A2B)]"
                  />
                )}

                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, #F8FAFC 1px, transparent 1px),
                      linear-gradient(to bottom, #F8FAFC 1px, transparent 1px)
                    `,
                    backgroundSize: "48px 48px",
                  }}
                />

                <div className="relative flex min-h-[330px] flex-col justify-between p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
                      Area {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#061A2B]/30 text-[#FFD400] backdrop-blur-md transition-all duration-300 group-hover:bg-[#FFD400] group-hover:text-[#061A2B]">
                      <ArrowUpRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45"
                        strokeWidth={1.8}
                      />
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin
                        className="h-3.5 w-3.5 text-[#FFD400]"
                        strokeWidth={1.8}
                      />

                      <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">
                        Service Area
                      </span>
                    </div>

                    <h3 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
                      {area.name}
                    </h3>

                    {area.shortDescription ? (
                      <p className="mt-3 max-w-lg text-sm leading-6 text-[#A8BBC8]">
                        {area.shortDescription}
                      </p>
                    ) : null}

                    <div className="mt-5 flex gap-2">
                      {area.suburbs.length > 0 ? (
                        <span className="rounded-full border border-white/10 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.15em] text-white/45">
                          {area.suburbs.length} suburbs
                        </span>
                      ) : null}

                      {area.postcodes.length > 0 ? (
                        <span className="rounded-full border border-white/10 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.15em] text-white/45">
                          {area.postcodes.length} postcodes
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <p className="sr-only">
            Related service areas to {currentAreaName}.
          </p>
        </div>
      </div>
    </section>
  );
}