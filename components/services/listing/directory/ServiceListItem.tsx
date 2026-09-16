import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BatteryCharging,
  Clock3,
  MapPin,
  Siren,
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
  return (
    <article className="group relative border-t border-[#061A2B]/10">
      <div className="grid gap-8 py-10 sm:py-12 lg:grid-cols-[72px_minmax(0,1fr)_minmax(300px,0.72fr)] lg:items-center lg:gap-10 lg:py-14">
        {/* Number */}
        <div className="hidden lg:block">
          <span className="text-sm font-bold tracking-[0.12em] text-[#061A2B]/25 transition-colors duration-300 group-hover:text-[#061A2B]">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Main information */}
        <div className="min-w-0">
          <div className="mb-5 flex items-center gap-3 lg:hidden">
            <span className="text-xs font-bold tracking-[0.12em] text-[#061A2B]/25">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="h-px w-8 bg-[#FFD400]" />
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#061A2B]/35">
            <BatteryCharging className="h-3.5 w-3.5" />
            <span>Battery Service</span>
          </div>

          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-4xl lg:text-[3.25rem]">
            {service.title}
          </h2>

          {service.shortDescription ? (
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#061A2B]/50 sm:text-base">
              {service.shortDescription}
            </p>
          ) : null}

          {/* Service metadata */}
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
            {service.estimatedTime ? (
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[#061A2B]/40">
                <Clock3 className="h-3.5 w-3.5 text-[#0D6E91]" />
                {service.estimatedTime}
              </span>
            ) : null}

            {service.onSiteService ? (
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[#061A2B]/40">
                <MapPin className="h-3.5 w-3.5 text-[#0D6E91]" />
                At your vehicle
              </span>
            ) : null}

            {service.emergencyService ? (
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[#061A2B]/40">
                <Siren className="h-3.5 w-3.5 text-[#0D6E91]" />
                Emergency service
              </span>
            ) : null}
          </div>

          {/* CTA */}
          <Link
            href={`/services/${service.slug}`}
            className="group/link mt-8 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-[#061A2B]/70 transition-colors hover:text-[#061A2B]"
          >
            <span>{service.ctaText?.trim() || "Explore Service"}</span>

            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#061A2B]/15 transition-all duration-300 group-hover/link:rotate-45 group-hover/link:border-[#061A2B] group-hover/link:bg-[#061A2B] group-hover/link:text-[#FFD400]">
              <ArrowUpRight
                className="h-4 w-4"
                strokeWidth={1.8}
              />
            </span>
          </Link>
        </div>

        {/* Visual */}
        <Link
          href={`/services/${service.slug}`}
          aria-label={`Explore ${service.title}`}
          className="relative block"
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-[26px] bg-[#08263D] sm:rounded-[30px] lg:aspect-[4/3]">
            {service.heroImage?.secureUrl ? (
              <Image
                src={service.heroImage.secureUrl}
                alt={service.heroImage.alt?.trim() || service.title}
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_35%,rgba(13,110,145,0.4),transparent_35%),linear-gradient(145deg,#08263D_0%,#061A2B_75%)]">
                <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[26px] border border-[#FFD400]/20 bg-[#061A2B]/60 text-[#FFD400] backdrop-blur-xl">
                  <BatteryCharging
                    className="h-11 w-11"
                    strokeWidth={1.2}
                  />
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#061A2B]/65 via-transparent to-transparent opacity-70" />

            <span className="absolute left-4 top-4 rounded-full border border-white/[0.12] bg-[#061A2B]/55 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.17em] text-white/70 backdrop-blur-xl">
              Service {String(index + 1).padStart(2, "0")}
            </span>

            <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B] shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight
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