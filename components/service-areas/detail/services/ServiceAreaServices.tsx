import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  BatteryCharging,
  Clock3,
  ShieldCheck,
} from "lucide-react";

interface ServiceAreaServiceItem {
  id: string;
  title: string;
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

  estimatedTime: string;
  emergencyService: boolean;
  onSiteService: boolean;
  ctaText: string;
  featured: boolean;
  displayOrder: number;
}

interface ServiceAreaServicesProps {
  serviceAreaName: string;
  services: ServiceAreaServiceItem[];
}

export default function ServiceAreaServices({
  serviceAreaName,
  services,
}: ServiceAreaServicesProps) {
  if (!services.length) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#061A2B] text-[#F8FAFC]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-[#0D6E91]/15 blur-[120px]"
      />

      <div className="relative mx-auto max-w-[1420px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        {/* Header */}
        <div className="grid gap-8 border-b border-[#F8FAFC]/10 pb-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end lg:gap-20">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FFD400]/25 bg-[#FFD400]/10 text-[#FFD400]">
                <BatteryCharging
                  className="h-3.5 w-3.5"
                  strokeWidth={1.7}
                />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#F8FAFC]/40">
                Services available
              </span>
            </div>

            <h2 className="mt-6 max-w-4xl text-4xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-5xl lg:text-7xl">
              Battery help for
              <br />
              <span className="text-[#F8FAFC]/30">
                {serviceAreaName}.
              </span>
            </h2>
          </div>

          <p className="text-sm leading-7 text-[#A8BBC8]">
            Explore the active services currently listed by Car Battery
            Service.
          </p>
        </div>

        {/* Service cards */}
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {services.map((service, index) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group relative min-h-[430px] overflow-hidden rounded-[2rem] border border-[#F8FAFC]/10 bg-[#08263D] transition-all duration-500 hover:-translate-y-1 hover:border-[#F8FAFC]/20"
            >
              {/* Image */}
              {service.heroImage?.secureUrl ? (
                <>
                  <Image
                    src={service.heroImage.secureUrl}
                    alt={
                      service.heroImage.alt ||
                      service.title
                    }
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover opacity-55 transition-transform duration-700 group-hover:scale-[1.035]"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#061A2B] via-[#061A2B]/65 to-[#061A2B]/10"
                  />
                </>
              ) : (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(13,110,145,0.3),transparent_40%),linear-gradient(135deg,#08263D,#061A2B)]"
                />
              )}

              {/* Technical grid */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.045]"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #F8FAFC 1px, transparent 1px),
                    linear-gradient(to bottom, #F8FAFC 1px, transparent 1px)
                  `,
                  backgroundSize: "48px 48px",
                }}
              />

              {/* Content */}
              <div className="relative flex h-full min-h-[430px] flex-col justify-between p-6 sm:p-8">
                <div className="flex items-start justify-between gap-5">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#F8FAFC]/40">
                    Service {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F8FAFC]/10 bg-[#061A2B]/30 text-[#FFD400] backdrop-blur-md transition-all duration-300 group-hover:border-[#FFD400]/30 group-hover:bg-[#FFD400] group-hover:text-[#061A2B]">
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45"
                      strokeWidth={1.8}
                    />
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap gap-2">
                    {service.emergencyService ? (
                      <span className="rounded-full border border-[#FFD400]/20 bg-[#FFD400]/10 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.17em] text-[#FFD400]">
                        Emergency service
                      </span>
                    ) : null}

                    {service.onSiteService ? (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.17em] text-white/60">
                        On-site service
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-4 max-w-2xl text-3xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-4xl">
                    {service.title}
                  </h3>

                  {service.shortDescription ? (
                    <p className="mt-4 max-w-xl text-sm leading-6 text-[#A8BBC8]">
                      {service.shortDescription}
                    </p>
                  ) : null}

                  <div className="mt-7 flex flex-wrap gap-5 border-t border-[#F8FAFC]/10 pt-5">
                    {service.estimatedTime ? (
                      <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#F8FAFC]/40">
                        <Clock3
                          className="h-3.5 w-3.5 text-[#FFD400]"
                          strokeWidth={1.7}
                        />

                        {service.estimatedTime}
                      </span>
                    ) : null}

                    {service.onSiteService ? (
                      <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#F8FAFC]/40">
                        <ShieldCheck
                          className="h-3.5 w-3.5 text-[#FFD400]"
                          strokeWidth={1.7}
                        />

                        At your vehicle
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}