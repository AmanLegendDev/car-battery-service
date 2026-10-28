
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarCheck,
  CarFront,
  ClipboardCheck,
  MapPin,
  MessageCircle,
  Phone,
  Wrench,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

interface SiteSettingsData {
  businessName: string;
  primaryServiceRegion: string;
  phone: string;
  primaryCallNumber: string;
  bookingCta: string;
  quoteCta: string;
}

async function getSiteSettings(): Promise<SiteSettingsData> {
  await connectDB();

  const settings = await SiteSettings.findOne()
    .select(
      "businessName primaryServiceRegion phone primaryCallNumber bookingCta quoteCta"
    )
    .lean();

  return {
    businessName: settings?.businessName || "Mobile Car Services",
    primaryServiceRegion:
      settings?.primaryServiceRegion || "Melbourne West, Victoria",
    phone: settings?.phone || "+61 467 037 886",
    primaryCallNumber:
      settings?.primaryCallNumber ||
      settings?.phone ||
      "+61 467 037 886",
    bookingCta: settings?.bookingCta || "Book a Service",
    quoteCta: settings?.quoteCta || "Request a Quote",
  };
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export default async function RequestAssistance() {
  const settings = await getSiteSettings();

  const callHref = phoneHref(settings.primaryCallNumber);

  return (
    <section
      aria-labelledby="request-assistance-heading"
      className="relative isolate overflow-hidden bg-[#F8FAFC] text-[#061A2B]"
    >
      {/* Decorative technical grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(#061A2B 1px, transparent 1px), linear-gradient(90deg, #061A2B 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Ambient brand atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[#08263D] opacity-[0.055] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
          {/* Left: Editorial message */}
          <div>
            <div className="mb-7 flex items-center gap-4">
              <span
                aria-hidden="true"
                className="h-px w-10 bg-[#FFD400]"
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#0D6E91]">
                Mobile Automotive Assistance
              </span>
            </div>

            <h2
              id="request-assistance-heading"
              className="max-w-3xl text-[clamp(2.8rem,6vw,5.8rem)] font-semibold leading-[0.94] tracking-[-0.055em]"
            >
              Let&apos;s get your
              <span className="block text-[#0D6E91]">
                vehicle sorted.
              </span>
            </h2>

            <p className="mt-7 max-w-xl text-base leading-7 text-[#526675] sm:text-lg sm:leading-8">
              Need help with your vehicle? Tell us what is happening
              and where you are located. Our team can discuss your
              automotive needs, available services and the next steps
              for arranging assistance.
            </p>

            {/* Service context */}
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-[#061A2B]/10 pt-6">
              <div className="flex items-center gap-2.5">
                <MapPin
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-[#0D6E91]"
                />

                <span className="text-sm font-medium text-[#08263D]">
                  {settings.primaryServiceRegion}
                </span>
              </div>

              {settings.primaryCallNumber && (
                <a
                  href={callHref}
                  aria-label={`Call ${settings.businessName} on ${settings.phone}`}
                  className="group flex items-center gap-2.5 text-sm font-medium text-[#08263D] transition-colors hover:text-[#0D6E91] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D6E91]"
                >
                  <Phone
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-[#0D6E91]"
                  />

                  <span>{settings.phone}</span>
                </a>
              )}
            </div>

            {/* Service highlights */}
            <div className="mt-8 grid gap-4 border-t border-[#061A2B]/10 pt-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#0D6E91]/15 bg-white">
                  <CarFront
                    aria-hidden="true"
                    className="h-5 w-5 text-[#0D6E91]"
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#061A2B]">
                    Vehicle-focused assistance
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#526675]">
                    Tell us about your vehicle and the issue you are
                    experiencing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#0D6E91]/15 bg-white">
                  <ClipboardCheck
                    aria-hidden="true"
                    className="h-5 w-5 text-[#0D6E91]"
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#061A2B]">
                    Clear next steps
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#526675]">
                    Discuss suitable services and confirm availability
                    before proceeding.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Conversion panel */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#061A2B] p-7 shadow-[0_30px_80px_rgba(6,26,43,0.18)] sm:p-9 lg:p-10">
              {/* Yellow brand accent */}
              <div
                aria-hidden="true"
                className="absolute left-0 right-0 top-0 h-1 bg-[#FFD400]"
              />

              <div className="mb-12 flex items-start justify-between">
                <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#A8BBC8]">
                  <Wrench
                    aria-hidden="true"
                    className="h-4 w-4 text-[#FFD400]"
                  />
                  Start Here
                </span>

                <span className="font-mono text-xs text-[#A8BBC8]/60">
                  01 / 02
                </span>
              </div>

              <h3 className="max-w-md text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#F8FAFC] sm:text-4xl">
                How can we help with your vehicle?
              </h3>

              <p className="mt-5 max-w-md text-sm leading-6 text-[#A8BBC8] sm:text-base">
                Book a service or speak with our team about your
                vehicle, location and the assistance you are looking for.
              </p>

              {/* Primary booking action */}
              <Link
                href="/book-service"
                className="group mt-9 flex min-h-16 items-center justify-between gap-4 rounded-2xl bg-[#FFD400] px-5 py-4 text-[#061A2B] transition-colors duration-300 hover:bg-[#F5B800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061A2B] sm:px-6"
              >
                <span>
                  <span className="block text-sm font-bold">
                    {settings.bookingCta}
                  </span>

                  <span className="mt-0.5 block text-xs font-medium opacity-70">
                    Tell us what your vehicle needs
                  </span>
                </span>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#061A2B] text-[#FFD400] transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-5 w-5"
                  />
                </span>
              </Link>

              {/* Secondary actions */}
              <div
                className={`mt-3 grid gap-3 ${
                  settings.primaryCallNumber
                    ? "grid-cols-2"
                    : "grid-cols-1"
                }`}
              >
                {settings.primaryCallNumber && (
                  <a
                    href={callHref}
                    aria-label={`Call ${settings.businessName} on ${settings.phone}`}
                    className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 text-sm font-semibold text-[#F8FAFC] transition-colors hover:border-[#FFD400]/40 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
                  >
                    <Phone
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-[#FFD400]"
                    />
                    Call Now
                  </a>
                )}

                <Link
                  href="/contact"
                  className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 text-sm font-semibold text-[#F8FAFC] transition-colors hover:border-[#FFD400]/40 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
                >
                  <MessageCircle
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-[#FFD400]"
                  />
                  Contact Us
                </Link>
              </div>

              {/* Quote CTA */}
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#A8BBC8] transition-colors hover:text-[#FFD400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
              >
                {settings.quoteCta}
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                />
              </Link>

              {/* Bottom details */}
              <div className="mt-7 border-t border-white/10 pt-5">
                <p className="text-xs leading-5 text-[#A8BBC8]">
                  {settings.businessName} · Mobile automotive assistance ·{" "}
                  {settings.primaryServiceRegion}
                </p>
              </div>
            </div>

            {/* Decorative index */}
            <div
              aria-hidden="true"
              className="absolute -bottom-5 -left-4 hidden h-12 w-12 items-center justify-center rounded-full border border-[#061A2B]/10 bg-[#F8FAFC] font-mono text-[10px] font-bold text-[#0D6E91] shadow-lg sm:flex"
            >
              06
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
