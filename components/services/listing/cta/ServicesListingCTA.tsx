import Link from "next/link";
import {
  ArrowUpRight,
  Phone,
  MessageCircle,
  MapPin,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

interface ServicesListingCTAProps {
  serviceCount: number;
}

async function getCTASettings() {
  await connectDB();

  const settings = await SiteSettings.findOne()
    .select(
      [
        "businessName",
        "tagline",
        "phone",
        "primaryCallNumber",
        "whatsapp",
        "primaryServiceRegion",
        "bookingCta",
        "quoteCta",
      ].join(" "),
    )
    .lean();

  return {
    businessName:
      settings?.businessName || "Car Battery Service",

    tagline:
      settings?.tagline || "",

    phone:
      settings?.primaryCallNumber ||
      settings?.phone ||
      "",

    whatsapp:
      settings?.whatsapp || "",

    region:
      settings?.primaryServiceRegion || "",

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

function whatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  return `https://wa.me/${digits}`;
}

export default async function ServicesListingCTA({
  serviceCount,
}: ServicesListingCTAProps) {
  const settings = await getCTASettings();

  return (
    <section className="relative isolate overflow-hidden bg-[#061A2B] text-[#F8FAFC]">
      {/* Ambient atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-[-180px] top-[-180px] h-[520px] w-[520px] rounded-full bg-[#0D6E91]/12 blur-[140px]" />

        <div className="absolute bottom-[-220px] right-[-160px] h-[560px] w-[560px] rounded-full bg-[#FFD400]/[0.035] blur-[140px]" />

        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="relative mx-auto max-w-[1420px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        {/* Top line */}
        <div className="flex items-center justify-between gap-6 border-b border-white/[0.1] pb-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#FFD400]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
              Need Help?
            </span>
          </div>

          <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 sm:block">
            {String(serviceCount).padStart(2, "0")} SERVICES
          </span>
        </div>

        {/* Main CTA */}
        <div className="grid gap-14 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end lg:gap-20 lg:py-20">
          <div>
            <p className="text-sm font-medium text-[#FFD400]">
              Not sure which service you need?
            </p>

            <h2 className="mt-5 max-w-5xl text-[clamp(3.2rem,7.5vw,7rem)] font-semibold leading-[0.88] tracking-[-0.065em]">
              Tell us what&apos;s
              <br />
              happening.
            </h2>

            <p className="mt-8 max-w-xl text-sm leading-7 text-white/45 sm:text-base">
              Share your vehicle details and the situation you&apos;re dealing
              with. We can discuss the available service options with you.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {settings.region ? (
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                  <MapPin className="h-3.5 w-3.5 text-[#FFD400]" />
                  {settings.region}
                </span>
              ) : null}

              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />
                {settings.businessName}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full lg:ml-auto">
            <div className="flex flex-col gap-3">
              <Link
                href="/book-service"
                className="group flex min-h-14 items-center justify-between rounded-full bg-[#FFD400] px-5 text-sm font-bold text-[#061A2B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F5B800] hover:shadow-[0_18px_45px_rgba(255,212,0,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061A2B]"
              >
                <span>{settings.bookingCta}</span>

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
                  className="group flex min-h-14 items-center justify-between rounded-full border border-white/[0.12] bg-white/[0.035] px-5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.2] hover:bg-white/[0.07]"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
                      <Phone
                        className="h-4 w-4"
                        strokeWidth={2}
                      />
                    </span>

                    <span>Call {settings.phone}</span>
                  </span>

                  <ArrowUpRight
                    className="h-4 w-4 text-white/30 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.8}
                  />
                </a>
              ) : null}

              {settings.whatsapp ? (
                <a
                  href={whatsappHref(settings.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-14 items-center justify-between rounded-full border border-white/[0.08] px-5 text-sm font-semibold text-white/70 transition-all duration-300 hover:border-white/[0.16] hover:bg-white/[0.035]"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.1]">
                      <MessageCircle
                        className="h-4 w-4 text-[#FFD400]"
                        strokeWidth={1.8}
                      />
                    </span>

                    <span>WhatsApp</span>
                  </span>

                  <ArrowUpRight
                    className="h-4 w-4 text-white/25 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.8}
                  />
                </a>
              ) : null}
            </div>

            <p className="mt-5 text-center text-[10px] leading-5 text-white/25">
              Contact details and availability are based on the information
              provided by the business.
            </p>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-white/[0.1] pt-6">
          <div className="flex flex-col gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/20 sm:flex-row sm:items-center sm:justify-between">
            <span>{settings.businessName}</span>

            {settings.tagline ? (
              <span className="max-w-md sm:text-right">
                {settings.tagline}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}