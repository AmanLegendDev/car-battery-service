
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Wrench,
} from "lucide-react";

interface ServiceMedia {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: "image";
  alt: string;
}

interface RelatedServicesProps {
  services: Array<{
    title: string;
    slug: string;
    shortDescription: string;
    heroImage: ServiceMedia | null;
    estimatedTime: string;
    emergencyService: boolean;
    onSiteService: boolean;
  }>;
}

export default function RelatedServices({
  services,
}: RelatedServicesProps) {
  if (!services?.length) {
    return null;
  }

  const visibleServices = services.slice(0, 3);

  return (
    <section
      aria-labelledby="related-services-heading"
      className="relative isolate overflow-hidden bg-[#061A2B] px-5 py-16 text-white sm:px-6 lg:px-8 lg:py-24"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#0D6E91]/20 blur-[130px]" />

        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#FFD400]/[0.06] blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-10 flex flex-col gap-5 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFD400]">
              <span
                aria-hidden="true"
                className="h-px w-7 bg-[#FFD400]"
              />

              Explore More
            </div>

            <h2
              id="related-services-heading"
              className="max-w-2xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl"
            >
              Find the right service for your vehicle.
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-white/55 lg:text-right">
            Explore our other automotive services, compare the
            available options and find the support that best
            matches your vehicle's needs.
          </p>
        </div>

        {/* Related service cards */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleServices.map((service) => {
            const image = service.heroImage?.secureUrl || null;

            const imageAlt =
              service.heroImage?.alt?.trim() || service.title;

            return (
              <article
                key={service.slug}
                className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
              >
                {/* Service image */}
                <Link
                  href={`/services/${service.slug}`}
                  aria-label={`View ${service.title}`}
                  className="relative block aspect-[16/10] overflow-hidden bg-[#08263D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FFD400]"
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={imageAlt}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(13,110,145,0.6),transparent_38%),linear-gradient(135deg,#061A2B,#08263D_60%,#0D6E91)]"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Wrench
                          size={48}
                          strokeWidth={1.2}
                          className="text-white/25"
                        />
                      </div>

                      <div className="absolute left-6 top-6 h-16 w-16 rounded-full border border-white/10" />

                      <div className="absolute bottom-6 right-6 h-24 w-24 rounded-full border border-[#FFD400]/15" />
                    </div>
                  )}

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061A2B]/65 via-transparent to-transparent"
                  />

                  <span
                    aria-hidden="true"
                    className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B] shadow-lg transition-transform duration-300 group-hover:rotate-6"
                  >
                    <ArrowUpRight size={17} />
                  </span>
                </Link>

                {/* Service details */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">
                    {service.title}
                  </h3>

                  {service.shortDescription ? (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/55">
                      {service.shortDescription}
                    </p>
                  ) : null}

                  {/* Service attributes */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {service.estimatedTime ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium text-white/65">
                        <Clock3
                          size={12}
                          aria-hidden="true"
                        />

                        {service.estimatedTime}
                      </span>
                    ) : null}

                    {service.onSiteService ? (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium text-white/65">
                        On-site service
                      </span>
                    ) : null}

                    {service.emergencyService ? (
                      <span className="rounded-full border border-[#FFD400]/20 bg-[#FFD400]/[0.08] px-3 py-1.5 text-[10px] font-semibold text-[#FFD400]">
                        Emergency service
                      </span>
                    ) : null}
                  </div>

                  {/* Service link */}
                  <Link
                    href={`/services/${service.slug}`}
                    className="mt-7 inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-white/80 transition-colors hover:text-[#FFD400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
                  >
                    Explore Service

                    <ArrowRight
                      size={14}
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* All services CTA */}
        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href="/services"
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-[#FFD400]/40 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
          >
            View All Services

            <ArrowUpRight
              size={16}
              aria-hidden="true"
              className="text-[#FFD400] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
