

import Link from "next/link";
import ServiceListItem from "./ServiceListItem";

interface ServicesDirectoryProps {
  services: {
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
  }[];
}

export default function ServicesDirectory({
  services,
}: ServicesDirectoryProps) {
  return (
    <section
      id="available-services"
      aria-labelledby="services-directory-heading"
      className="relative overflow-hidden bg-[#F8FAFC] text-[#061A2B]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-180px] top-20 h-[400px] w-[400px] rounded-full bg-[#0D6E91]/[0.06] blur-[120px]"
      />

      <div className="relative mx-auto max-w-[1420px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        {/* Section heading */}
        <div className="grid gap-7 border-b border-[#061A2B]/10 pb-9 sm:pb-11 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.65fr)] lg:items-end lg:gap-12">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#061A2B]/50">
                Explore Our Services
              </span>
            </div>

            <h2
              id="services-directory-heading"
              className="mt-6 max-w-4xl text-4xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-5xl lg:text-6xl"
            >
              Choose the right service for your vehicle.
            </h2>
          </div>

          <div className="lg:ml-auto lg:max-w-md">
            <p className="text-sm leading-7 text-[#061A2B]/65 sm:text-base sm:leading-8">
              Explore our automotive services, compare the available options,
              and find the support that best suits your vehicle&apos;s needs.
            </p>

            <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-[#061A2B]/10 bg-white px-4 py-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-[#061A2B]"
                />
              </span>

              <span className="text-xs font-bold text-[#061A2B]/75">
                {services.length}{" "}
                {services.length === 1 ? "service" : "services"} listed
              </span>
            </div>
          </div>
        </div>

        {/* Service directory */}
        {services.length > 0 ? (
          <div className="mt-2">
            {services.map((service, index) => (
              <ServiceListItem
                key={service.id}
                service={service}
                index={index}
              />
            ))}

            <div className="border-t border-[#061A2B]/10" />
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-[#061A2B]/10 bg-white px-6 py-12 text-center sm:px-10">
            <h3 className="text-xl font-semibold tracking-tight">
              Services are being updated.
            </h3>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#061A2B]/60">
              Please contact our team to discuss your vehicle and find out
              which services may be available for your needs.
            </p>

            <Link
              href="/contact"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#FFD400] px-6 text-sm font-bold text-[#061A2B] transition-colors hover:bg-[#F5B800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D6E91] focus-visible:ring-offset-2"
            >
              Contact Us
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
