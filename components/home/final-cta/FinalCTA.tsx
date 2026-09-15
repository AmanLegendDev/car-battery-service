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
      settings?.businessName || "Car Battery Service",
    primaryServiceRegion:
      settings?.primaryServiceRegion || "Melbourne West",
    phone: settings?.phone || "",
    primaryCallNumber:
      settings?.primaryCallNumber || settings?.phone || "",
    bookingCta:
      settings?.bookingCta || "Request a Service",
  };
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export default async function FinalCTA() {
  const settings = await getFinalCTASettings();

  return (
    <section className="relative overflow-hidden bg-[#061A2B] text-[#F8FAFC]">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#F8FAFC 1px, transparent 1px), linear-gradient(90deg, #F8FAFC 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Large background word */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap select-none font-black uppercase tracking-[-0.09em] text-white/[0.018] text-[clamp(8rem,24vw,26rem)] leading-none"
      >
        MOVE
      </div>

      {/* Soft ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0D6E91]/[0.07] blur-[120px]"
      />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        {/* Top label */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-[#FFD400]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A8BBC8]">
              Ready When You Are
            </span>
          </div>

          <span className="hidden font-mono text-[9px] tracking-[0.25em] text-[#A8BBC8]/40 sm:block">
            {settings.businessName.toUpperCase()}
          </span>
        </div>

        {/* =================================================
            HERO CTA
        ================================================== */}

        <div className="relative py-16 sm:py-20 lg:py-24">
          <div className="max-w-5xl">
            <h2 className="text-[clamp(3.2rem,8vw,8rem)] font-semibold leading-[0.88] tracking-[-0.07em]">
              Need battery
              <span className="block text-[#FFD400]">
                help?
              </span>
            </h2>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <p className="max-w-xl text-base leading-7 text-[#A8BBC8] sm:text-lg sm:leading-8">
              Tell us what is happening with your vehicle and take the next
              step toward getting the assistance you need.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link
                href="/book-service"
                className="group inline-flex min-h-14 items-center justify-between gap-7 rounded-full bg-[#FFD400] px-5 py-2.5 text-sm font-bold text-[#061A2B] transition-all duration-300 hover:bg-[#F5B800] sm:min-w-[235px]"
              >
                <span>{settings.bookingCta}</span>

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#061A2B] text-[#FFD400] transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>

              {settings.primaryCallNumber && (
                <a
                  href={phoneHref(settings.primaryCallNumber)}
                  className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-[#F8FAFC] transition-all duration-300 hover:border-[#FFD400]/50 hover:bg-white/[0.04]"
                >
                  <Phone className="h-4 w-4 text-[#FFD400]" />
                  Call Now
                  <MoveUpRight className="h-3.5 w-3.5 text-[#A8BBC8] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            DIVIDER / SERVICE STATEMENT
        ================================================== */}

        <div className="border-y border-white/10">
          <div className="grid sm:grid-cols-3">
            {/* Item 01 */}
            <div className="border-b border-white/10 px-0 py-6 sm:border-b-0 sm:border-r sm:px-7 sm:py-7 lg:px-9">
              <span className="font-mono text-[9px] tracking-[0.2em] text-[#FFD400]">
                01
              </span>

              <p className="mt-3 text-sm font-semibold text-[#F8FAFC]">
                Tell us what&apos;s happening
              </p>

              <p className="mt-1.5 text-xs leading-5 text-[#A8BBC8]">
                Share the situation with your vehicle.
              </p>
            </div>

            {/* Item 02 */}
            <div className="border-b border-white/10 px-0 py-6 sm:border-b-0 sm:border-r sm:px-7 sm:py-7 lg:px-9">
              <span className="font-mono text-[9px] tracking-[0.2em] text-[#FFD400]">
                02
              </span>

              <p className="mt-3 text-sm font-semibold text-[#F8FAFC]">
                Choose your next step
              </p>

              <p className="mt-1.5 text-xs leading-5 text-[#A8BBC8]">
                Request service or speak with the team.
              </p>
            </div>

            {/* Item 03 */}
            <div className="px-0 py-6 sm:px-7 sm:py-7 lg:px-9">
              <span className="font-mono text-[9px] tracking-[0.2em] text-[#FFD400]">
                03
              </span>

              <p className="mt-3 text-sm font-semibold text-[#F8FAFC]">
                Get the right assistance
              </p>

              <p className="mt-1.5 text-xs leading-5 text-[#A8BBC8]">
                Get started with the information you provide.
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            LOCATION / PHONE FOOTER
        ================================================== */}

        <div className="flex flex-col gap-5 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-7 gap-y-3">
            {settings.primaryServiceRegion && (
              <div className="flex items-center gap-2.5">
                <MapPin className="h-3.5 w-3.5 text-[#FFD400]" />

                <span className="text-xs font-medium text-[#A8BBC8]">
                  {settings.primaryServiceRegion}
                </span>
              </div>
            )}

            {settings.phone && (
              <a
                href={phoneHref(settings.primaryCallNumber)}
                className="flex items-center gap-2.5 text-xs font-medium text-[#A8BBC8] transition-colors hover:text-[#F8FAFC]"
              >
                <Phone className="h-3.5 w-3.5 text-[#FFD400]" />

                <span>{settings.phone}</span>
              </a>
            )}
          </div>

          <span className="font-mono text-[9px] tracking-[0.22em] text-[#A8BBC8]/35">
            END OF PAGE / START OF SERVICE
          </span>
        </div>
      </div>
    </section>
  );
}