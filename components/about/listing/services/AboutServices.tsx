import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  Clock3,
  MapPin,
  Zap,
} from "lucide-react";

export interface AboutService {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  estimatedTime: string;
  emergencyService: boolean;
  onSiteService: boolean;
}

interface AboutServicesProps {
  services: AboutService[];
}

export default function AboutServices({
  services,
}: AboutServicesProps) {
  if (services.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-white px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          {/* Intro */}
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0D6E91]">
              What We Do
            </span>

            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#061A2B] sm:text-4xl">
              Focused services for common battery problems.
            </h2>

            <p className="mt-5 text-base leading-8 text-[#5F7482]">
              Explore the battery services currently available
              through the business.
            </p>

            <Link
              href="/services"
              className="group mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#061A2B]"
            >
              Explore all services

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Service list */}
          <div className="grid gap-4">
            {services.map((service, index) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group relative overflow-hidden rounded-[1.75rem] border border-[#08263D]/10 bg-[#F8FAFC] p-6 transition duration-300 hover:-translate-y-0.5 hover:border-[#0D6E91]/20 hover:bg-white hover:shadow-[0_18px_50px_rgba(6,26,43,0.07)] sm:p-7"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#061A2B] text-[#FFD400] transition duration-300 group-hover:bg-[#FFD400] group-hover:text-[#061A2B]">
                      <BatteryCharging size={21} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold tracking-[0.16em] text-[#A8BBC8]">
                          {String(index + 1).padStart(
                            2,
                            "0",
                          )}
                        </span>

                        <h3 className="text-xl font-semibold tracking-[-0.025em] text-[#061A2B]">
                          {service.title}
                        </h3>
                      </div>

                      {service.shortDescription ? (
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5F7482]">
                          {service.shortDescription}
                        </p>
                      ) : null}

                      <div className="mt-5 flex flex-wrap gap-2">
                        {service.estimatedTime ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#08263D]/10 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#5F7482]">
                            <Clock3 size={13} />
                            {service.estimatedTime}
                          </span>
                        ) : null}

                        {service.onSiteService ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#08263D]/10 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#5F7482]">
                            <MapPin size={13} />
                            On-site
                          </span>
                        ) : null}

                        {service.emergencyService ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF7CC] px-3 py-1.5 text-[11px] font-semibold text-[#705D00]">
                            <Zap size={13} />
                            Emergency service
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#061A2B]/[0.04] text-[#061A2B] transition duration-300 group-hover:bg-[#061A2B] group-hover:text-[#FFD400]">
                    <ArrowRight size={16} />
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