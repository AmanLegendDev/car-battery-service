
import Link from "next/link";
import {
  ArrowUpRight,
  Phone,
  MapPin,
  Wrench,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

interface ServiceFinalCTAProps {
  serviceTitle: string;
  ctaText?: string;
}

async function getCTASettings() {
  await connectDB();

  const settings = await SiteSettings.findOne()
    .select(
      "businessName primaryServiceRegion phone primaryCallNumber bookingCta quoteCta",
    )
    .lean();

  return {
    businessName: settings?.businessName || "Rapid Auto Services",
    region: settings?.primaryServiceRegion || "",
    phone: settings?.primaryCallNumber || settings?.phone || "",
    bookingCta: settings?.bookingCta || "Book a Service",
    quoteCta: settings?.quoteCta || "Request a Quote",
  };
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export default async function ServiceFinalCTA({
  serviceTitle,
  ctaText,
}: ServiceFinalCTAProps) {
  const settings = await getCTASettings();

  const primaryCta = ctaText?.trim() || settings.bookingCta;

  const cleanServiceTitle = serviceTitle.trim();

  return (
    <section
      aria-labelledby="service-final-cta-title"
      className="relative isolate overflow-hidden bg-[#08263D] text-[#F8FAFC]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full bg-[#0D6E91]/15 blur-[130px]" />

        <div className="absolute bottom-[-220px] right-[-120px] h-[550px] w-[550px] rounded-full bg-[#FFD400]/[0.045] blur-[130px]" />

        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="relative mx-auto max-w-[1420px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end lg:gap-16">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/45">
                Need This Service?
              </span>
            </div>

            <h2
              id="service-final-cta-title"
              className="mt-7 max-w-5xl break-words text-[clamp(2.75rem,6.5vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.065em]"
            >
              Let&apos;s get your{" "}
              <span className="text-[#FFD400]">
                {cleanServiceTitle.toLowerCase()}
              </span>{" "}
              sorted.
            </h2>

            <p className="mt-7 max-w-2xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
              Need help with your vehicle? Contact{" "}
              {settings.businessName} to discuss your requirements, understand
              the next steps, and arrange the service that suits your needs.
            </p>

            {(settings.region || settings.businessName) && (
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/55">
                {settings.region && (
                  <span className="inline-flex items-center gap-2">
                    <MapPin
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-[#FFD400]"
                    />
                    {settings.region}
                  </span>
                )}

                <span className="inline-flex items-center gap-2">
                  <Wrench
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-[#FFD400]"
                  />
                  {settings.businessName}
                </span>
              </div>
            )}
          </div>

          <div className="flex w-full flex-col gap-3 lg:w-[300px]">
            <Link
              href="/book-service"
              className="group flex min-h-14 items-center justify-between gap-3 rounded-full bg-[#FFD400] px-5 text-sm font-bold text-[#061A2B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F5B800] hover:shadow-[0_16px_40px_rgba(255,212,0,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-4 focus-visible:ring-offset-[#08263D]"
            >
              <span>{primaryCta}</span>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#061A2B] text-[#FFD400] transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4"
                  strokeWidth={2}
                />
              </span>
            </Link>

            {settings.phone && (
              <a
                href={phoneHref(settings.phone)}
                className="flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/[0.14] bg-white/[0.035] px-5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/25 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-4 focus-visible:ring-offset-[#08263D]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
                  <Phone
                    aria-hidden="true"
                    className="h-4 w-4"
                    strokeWidth={2}
                  />
                </span>

                <span>Call {settings.phone}</span>
              </a>
            )}

            <p className="px-3 text-center text-[11px] leading-5 text-white/40">
              Have questions? Get in touch to discuss your service needs.
            </p>
          </div>
        </div>

        <div className="mt-14 border-t border-white/[0.1] pt-6 sm:mt-20">
          <div className="flex flex-col gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
            <span>Vehicle service enquiries</span>

            <span>{settings.businessName}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
