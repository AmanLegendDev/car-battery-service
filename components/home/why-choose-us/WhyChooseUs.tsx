import Link from "next/link";
import {
  ArrowUpRight,
  BatteryCharging,
  Check,
  MapPin,
  Phone,
  ShieldCheck,
  Smartphone,
  Wrench,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

const VALUE_POINTS = [
  {
    number: "01",
    icon: MapPin,
    title: "We come to your vehicle",
    description:
      "Our mobile approach means battery assistance can be provided at your vehicle's location instead of requiring you to take the car to a workshop.",
  },
  {
    number: "02",
    icon: BatteryCharging,
    title: "Battery-focused assistance",
    description:
      "From testing and replacement to jump start assistance, the service is focused on common battery-related situations.",
  },
  {
    number: "03",
    icon: Smartphone,
    title: "Simple to get started",
    description:
      "Call or contact us with your vehicle details and location so we can understand what assistance you need.",
  },
  {
    number: "04",
    icon: Wrench,
    title: "Practical mobile service",
    description:
      "The service is designed around helping you at the place where the battery problem has happened.",
  },
];

export default async function WhyChooseUs() {
  let businessName = "Car Battery Service";
  let serviceRegion = "Melbourne West";
  let phone = "+61 467 037 886";
  let callNumber = "+61 467 037 886";

  try {
    await connectDB();

    const settings = await SiteSettings.findOne()
      .select({
        businessName: 1,
        primaryServiceRegion: 1,
        phone: 1,
        primaryCallNumber: 1,
      })
      .lean();

    if (settings) {
      businessName = settings.businessName || businessName;

      serviceRegion =
        settings.primaryServiceRegion || serviceRegion;

      phone = settings.phone || phone;

      callNumber =
        settings.primaryCallNumber ||
        settings.phone ||
        callNumber;
    }
  } catch (error) {
    console.error(
      "Failed to load why-choose-us settings:",
      error
    );
  }

  const phoneHref = `tel:${callNumber.replace(/[^\d+]/g, "")}`;

  return (
    <section
      aria-labelledby="why-choose-us-heading"
      className="relative overflow-hidden bg-[#061A2B] text-[#F8FAFC]"
    >
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-[#0D6E91]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[#FFD400]/[0.035] blur-3xl"
      />

      {/* Fine vertical structure */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-[6%] top-0 h-full w-px bg-white/[0.035]" />
        <div className="absolute right-[6%] top-0 h-full w-px bg-white/[0.035]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        {/* =========================================================
            HEADER
        ========================================================== */}
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#FFD400]">
                Why Choose Us
              </span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <span className="h-px w-8 bg-[#0D6E91]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A8BBC8]">
                Mobile battery assistance
              </span>
            </div>
          </div>

          <div className="max-w-4xl lg:ml-auto">
            <h2
              id="why-choose-us-heading"
              className="text-4xl font-black leading-[0.94] tracking-[-0.05em] sm:text-5xl lg:text-6xl"
            >
              Battery help,
              <br />
              <span className="text-[#FFD400]">
                built around you.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#A8BBC8] sm:text-lg">
              {businessName} brings a practical mobile approach to
              battery assistance, keeping the service focused on your
              vehicle and your situation.
            </p>
          </div>
        </div>

        {/* =========================================================
            MAIN CONTENT
        ========================================================== */}
        <div className="mt-14 border-y border-white/10 lg:mt-20">
          <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
            {/* =====================================================
                LEFT BRAND / VISUAL PANEL
            ====================================================== */}
            <div className="relative overflow-hidden border-b border-white/10 bg-[#08263D] lg:border-b-0 lg:border-r">
              <div className="relative min-h-[380px] p-7 sm:min-h-[420px] sm:p-9 lg:min-h-[590px] lg:p-10">
                {/* Technical coordinates */}
                <div className="absolute right-7 top-7 font-mono text-[9px] tracking-[0.2em] text-[#A8BBC8]/50 sm:right-9 sm:top-9">
                  CBS / {serviceRegion.toUpperCase()}
                </div>

                {/* Grid */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-30"
                >
                  <div className="absolute left-0 right-0 top-[32%] h-px bg-white/[0.045]" />
                  <div className="absolute left-0 right-0 top-[68%] h-px bg-white/[0.045]" />
                  <div className="absolute bottom-0 left-[25%] top-0 w-px bg-white/[0.035]" />
                  <div className="absolute bottom-0 left-[75%] top-0 w-px bg-white/[0.035]" />
                </div>

                {/* Main visual */}
                <div className="absolute left-1/2 top-[48%] flex h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:h-[230px] sm:w-[230px] lg:h-[260px] lg:w-[260px]">
                  {/* Outer ring */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border border-[#A8BBC8]/10"
                  />

                  {/* Middle ring */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-[18%] rounded-full border border-[#0D6E91]/30"
                  />

                  {/* Yellow marker */}
                  <div
                    aria-hidden="true"
                    className="absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 bg-[#FFD400]"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute -left-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 bg-[#0D6E91]"
                  />

                  {/* Core */}
                  <div className="relative flex h-[112px] w-[112px] items-center justify-center border border-[#FFD400]/30 bg-[#061A2B] shadow-[0_0_80px_rgba(13,110,145,0.18)] sm:h-[132px] sm:w-[132px]">
                    <BatteryCharging
                      aria-hidden="true"
                      className="h-12 w-12 text-[#FFD400] sm:h-14 sm:w-14"
                      strokeWidth={1.2}
                    />

                    <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-[7px] font-bold uppercase tracking-[0.2em] text-[#A8BBC8]">
                      Mobile
                    </span>
                  </div>
                </div>

                {/* Top identity */}
                <div className="relative z-10 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center border border-[#FFD400]/40 bg-[#061A2B]">
                    <ShieldCheck
                      aria-hidden="true"
                      className="h-4 w-4 text-[#FFD400]"
                      strokeWidth={1.7}
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#F8FAFC]">
                      Service approach
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-[#A8BBC8]">
                      Mobile-first
                    </p>
                  </div>
                </div>

                {/* Bottom copy */}
                <div className="absolute bottom-7 left-7 right-7 sm:bottom-9 sm:left-9 sm:right-9">
                  <div className="flex items-end justify-between gap-5">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#A8BBC8]">
                        Our difference
                      </p>

                      <p className="mt-2 max-w-xs text-xl font-black leading-tight tracking-[-0.03em] sm:text-2xl">
                        Assistance comes to where the problem is.
                      </p>
                    </div>

                    <span className="hidden h-10 w-10 items-center justify-center border border-white/10 sm:flex">
                      <MapPin
                        aria-hidden="true"
                        className="h-4 w-4 text-[#FFD400]"
                        strokeWidth={1.5}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================================
                RIGHT VALUE LIST
            ====================================================== */}
            <div className="bg-[#061A2B]">
              {VALUE_POINTS.map((point, index) => {
                const Icon = point.icon;

                return (
                  <article
                    key={point.number}
                    className={`group relative ${
                      index !== VALUE_POINTS.length - 1
                        ? "border-b border-white/10"
                        : ""
                    }`}
                  >
                    <div className="grid gap-5 px-6 py-7 sm:grid-cols-[64px_1fr_auto] sm:gap-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
                      {/* Number */}
                      <div className="flex items-start">
                        <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#A8BBC8]/50">
                          {point.number}
                        </span>
                      </div>

                      {/* Content */}
                      <div>
                        <div className="flex items-center gap-4">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-[#08263D] transition-all duration-300 group-hover:border-[#FFD400]/40 group-hover:bg-[#FFD400]">
                            <Icon
                              aria-hidden="true"
                              className="h-4 w-4 text-[#FFD400] transition-colors duration-300 group-hover:text-[#061A2B]"
                              strokeWidth={1.7}
                            />
                          </span>

                          <h3 className="text-xl font-black tracking-[-0.03em] sm:text-2xl">
                            {point.title}
                          </h3>
                        </div>

                        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#A8BBC8] sm:text-base sm:leading-7">
                          {point.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="hidden items-center sm:flex">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 transition-all duration-300 group-hover:border-[#FFD400] group-hover:bg-[#FFD400]">
                          <ArrowUpRight
                            aria-hidden="true"
                            className="h-4 w-4 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#061A2B]"
                          />
                        </span>
                      </div>
                    </div>

                    {/* Yellow hover rail */}
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 top-0 w-0 bg-[#FFD400] transition-all duration-300 group-hover:w-1"
                    />
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================
            SERVICE FACTS
        ========================================================== */}
        <div className="mt-8 grid border border-white/10 bg-[#08263D] sm:grid-cols-3">
          <div className="flex items-center gap-4 border-b border-white/10 px-5 py-5 sm:border-b-0 sm:border-r sm:px-7">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#061A2B]">
              <Check
                aria-hidden="true"
                className="h-4 w-4 text-[#FFD400]"
                strokeWidth={2.5}
              />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#A8BBC8]">
                Approach
              </p>

              <p className="mt-1 text-xs font-bold text-[#F8FAFC]">
                Mobile assistance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b border-white/10 px-5 py-5 sm:border-b-0 sm:border-r sm:px-7">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#061A2B]">
              <BatteryCharging
                aria-hidden="true"
                className="h-4 w-4 text-[#FFD400]"
                strokeWidth={1.6}
              />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#A8BBC8]">
                Focus
              </p>

              <p className="mt-1 text-xs font-bold text-[#F8FAFC]">
                Battery assistance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-5 py-5 sm:px-7">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#061A2B]">
              <MapPin
                aria-hidden="true"
                className="h-4 w-4 text-[#FFD400]"
                strokeWidth={1.6}
              />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#A8BBC8]">
                Region
              </p>

              <p className="mt-1 text-xs font-bold text-[#F8FAFC]">
                {serviceRegion}
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================
            BOTTOM CTA
        ========================================================== */}
        <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#A8BBC8]">
              Need battery assistance?
            </p>

            <p className="mt-2 text-lg font-black tracking-[-0.02em] text-[#F8FAFC] sm:text-xl">
              Tell us about your vehicle and location.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/services"
              className="group inline-flex min-h-12 items-center gap-3 border border-white/15 px-5 text-xs font-bold uppercase tracking-[0.12em] text-[#F8FAFC] transition-all duration-300 hover:border-white/40 hover:bg-[#08263D]"
            >
              Explore Services

              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>

            <a
              href={phoneHref}
              className="group inline-flex min-h-12 items-center gap-3 bg-[#FFD400] px-5 text-xs font-black uppercase tracking-[0.12em] text-[#061A2B] transition-all duration-300 hover:bg-[#F5B800]"
            >
              <Phone
                aria-hidden="true"
                className="h-4 w-4"
                strokeWidth={2.2}
              />

              Call {phone}

              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}