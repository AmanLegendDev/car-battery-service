import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  Clock3,
  MapPin,
  Zap,
} from "lucide-react";

interface ContactService {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  estimatedTime: string;
  emergencyService: boolean;
  onSiteService: boolean;
}

interface ContactServicesProps {
  services: ContactService[];
}

export default function ContactServices({
  services,
}: ContactServicesProps) {
  if (services.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] px-5 pb-20 sm:px-6 lg:px-8 lg:pb-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-6 border-t border-[#08263D]/10 pt-16 sm:pt-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0D6E91]">
              Available Services
            </span>

            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#061A2B] sm:text-4xl lg:text-5xl">
              Battery assistance for
              the problem you are facing.
            </h2>

            <p className="mt-5 text-base leading-8 text-[#5F7482]">
              Explore the available battery services and
              choose the one that matches your situation.
            </p>
          </div>

          <Link
            href="/services"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#061A2B]"
          >
            View all services

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Services */}
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group relative overflow-hidden rounded-[1.75rem] border border-[#08263D]/10 bg-white p-6 shadow-[0_12px_40px_rgba(6,26,43,0.035)] transition duration-300 hover:-translate-y-1 hover:border-[#0D6E91]/20 hover:shadow-[0_20px_55px_rgba(6,26,43,0.08)] sm:p-7"
            >
              {/* Index */}
              <div className="absolute right-6 top-6 text-[11px] font-bold tracking-[0.15em] text-[#A8BBC8]">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#061A2B] text-[#FFD400] transition duration-300 group-hover:bg-[#FFD400] group-hover:text-[#061A2B]">
                <BatteryCharging size={22} />
              </div>

              {/* Content */}
              <div className="mt-7 pr-8">
                <h3 className="text-xl font-semibold tracking-[-0.025em] text-[#061A2B]">
                  {service.title}
                </h3>

                {service.shortDescription ? (
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#5F7482]">
                    {service.shortDescription}
                  </p>
                ) : null}
              </div>

              {/* Meta */}
              <div className="mt-7 flex flex-wrap gap-2">
                {service.estimatedTime ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8FAFC] px-3 py-1.5 text-[11px] font-semibold text-[#5F7482]">
                    <Clock3 size={13} />
                    {service.estimatedTime}
                  </span>
                ) : null}

                {service.onSiteService ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8FAFC] px-3 py-1.5 text-[11px] font-semibold text-[#5F7482]">
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

              {/* Bottom */}
              <div className="mt-7 flex items-center justify-between border-t border-[#08263D]/10 pt-5">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#A8BBC8]">
                  View service
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#061A2B]/[0.04] text-[#061A2B] transition duration-300 group-hover:bg-[#061A2B] group-hover:text-[#FFD400]">
                  <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}