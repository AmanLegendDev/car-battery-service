
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  MapPin,
  Siren,
  Wrench,
} from "lucide-react";

interface ServiceListItemProps {
  service: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    heroImage: {
      secureUrl: string;
      width: number;
      height: number;
      alt: string;
    } | null;
    estimatedTime: string;
    emergencyService: boolean;
    onSiteService: boolean;
    ctaText: string;
  };
  index: number;
}

export default function ServiceListItem({
  service,
  index,
}: ServiceListItemProps) {
  const serviceHref = `/services/${service.slug}`;

  return (
    <article className="group relative border-t border-[#061A2B]/10">
      <div className="grid gap-7 py-9 sm:gap-9 sm:py-12 lg:grid-cols-[64px_minmax(0,1fr)_minmax(300px,0.72fr)] lg:items-center lg:gap-10 lg:py-14">
        {/* Service number */}
        <div className="hidden lg:block">
          <span className="text-sm font-bold tracking-[0.12em] text-[#061A2B]/30 transition-colors duration-300 group-hover:text-[#0D6E91]">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Service information */}
        <div className="min-w-0">
          <div className="mb-5 flex items-center gap-3 lg:hidden">
            <span className="text-xs font-bold tracking-[0.12em] text-[#061A2B]/35">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="h-px w-8 bg-[#FFD400]" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#0D6E91]/15 bg-[#0D6E91]/[0.06] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.17em] text-[#0D6E91]">
            <Wrench aria-hidden="true" className="h-3.5 w-3.5" />
            <span>Vehicle Service</span>
          </div>

          <h3 className="mt-5 max-w-2xl text-3xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-4xl lg:text-[3.25rem]">
            {service.title}
          </h3>

          {service.shortDescription ? (
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#061A2B]/65 sm:text-base sm:leading-8">
              {service.shortDescription}
            </p>
          ) : null}

          {/* Service details */}
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
            {service.estimatedTime?.trim() ? (
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#061A2B]/55">
                <Clock3
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 text-[#0D6E91]"
                />
                {service.estimatedTime}
              </span>
            ) : null}

            {service.onSiteService ? (
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#061A2B]/55">
                <MapPin
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 text-[#0D6E91]"
                />
                At your vehicle
              </span>
            ) : null}

            {service.emergencyService ? (
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#061A2B]/55">
                <Siren
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 text-[#0D6E91]"
                />
                Emergency service
              </span>
            ) : null}
          </div>

          {/* Service page link */}
          <Link
            href={serviceHref}
            className="group/link mt-8 inline-flex items-center gap-3 rounded-full text-xs font-bold uppercase tracking-[0.15em] text-[#061A2B]/80 transition-colors hover:text-[#0D6E91] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D6E91] focus-visible:ring-offset-4"
          >
            <span>{service.ctaText?.trim() || "Explore Service"}</span>

            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#061A2B]/15 bg-white transition-all duration-300 group-hover/link:rotate-45 group-hover/link:border-[#061A2B] group-hover/link:bg-[#061A2B] group-hover/link:text-[#FFD400]">
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4"
                strokeWidth={1.8}
              />
            </span>
          </Link>
        </div>

        {/* Service image */}
        <Link
          href={serviceHref}
          aria-label={`Explore ${service.title}`}
          className="relative block min-w-0 rounded-[26px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D6E91] focus-visible:ring-offset-4 sm:rounded-[30px]"
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-[26px] bg-gradient-to-br from-[#10354B] via-[#08263D] to-[#061A2B] sm:rounded-[30px] lg:aspect-[4/3]">
            {service.heroImage?.secureUrl ? (
              <Image
                src={service.heroImage.secureUrl}
                alt={service.heroImage.alt?.trim() || service.title}
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 90vw, 42vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
              />
            ) : (
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_70%_25%,rgba(13,110,145,0.38),transparent_40%),linear-gradient(145deg,#10354B_0%,#08263D_50%,#061A2B_100%)]"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-[26px] border border-[#FFD400]/25 bg-white/[0.04] text-[#FFD400] shadow-2xl backdrop-blur-xl">
                  <Wrench
                    className="h-10 w-10"
                    strokeWidth={1.25}
                  />
                </div>

                <div className="absolute bottom-0 left-0 h-1 w-1/3 bg-[#FFD400]" />
              </div>
            )}

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#061A2B]/65 via-transparent to-transparent opacity-80"
            />

            <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-[#061A2B]/60 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-white/85 backdrop-blur-xl">
              Service {String(index + 1).padStart(2, "0")}
            </span>

            <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B] shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4"
                strokeWidth={2}
              />
            </span>
          </div>
        </Link>
      </div>
    </article>
  );
}
