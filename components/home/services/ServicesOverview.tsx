
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CarFront,
  Clock3,
  MapPin,
  Settings,
  Wrench,
  Zap,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import Service from "@/models/Service";

const SERVICE_LIMIT = 3;

const FALLBACK_ICONS = [Wrench, CarFront, Settings];

function getServiceIcon(index: number) {
  return FALLBACK_ICONS[index % FALLBACK_ICONS.length] ?? Wrench;
}

export default async function ServicesOverview() {
  let services;

  try {
    await connectDB();

    services = await Service.find({
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
  } catch (error) {
    console.error("Failed to load services overview:", error);
    return null;
  }

  if (!services.length) {
    return null;
  }

  return (
    <section
      id="services"
      aria-labelledby="services-overview-heading"
      className="relative overflow-hidden bg-[#F8FAFC] text-[#061A2B]"
    >
      {/* Subtle background detail */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#FFD400]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        {/* Section introduction */}
        <div className="mb-10 grid gap-6 sm:mb-14 sm:gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-[#FFD400]"
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0D6E91] sm:text-[11px] sm:tracking-[0.24em]">
                Our Services
              </span>
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 sm:mt-5 sm:text-sm sm:tracking-[0.16em]">
              Automotive care and assistance
            </p>
          </div>

          <div className="max-w-3xl lg:ml-auto">
            <h2
              id="services-overview-heading"
              className="text-4xl font-black leading-[0.98] tracking-[-0.045em] sm:text-5xl lg:text-6xl"
            >
              The right service.
              <br />
              <span className="text-[#0D6E91]">
                A better way forward.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-6 sm:text-base sm:leading-7">
              Explore the automotive services available from Rapid Auto
              Services. Find the option that suits your vehicle and
              contact our team to discuss your requirements.
            </p>
          </div>
        </div>

        {/* Dynamic service listings */}
        <div className="border-t border-[#061A2B]/10">
          {services.map((service, index) => {
            const ServiceIcon = getServiceIcon(index);

            const imageUrl =
              service.heroImage?.secureUrl || undefined;

            return (
              <article
                key={service._id.toString()}
                className="group border-b border-[#061A2B]/10"
              >
                <Link
                  href={`/services/${service.slug}`}
                  aria-label={`Explore ${service.title} services`}
                  className="grid gap-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0D6E91] lg:grid-cols-[60px_260px_minmax(0,1fr)_220px] xl:grid-cols-[90px_300px_minmax(0,1fr)_240px]"
                >
                  {/* Service number */}
                  <div className="hidden border-r border-[#061A2B]/10 py-10 lg:flex lg:items-start lg:justify-start">
                    <span className="font-mono text-xs font-bold tracking-[0.18em] text-slate-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Service image */}
                  <div className="relative mt-5 aspect-[16/10] overflow-hidden bg-[#08263D] sm:mt-7 lg:my-7 lg:mr-6 lg:mt-7 lg:aspect-auto xl:mr-8">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={
                          service.heroImage?.alt || service.title
                        }
                        fill
                        sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 64px), (max-width: 1279px) 260px, 300px"
                        className="object-cover transition-transform duration-700 ease-out motion-reduce:transition-none group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full min-h-[190px] items-center justify-center bg-gradient-to-br from-[#08263D] to-[#061A2B]">
                        <ServiceIcon
                          aria-hidden="true"
                          className="h-12 w-12 text-[#FFD400]"
                          strokeWidth={1.4}
                        />
                      </div>
                    )}

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#061A2B]/60 via-transparent to-transparent opacity-70"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center bg-[#FFD400] text-[#061A2B]"
                    >
                      <ServiceIcon
                        className="h-5 w-5"
                        strokeWidth={2}
                      />
                    </div>
                  </div>

                  {/* Service information */}
                  <div className="flex min-w-0 flex-col justify-center py-7 sm:py-8 lg:py-10 lg:pr-7 xl:pr-10">
                    <div className="mb-3 flex items-center gap-3 lg:hidden">
                      <span className="font-mono text-xs font-bold tracking-[0.18em] text-slate-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        aria-hidden="true"
                        className="h-px w-8 bg-[#FFD400]"
                      />
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0D6E91]">
                          Automotive Service
                        </p>

                        <h3 className="max-w-xl text-2xl font-black tracking-[-0.035em] sm:text-3xl lg:text-3xl xl:text-4xl">
                          {service.title}
                        </h3>
                      </div>

                      <span
                        aria-hidden="true"
                        className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#061A2B]/15 transition-colors duration-300 group-hover:border-[#FFD400] group-hover:bg-[#FFD400] sm:h-11 sm:w-11"
                      >
                        <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
                      </span>
                    </div>

                    <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-5 sm:text-base sm:leading-7">
                      {service.shortDescription}
                    </p>

                    {/* Service attributes */}
                    <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
                      {service.onSiteService && (
                        <span className="inline-flex items-center gap-2 border border-[#061A2B]/10 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#061A2B]">
                          <MapPin
                            aria-hidden="true"
                            className="h-3.5 w-3.5 text-[#0D6E91]"
                          />
                          On-Site Service
                        </span>
                      )}

                      {service.emergencyService && (
                        <span className="inline-flex items-center gap-2 border border-[#FFD400]/50 bg-[#FFD400]/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#061A2B]">
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
                  <div className="flex min-w-0 flex-col justify-between border-t border-[#061A2B]/10 py-6 sm:py-7 lg:border-l lg:border-t-0 lg:py-10 lg:pl-6 xl:pl-8">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        Service Details
                      </p>

                      {service.estimatedTime ? (
                        <div className="mt-4 flex items-start gap-3 text-sm font-semibold text-[#061A2B]">
                          <Clock3
                            aria-hidden="true"
                            className="mt-0.5 h-4 w-4 shrink-0 text-[#0D6E91]"
                          />

                          <span>{service.estimatedTime}</span>
                        </div>
                      ) : (
                        <p className="mt-4 text-sm leading-6 text-slate-500">
                          Contact us to discuss your requirements.
                        </p>
                      )}
                    </div>

                    <div className="mt-7 flex items-center justify-between gap-3">
                      <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#061A2B]">
                        {service.ctaText || "Explore Service"}
                      </span>

                      <span
                        aria-hidden="true"
                        className="h-px w-10 shrink-0 bg-[#FFD400] transition-all duration-300 group-hover:w-16 sm:w-12 sm:group-hover:w-20"
                      />
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {/* All services navigation */}
        <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
          <p className="max-w-xl text-sm leading-6 text-slate-500">
            Not sure which service you need? Contact our team to
            discuss your vehicle and explore the available options.
          </p>

          <Link
            href="/services"
            className="group inline-flex w-fit shrink-0 items-center gap-3 text-sm font-bold text-[#061A2B] outline-none focus-visible:ring-2 focus-visible:ring-[#0D6E91]"
          >
            <span className="border-b-2 border-[#FFD400] pb-1">
              Explore All Services
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
