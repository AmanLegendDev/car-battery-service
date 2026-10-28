
import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  Phone,
  MoveUpRight,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

interface FinalCTASettings {
  businessName: string;
  primaryServiceRegion: string;
  phone: string;
  primaryCallNumber: string;
  bookingCta: string;
}

async function getFinalCTASettings(): Promise<FinalCTASettings> {
  await connectDB();

  const settings = await SiteSettings.findOne()
    .select(
      "businessName primaryServiceRegion phone primaryCallNumber bookingCta",
    )
    .lean();

  return {
    businessName:
      settings?.businessName || "Mobile Car Services",
    primaryServiceRegion:
      settings?.primaryServiceRegion || "Melbourne West",
    phone: settings?.phone || "",
    primaryCallNumber:
      settings?.primaryCallNumber || settings?.phone || "",
    bookingCta: settings?.bookingCta || "Book a Service",
  };
}

function phoneHref(phone: string) {
  const normalizedPhone = phone.replace(/[^\d+]/g, "");
  return normalizedPhone ? `tel:${normalizedPhone}` : undefined;
}

export default async function FinalCTA() {
  let settings: FinalCTASettings = {
    businessName: "Mobile Car Services",
    primaryServiceRegion: "Melbourne West",
    phone: "",
    primaryCallNumber: "",
    bookingCta: "Book a Service",
  };

  try {
    settings = await getFinalCTASettings();
  } catch (error) {
    console.error("Failed to load final CTA settings:", error);
  }

  const callHref = phoneHref(
    settings.primaryCallNumber || settings.phone,
  );

  return (
    <section
      aria-labelledby="final-cta-heading"
      className="relative isolate overflow-hidden bg-[#061A2B] text-[#F8FAFC]"
    >
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#F8FAFC 1px, transparent 1px), linear-gradient(90deg, #F8FAFC 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Decorative background word */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[clamp(8rem,24vw,26rem)] font-black leading-none tracking-[-0.09em] text-white/[0.018]"
      >
        DRIVE
      </div>

      {/* Ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0D6E91]/[0.07] blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        {/* Section label */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="h-px w-10 bg-[#FFD400]"
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A8BBC8]">
              Your Next Step Starts Here
            </span>
          </div>

          <span className="hidden max-w-[45%] truncate font-mono text-[9px] tracking-[0.2em] text-[#A8BBC8]/50 sm:block">
            {settings.businessName.toUpperCase()}
          </span>
        </div>

        {/* Main CTA */}
        <div className="relative py-16 sm:py-20 lg:py-24">
          <div className="max-w-5xl">
            <h2
              id="final-cta-heading"
              className="text-[clamp(3.2rem,8vw,8rem)] font-semibold leading-[0.9] tracking-[-0.07em]"
            >
              Need help with
              <span className="block text-[#FFD400]">
                your vehicle?
              </span>
            </h2>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <p className="max-w-xl text-base leading-7 text-[#A8BBC8] sm:text-lg sm:leading-8">
              Tell us what is happening with your vehicle and where
              you are. Our team can discuss your needs and help you
              understand the next steps based on the services available.
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link
                href="/book-service"
                className="group inline-flex min-h-14 items-center justify-between gap-7 rounded-full bg-[#FFD400] px-5 py-2.5 text-sm font-bold text-[#061A2B] transition-colors duration-300 hover:bg-[#F5B800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F8FAFC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061A2B] sm:min-w-[235px]"
              >
                <span>{settings.bookingCta}</span>

                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#061A2B] text-[#FFD400] transition-transform duration-300 motion-safe:group-hover:rotate-45"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>

              {callHref && (
                <a
                  href={callHref}
                  className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-[#F8FAFC] transition-colors duration-300 hover:border-[#FFD400]/50 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061A2B]"
                >
                  <Phone
                    aria-hidden="true"
                    className="h-4 w-4 text-[#FFD400]"
                  />
                  Call Our Team
                  <MoveUpRight
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-[#A8BBC8] transition-transform duration-300 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                  />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Three-step process */}
        <div className="border-y border-white/10">
          <div className="grid sm:grid-cols-3">
            <div className="border-b border-white/10 px-0 py-6 sm:border-b-0 sm:border-r sm:px-7 sm:py-7 lg:px-9">
              <span className="font-mono text-[9px] tracking-[0.2em] text-[#FFD400]">
                01
              </span>

              <p className="mt-3 text-sm font-semibold text-[#F8FAFC]">
                Tell us what&apos;s happening
              </p>

              <p className="mt-1.5 text-xs leading-5 text-[#A8BBC8]">
                Share your vehicle details and describe the issue.
              </p>
            </div>

            <div className="border-b border-white/10 px-0 py-6 sm:border-b-0 sm:border-r sm:px-7 sm:py-7 lg:px-9">
              <span className="font-mono text-[9px] tracking-[0.2em] text-[#FFD400]">
                02
              </span>

              <p className="mt-3 text-sm font-semibold text-[#F8FAFC]">
                Discuss your options
              </p>

              <p className="mt-1.5 text-xs leading-5 text-[#A8BBC8]">
                Review the relevant services and confirm availability.
              </p>
            </div>

            <div className="px-0 py-6 sm:px-7 sm:py-7 lg:px-9">
              <span className="font-mono text-[9px] tracking-[0.2em] text-[#FFD400]">
                03
              </span>

              <p className="mt-3 text-sm font-semibold text-[#F8FAFC]">
                Plan the next step
              </p>

              <p className="mt-1.5 text-xs leading-5 text-[#A8BBC8]">
                Arrange the next step once the details are confirmed.
              </p>
            </div>
          </div>
        </div>

        {/* Location and contact details */}
        <div className="flex flex-col gap-5 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-7 gap-y-3">
            {settings.primaryServiceRegion && (
              <div className="flex items-center gap-2.5">
                <MapPin
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-[#FFD400]"
                />

                <span className="text-xs font-medium text-[#A8BBC8]">
                  {settings.primaryServiceRegion}
                </span>
              </div>
            )}

            {settings.phone && (
              <a
                href={phoneHref(
                  settings.primaryCallNumber || settings.phone,
                )}
                className="flex items-center gap-2.5 text-xs font-medium text-[#A8BBC8] transition-colors hover:text-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-4 focus-visible:ring-offset-[#061A2B]"
              >
                <Phone
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-[#FFD400]"
                />

                <span>{settings.phone}</span>
              </a>
            )}
          </div>

          <span className="font-mono text-[9px] tracking-[0.16em] text-[#A8BBC8]/45">
            {settings.businessName}
          </span>
        </div>
      </div>
    </section>
  );
}
