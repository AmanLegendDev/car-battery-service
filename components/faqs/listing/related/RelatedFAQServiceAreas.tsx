import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
} from "lucide-react";

export interface RelatedFAQServiceArea {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  heroImage: {
    secureUrl: string;
    alt: string;
  } | null;
}

interface RelatedFAQServiceAreasProps {
  serviceAreas: RelatedFAQServiceArea[];
}

export default function RelatedFAQServiceAreas({
  serviceAreas,
}: RelatedFAQServiceAreasProps) {
  if (serviceAreas.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          {/* Intro */}
          <div className="max-w-md">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-9 bg-[#0D6E91]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0D6E91]">
                Service areas
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#061A2B] sm:text-4xl">
              Questions connected
              <span className="text-[#061A2B]/30">
                {" "}
                to your area.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#061A2B]/45 sm:text-base">
              Explore the service areas connected to
              the questions in our FAQ collection.
            </p>
          </div>

          {/* Areas */}
          <div className="grid gap-4 sm:grid-cols-2">
            {serviceAreas.map((area) => (
              <Link
                key={area.id}
                href={`/service-areas/${area.slug}`}
                className="group relative overflow-hidden rounded-[1.5rem] border border-[#061A2B]/[0.08] bg-[#F8FAFC] transition duration-300 hover:-translate-y-1 hover:border-[#0D6E91]/20"
              >
                <div className="relative h-40 overflow-hidden bg-[#061A2B]">
                  {area.heroImage?.secureUrl ? (
                    <Image
                      src={area.heroImage.secureUrl}
                      alt={
                        area.heroImage.alt ||
                        area.name
                      }
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#FFD400]">
                      <MapPin
                        size={32}
                        strokeWidth={1.5}
                      />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#061A2B]/80 via-[#061A2B]/10 to-transparent" />

                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                    <MapPin size={14} />

                    <span className="text-xs font-semibold">
                      {area.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4 p-5">
                  <div>
                    <h3 className="text-base font-semibold text-[#061A2B]">
                      {area.name}
                    </h3>

                    {area.shortDescription ? (
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#061A2B]/45">
                        {area.shortDescription}
                      </p>
                    ) : null}
                  </div>

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#061A2B]/[0.05] text-[#061A2B]/45 transition group-hover:bg-[#FFD400] group-hover:text-[#061A2B]">
                    <ArrowUpRight size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}