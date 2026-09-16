import Link from "next/link";
import {
  ArrowUpRight,
  Phone,
  MapPin,
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
    businessName: settings?.businessName || "Car Battery Service",
    region: settings?.primaryServiceRegion || "",
    phone:
      settings?.primaryCallNumber ||
      settings?.phone ||
      "",
    bookingCta:
      settings?.bookingCta ||
      "Book a Battery Service",
    quoteCta:
      settings?.quoteCta ||
      "Request a Quote",
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

  return (
    <section className="relative overflow-hidden bg-[#08263D] text-[#F8FAFC]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full bg-[#0D6E91]/15 blur-[130px]" />

        <div className="absolute bottom-[-220px] right-[-120px] h-[550px] w-[550px] rounded-full bg-[#FFD400]/[0.045] blur-[130px]" />

        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="relative mx-auto max-w-[1420px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-20">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                Need This Service?
              </span>
            </div>

            <h2 className="mt-7 max-w-4xl text-[clamp(3rem,7vw,6.8rem)] font-semibold leading-[0.9] tracking-[-0.065em]">
              Let&apos;s get your{" "}
              <span className="text-[#FFD400]">
                {serviceTitle.toLowerCase()}
              </span>{" "}
              sorted.
            </h2>

            <p className="mt-8 max-w-xl text-sm leading-7 text-white/45 sm:text-base">
              Contact Car Battery Service to discuss your vehicle and the
              service you need.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/40">
              {settings.region ? (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[#FFD400]" />
                  {settings.region}
                </span>
              ) : null}

              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />
                {settings.businessName}
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 lg:w-[280px]">
            <Link
              href="/book-service"
              className="group flex min-h-14 items-center justify-between rounded-full bg-[#FFD400] px-5 text-sm font-bold text-[#061A2B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F5B800] hover:shadow-[0_16px_40px_rgba(255,212,0,0.14)]"
            >
              <span>
                {ctaText?.trim() || settings.bookingCta}
              </span>

              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#061A2B] text-[#FFD400] transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight
                  className="h-4 w-4"
                  strokeWidth={2}
                />
              </span>
            </Link>

            {settings.phone ? (
              <a
                href={phoneHref(settings.phone)}
                className="flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.035] px-5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/[0.2] hover:bg-white/[0.07]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
                  <Phone
                    className="h-4 w-4"
                    strokeWidth={2}
                  />
                </span>

                <span>Call {settings.phone}</span>
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-16 border-t border-white/[0.1] pt-6 sm:mt-20">
          <div className="flex flex-col gap-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25 sm:flex-row sm:items-center sm:justify-between">
            <span>Service enquiry</span>

            <span className="hidden h-px flex-1 bg-white/[0.08] sm:mx-8 sm:block" />

            <span>Car Battery Service</span>
          </div>
        </div>
      </div>
    </section>
  );
}