import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BatteryCharging } from "lucide-react";

export interface RelatedFAQService {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  heroImage: {
    secureUrl: string;
    alt: string;
  } | null;
}

interface RelatedFAQServicesProps {
  services: RelatedFAQService[];
}

export default function RelatedFAQServices({
  services,
}: RelatedFAQServicesProps) {
  if (services.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[#0D6E91]/[0.035] blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="mb-10 max-w-2xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-9 bg-[#0D6E91]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0D6E91]">
              Related services
            </span>
          </div>

          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#061A2B] sm:text-4xl">
            Need help beyond
            <span className="text-[#061A2B]/30">
              {" "}
              the answer?
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#061A2B]/45 sm:text-base">
            Explore the services connected to these
            frequently asked questions.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group overflow-hidden rounded-[1.5rem] border border-[#061A2B]/[0.08] bg-white shadow-[0_12px_40px_rgba(6,26,43,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#0D6E91]/20 hover:shadow-[0_20px_55px_rgba(6,26,43,0.08)]"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[#061A2B]">
                {service.heroImage?.secureUrl ? (
                  <Image
                    src={service.heroImage.secureUrl}
                    alt={
                      service.heroImage.alt ||
                      service.title
                    }
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[#061A2B] text-[#FFD400]">
                    <BatteryCharging
                      size={38}
                      strokeWidth={1.5}
                    />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#061A2B]/75 via-transparent to-transparent" />

                <span className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-[#061A2B]/60 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                  Service
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold tracking-[-0.025em] text-[#061A2B]">
                    {service.title}
                  </h3>

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#061A2B]/[0.05] text-[#061A2B]/45 transition group-hover:bg-[#FFD400] group-hover:text-[#061A2B]">
                    <ArrowUpRight size={15} />
                  </span>
                </div>

                {service.shortDescription ? (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#061A2B]/45">
                    {service.shortDescription}
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}