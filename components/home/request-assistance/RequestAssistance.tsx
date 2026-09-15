import Link from "next/link";
import { ArrowUpRight, Phone, MapPin, MessageCircle } from "lucide-react";
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
      "businessName primaryServiceRegion phone primaryCallNumber bookingCta quoteCta",
    )
    .lean();

  return {
    businessName: settings?.businessName || "Car Battery Service",
    primaryServiceRegion:
      settings?.primaryServiceRegion || "Melbourne West",
    phone: settings?.phone || "",
    primaryCallNumber: settings?.primaryCallNumber || settings?.phone || "",
    bookingCta: settings?.bookingCta || "Request a Service",
    quoteCta: settings?.quoteCta || "Request a Quote",
  };
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export default async function RequestAssistance() {
  const settings = await getSiteSettings();

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] text-[#061A2B]">
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

      {/* Ambient navy shape */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[#08263D] opacity-[0.055] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
          {/* LEFT — Editorial message */}
          <div>
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#0D6E91]">
                Need Assistance?
              </span>
            </div>

            <h2 className="max-w-3xl text-[clamp(2.8rem,6vw,5.8rem)] font-semibold leading-[0.94] tracking-[-0.055em]">
              Let&apos;s get your
              <span className="block text-[#0D6E91]">
                vehicle moving.
              </span>
            </h2>

            <p className="mt-7 max-w-xl text-base leading-7 text-[#526675] sm:text-lg sm:leading-8">
              Tell us what is happening with your vehicle and request the
              battery assistance you need at your location.
            </p>

            {/* Service context */}
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-[#061A2B]/10 pt-6">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-[#0D6E91]" />
                <span className="text-sm font-medium text-[#08263D]">
                  {settings.primaryServiceRegion}
                </span>
              </div>

              {settings.primaryCallNumber && (
                <a
                  href={phoneHref(settings.primaryCallNumber)}
                  className="group flex items-center gap-2.5 text-sm font-medium text-[#08263D] transition-colors hover:text-[#0D6E91]"
                >
                  <Phone className="h-4 w-4 text-[#0D6E91]" />
                  <span>{settings.phone}</span>
                </a>
              )}
            </div>
          </div>

          {/* RIGHT — Conversion panel */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#061A2B] p-7 shadow-[0_30px_80px_rgba(6,26,43,0.18)] sm:p-9 lg:p-10">
              {/* Panel top accent */}
              <div className="absolute left-0 right-0 top-0 h-1 bg-[#FFD400]" />

              {/* Number */}
              <div className="mb-12 flex items-start justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#A8BBC8]">
                  Start Here
                </span>

                <span className="font-mono text-xs text-[#A8BBC8]/60">
                  01 / 02
                </span>
              </div>

              <h3 className="max-w-md text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#F8FAFC] sm:text-4xl">
                Choose the easiest way to get started.
              </h3>

              <p className="mt-5 max-w-md text-sm leading-6 text-[#A8BBC8] sm:text-base">
                Request a service online or speak with us directly about your
                vehicle and battery situation.
              </p>

              {/* Primary action */}
              <Link
                href="/book-service"
                className="group mt-9 flex min-h-16 items-center justify-between rounded-2xl bg-[#FFD400] px-5 py-4 text-[#061A2B] transition-all duration-300 hover:bg-[#F5B800] sm:px-6"
              >
                <span>
                  <span className="block text-sm font-bold">
                    {settings.bookingCta}
                  </span>

                  <span className="mt-0.5 block text-xs font-medium opacity-65">
                    Tell us what you need
                  </span>
                </span>

                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#061A2B] text-[#FFD400] transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </Link>

              {/* Secondary actions */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                {settings.primaryCallNumber && (
                  <a
                    href={phoneHref(settings.primaryCallNumber)}
                    className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm font-semibold text-[#F8FAFC] transition-colors hover:border-[#FFD400]/40 hover:bg-white/[0.07]"
                  >
                    <Phone className="h-4 w-4 text-[#FFD400]" />
                    Call Now
                  </a>
                )}

                <Link
                  href="/contact"
                  className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm font-semibold text-[#F8FAFC] transition-colors hover:border-[#FFD400]/40 hover:bg-white/[0.07]"
                >
                  <MessageCircle className="h-4 w-4 text-[#FFD400]" />
                  Contact Us
                </Link>
              </div>

              {/* Bottom detail */}
              <div className="mt-8 border-t border-white/10 pt-5">
                <p className="text-xs leading-5 text-[#A8BBC8]">
                  {settings.businessName} · Mobile car battery assistance ·{" "}
                  {settings.primaryServiceRegion}
                </p>
              </div>
            </div>

            {/* Small floating index */}
            <div className="absolute -bottom-5 -left-4 hidden h-12 w-12 items-center justify-center rounded-full border border-[#061A2B]/10 bg-[#F8FAFC] font-mono text-[10px] font-bold text-[#0D6E91] shadow-lg sm:flex">
              06
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}