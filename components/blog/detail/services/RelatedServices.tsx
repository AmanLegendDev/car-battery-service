import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BatteryCharging,
  Clock3,
  ShieldCheck,
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
  if (services.length === 0) {
    return null;
  }

  const visibleServices = services.slice(0, 3);

  return (
    <section className="overflow-hidden bg-[#061A2B] px-5 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFD400]">
              <span className="h-px w-7 bg-[#FFD400]" />
              Need Help?
            </div>

            <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Explore the services behind the advice.
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-white/55 lg:text-right">
            View the available mobile battery services and see which option
            matches what you need at your vehicle.
          </p>
        </div>

        {/* Services */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleServices.map((service) => {
            const image =
              service.heroImage?.secureUrl || null;

            return (
              <article
                key={service.slug}
                className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] transition duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
              >
                {/* Image */}
                <Link
                  href={`/services/${service.slug}`}
                  aria-label={`View ${service.title}`}
                  className="relative block aspect-[16/10] overflow-hidden bg-[#08263D]"
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={
                        service.heroImage?.alt ||
                        service.title
                      }
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(13,110,145,0.6),transparent_38%),linear-gradient(135deg,#061A2B,#08263D_60%,#0D6E91)]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BatteryCharging
                          size={48}
                          strokeWidth={1.2}
                          className="text-white/20"
                        />
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#061A2B]/60 to-transparent" />

                  <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B] opacity-0 transition duration-300 group-hover:opacity-100">
                    <ArrowUpRight size={17} />
                  </span>
                </Link>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold tracking-[-0.02em]">
                    {service.title}
                  </h3>

                  {service.shortDescription && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/55">
                      {service.shortDescription}
                    </p>
                  )}

                  {/* Details */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {service.estimatedTime && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium text-white/60">
                        <Clock3 size={12} />
                        {service.estimatedTime}
                      </span>
                    )}

                    {service.onSiteService && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium text-white/60">
                        <ShieldCheck size={12} />
                        On-site
                      </span>
                    )}

                    {service.emergencyService && (
                      <span className="rounded-full border border-[#FFD400]/20 bg-[#FFD400]/[0.08] px-3 py-1.5 text-[10px] font-semibold text-[#FFD400]">
                        Emergency
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/services/${service.slug}`}
                    className="mt-7 inline-flex items-center gap-1.5 text-xs font-semibold text-white transition-colors hover:text-[#FFD400]"
                  >
                    View service
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}