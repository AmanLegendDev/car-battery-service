import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BatteryCharging,
  Clock3,
  MapPin,
  Zap,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import Service from "@/models/Service";

const SERVICE_LIMIT = 3;

const FALLBACK_ICONS = [
  BatteryCharging,
  Zap,
  BatteryCharging,
];

function getServiceIcon(index: number) {
  return FALLBACK_ICONS[index] ?? BatteryCharging;
}

export default async function ServicesOverview() {
  await connectDB();

  const services = await Service.find({
    status: "active",
  })
    .select({
      title: 1,
      slug: 1,
      shortDescription: 1,
      icon: 1,
      heroImage: 1,
      estimatedTime: 1,
      onSiteService: 1,
      emergencyService: 1,
      ctaText: 1,
      displayOrder: 1,
    })
    .sort({
      displayOrder: 1,
    })
    .limit(SERVICE_LIMIT)
    .lean();

  if (!services.length) {
    return null;
  }

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#F8FAFC] text-[#061A2B]"
    >
      {/* Subtle background detail */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#FFD400]/10 blur-3xl"
      />

      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        {/* Section heading */}
        <div className="mb-14 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#FFD400]" />

              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#0D6E91]">
                What We Do
              </span>
            </div>

            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Mobile battery assistance
            </p>
          </div>

          <div className="max-w-3xl lg:ml-auto">
            <h2 className="text-4xl font-black leading-[0.96] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Battery help,
              <br />
              <span className="text-[#0D6E91]">where you need it.</span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Explore our mobile battery services and choose the assistance
              that fits your situation.
            </p>
          </div>
        </div>

        {/* Services */}
        <div className="border-t border-[#061A2B]/10">
          {services.map((service, index) => {
            const ServiceIcon = getServiceIcon(index);

            const imageUrl =
              service.heroImage?.secureUrl ||
              undefined;

            return (
              <article
                key={service._id.toString()}
                className="group border-b border-[#061A2B]/10"
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="grid min-h-[270px] gap-0 lg:grid-cols-[90px_300px_minmax(0,1fr)_260px] lg:items-stretch"
                >
                  {/* Number */}
                  <div className="hidden border-r border-[#061A2B]/10 py-10 lg:flex lg:items-start lg:justify-start">
                    <span className="font-mono text-xs font-bold tracking-[0.18em] text-slate-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Image */}
                  <div className="relative mt-6 aspect-[16/10] overflow-hidden bg-[#08263D] lg:my-7 lg:mr-8 lg:mt-7 lg:aspect-auto">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={
                          service.heroImage?.alt ||
                          service.title
                        }
                        fill
                        sizes="(max-width: 1024px) 100vw, 300px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full min-h-[190px] items-center justify-center bg-[#08263D]">
                        <ServiceIcon
                          aria-hidden="true"
                          className="h-12 w-12 text-[#FFD400]"
                          strokeWidth={1.4}
                        />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#061A2B]/60 via-transparent to-transparent opacity-70" />

                    <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center bg-[#FFD400] text-[#061A2B]">
                      <ServiceIcon
                        aria-hidden="true"
                        className="h-5 w-5"
                        strokeWidth={2}
                      />
                    </div>
                  </div>

                  {/* Main information */}
                  <div className="flex flex-col justify-center py-8 lg:py-10 lg:pr-10">
                    <div className="mb-3 flex items-center gap-3 lg:hidden">
                      <span className="font-mono text-xs font-bold tracking-[0.18em] text-slate-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="h-px w-8 bg-[#FFD400]" />
                    </div>

                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0D6E91]">
                          Battery Service
                        </p>

                        <h3 className="max-w-xl text-2xl font-black tracking-[-0.035em] sm:text-3xl lg:text-4xl">
                          {service.title}
                        </h3>
                      </div>

                      <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#061A2B]/15 transition-all duration-300 group-hover:border-[#FFD400] group-hover:bg-[#FFD400]">
                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45"
                        />
                      </span>
                    </div>

                    <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                      {service.shortDescription}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {service.onSiteService && (
                        <span className="inline-flex items-center gap-2 border border-[#061A2B]/10 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#061A2B]">
                          <MapPin
                            aria-hidden="true"
                            className="h-3.5 w-3.5 text-[#0D6E91]"
                          />
                          On-Site Service
                        </span>
                      )}

                      {service.emergencyService && (
                        <span className="inline-flex items-center gap-2 border border-[#FFD400]/50 bg-[#FFD400]/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#061A2B]">
                          <Zap
                            aria-hidden="true"
                            className="h-3.5 w-3.5"
                          />
                          Emergency Assistance
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Service details */}
                  <div className="flex flex-col justify-between border-t border-[#061A2B]/10 py-7 lg:border-l lg:border-t-0 lg:py-10 lg:pl-8">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        Service Details
                      </p>

                      {service.estimatedTime ? (
                        <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-[#061A2B]">
                          <Clock3
                            aria-hidden="true"
                            className="h-4 w-4 text-[#0D6E91]"
                          />

                          <span>{service.estimatedTime}</span>
                        </div>
                      ) : (
                        <p className="mt-4 text-sm text-slate-500">
                          Contact us to discuss your situation.
                        </p>
                      )}
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#061A2B]">
                        {service.ctaText || "View Service"}
                      </span>

                      <span className="h-px w-12 bg-[#FFD400] transition-all duration-300 group-hover:w-20" />
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {/* Bottom navigation */}
        <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-6 text-slate-500">
            Need help deciding which service is right for your vehicle?
            Contact us and discuss your situation.
          </p>

          <Link
            href="/services"
            className="group inline-flex w-fit items-center gap-3 text-sm font-bold text-[#061A2B]"
          >
            <span className="border-b-2 border-[#FFD400] pb-1">
              View All Services
            </span>

            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}