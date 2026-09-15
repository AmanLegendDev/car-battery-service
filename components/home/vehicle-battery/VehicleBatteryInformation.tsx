import Link from "next/link";
import {
  ArrowUpRight,
  BatteryCharging,
  CheckCircle2,
  CircleAlert,
  Gauge,
  Lightbulb,
  Phone,
  SearchCheck,
  Wrench,
  Zap,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import Service from "@/models/Service";

interface HomepageService {
  _id: unknown;
  title: string;
  slug: string;
  shortDescription: string;
}

const DEFAULT_SIGNS = [
  {
    number: "01",
    title: "Starting feels different",
    description:
      "If your vehicle is struggling when you try to start it, the battery may need attention.",
  },
  {
    number: "02",
    title: "The vehicle won't start",
    description:
      "A vehicle that will not start may need battery testing or immediate assistance.",
  },
  {
    number: "03",
    title: "Electrical behaviour changes",
    description:
      "Unusual electrical behaviour can be a reason to have the battery and starting system checked.",
  },
  {
    number: "04",
    title: "You're unsure what you need",
    description:
      "If you are not sure whether you need a test, replacement or jump start assistance, contact us first.",
  },
];

export default async function VehicleBatteryInformation() {
  let businessName = "Car Battery Service";
  let serviceRegion = "Melbourne West";
  let phone = "+61 467 037 886";
  let callNumber = "+61 467 037 886";
  let services: HomepageService[] = [];

  try {
    await connectDB();

    const [settings, serviceResults] = await Promise.all([
      SiteSettings.findOne()
        .select({
          businessName: 1,
          primaryServiceRegion: 1,
          phone: 1,
          primaryCallNumber: 1,
        })
        .lean(),

      Service.find({
        status: "active",
      })
        .select({
          title: 1,
          slug: 1,
          shortDescription: 1,
        })
        .sort({
          displayOrder: 1,
          title: 1,
        })
        .limit(3)
        .lean(),
    ]);

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

    services =
      serviceResults as unknown as HomepageService[];
  } catch (error) {
    console.error(
      "Failed to load vehicle and battery information:",
      error
    );
  }

  const phoneHref = `tel:${callNumber.replace(/[^\d+]/g, "")}`;

  return (
    <section
      aria-labelledby="vehicle-battery-heading"
      className="relative overflow-hidden bg-[#F8FAFC] text-[#061A2B]"
    >
      {/* =========================================================
          BACKGROUND
      ========================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-24 h-[500px] w-[500px] rounded-full bg-[#0D6E91]/[0.045] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[#FFD400]/[0.07] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[6%] top-0 h-full w-px bg-[#061A2B]/[0.035]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[6%] top-0 h-full w-px bg-[#061A2B]/[0.035]"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        {/* =========================================================
            HEADER
        ========================================================== */}

        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#0D6E91]">
                Vehicle &amp; Battery Information
              </span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <BatteryCharging
                aria-hidden="true"
                className="h-4 w-4 text-[#0D6E91]"
                strokeWidth={1.5}
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Understand the signs
              </span>
            </div>
          </div>

          <div className="max-w-4xl lg:ml-auto">
            <h2
              id="vehicle-battery-heading"
              className="text-4xl font-black leading-[0.94] tracking-[-0.05em] sm:text-5xl lg:text-6xl"
            >
              Know the signs.
              <br />
              <span className="text-[#0D6E91]">
                Choose the right help.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Battery problems can show up in different ways. Knowing
              what your vehicle is doing can help you explain the
              situation and choose the right type of assistance.
            </p>
          </div>
        </div>

        {/* =========================================================
            DIAGNOSTIC INTRO
        ========================================================== */}

        <div className="mt-14 grid border-y border-[#061A2B]/10 lg:mt-20 lg:grid-cols-[0.9fr_1.1fr]">
          {/* LEFT — DIAGNOSTIC VISUAL */}
          <div className="relative min-h-[430px] overflow-hidden border-b border-[#061A2B]/10 bg-[#061A2B] lg:min-h-[570px] lg:border-b-0 lg:border-r">
            {/* Technical grid */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <div className="absolute left-1/2 top-0 h-full w-px bg-white/[0.035]" />

              <div className="absolute left-0 right-0 top-1/2 h-px bg-white/[0.035]" />

              <div className="absolute left-[14%] top-[18%] h-1.5 w-1.5 bg-[#A8BBC8]/25" />

              <div className="absolute right-[18%] top-[28%] h-1.5 w-1.5 bg-[#A8BBC8]/20" />

              <div className="absolute bottom-[22%] left-[23%] h-1.5 w-1.5 bg-[#A8BBC8]/20" />

              <div className="absolute bottom-[16%] right-[28%] h-1.5 w-1.5 bg-[#A8BBC8]/25" />
            </div>

            {/* Top technical label */}
            <div className="absolute left-6 right-6 top-6 flex items-center justify-between sm:left-8 sm:right-8 sm:top-8">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#A8BBC8]">
                Battery check
              </span>

              <span className="font-mono text-[9px] tracking-[0.16em] text-[#A8BBC8]/50">
                01 / 04
              </span>
            </div>

            {/* Battery visual */}
            <div className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 sm:h-[310px] sm:w-[310px]">
              {/* Outer circle */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-white/[0.07]"
              />

              {/* Middle circle */}
              <div
                aria-hidden="true"
                className="absolute inset-[12%] rounded-full border border-[#0D6E91]/25"
              />

              {/* Yellow orbit */}
              <div
                aria-hidden="true"
                className="absolute inset-[24%] rounded-full border border-[#FFD400]/20"
              />

              {/* Orbit marker */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 bg-[#FFD400]"
              />

              {/* Center */}
              <div className="absolute left-1/2 top-1/2 flex h-[110px] w-[110px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center border border-[#FFD400]/35 bg-[#08263D] shadow-[0_0_90px_rgba(13,110,145,0.2)] sm:h-[135px] sm:w-[135px]">
                <BatteryCharging
                  aria-hidden="true"
                  className="h-11 w-11 text-[#FFD400] sm:h-14 sm:w-14"
                  strokeWidth={1.1}
                />

                <span className="mt-2 text-[7px] font-bold uppercase tracking-[0.2em] text-[#A8BBC8]">
                  Battery
                </span>
              </div>
            </div>

            {/* Bottom statement */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#08263D]/90 px-6 py-6 backdrop-blur-sm sm:px-8">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#FFD400]">
                Start with the symptoms
              </p>

              <p className="mt-2 max-w-md text-lg font-black leading-tight tracking-[-0.025em] text-[#F8FAFC] sm:text-xl">
                The more you can tell us, the easier it is to understand
                what assistance you may need.
              </p>
            </div>
          </div>

          {/* RIGHT — SIGNS */}
          <div className="bg-white">
            <div className="border-b border-[#061A2B]/10 px-6 py-7 sm:px-8 sm:py-9 lg:px-10">
              <div className="flex items-center gap-3">
                <CircleAlert
                  aria-hidden="true"
                  className="h-5 w-5 text-[#0D6E91]"
                  strokeWidth={1.5}
                />

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0D6E91]">
                  Common situations
                </p>
              </div>

              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">
                These are useful starting points when describing a
                battery-related problem.
              </p>
            </div>

            <div>
              {DEFAULT_SIGNS.map((sign, index) => (
                <div
                  key={sign.number}
                  className={`group relative ${
                    index !== DEFAULT_SIGNS.length - 1
                      ? "border-b border-[#061A2B]/10"
                      : ""
                  }`}
                >
                  <div className="grid gap-5 px-6 py-7 sm:grid-cols-[55px_1fr_auto] sm:items-start sm:px-8 sm:py-8 lg:px-10">
                    <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-slate-400">
                      {sign.number}
                    </span>

                    <div>
                      <h3 className="text-lg font-black tracking-[-0.025em] sm:text-xl">
                        {sign.title}
                      </h3>

                      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                        {sign.description}
                      </p>
                    </div>

                    <div className="hidden h-8 w-8 items-center justify-center border border-[#061A2B]/10 transition-all duration-300 group-hover:border-[#FFD400] group-hover:bg-[#FFD400] sm:flex">
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </div>
                  </div>

                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 top-0 w-0 bg-[#FFD400] transition-all duration-300 group-hover:w-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================
            SERVICE PATH
        ========================================================== */}

        <div className="mt-14 lg:mt-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 bg-[#FFD400]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0D6E91]">
                  What might you need?
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
                Start with the situation.
              </h3>
            </div>

            <p className="max-w-lg text-sm leading-6 text-slate-500">
              Explore the battery services currently published on the
              website and find the option that best matches your
              situation.
            </p>
          </div>

          {/* Dynamic service rows */}
          {services.length > 0 && (
            <div className="mt-8 border-t border-[#061A2B]/10">
              {services.map((service, index) => (
                <Link
                  key={String(service._id)}
                  href={`/services/${service.slug}`}
                  className="group grid gap-5 border-b border-[#061A2B]/10 py-6 transition-colors duration-300 hover:bg-white sm:grid-cols-[55px_1fr_auto] sm:items-center sm:px-5"
                >
                  <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <div className="flex items-center gap-3">
                      <BatteryCharging
                        aria-hidden="true"
                        className="h-4 w-4 text-[#0D6E91]"
                        strokeWidth={1.6}
                      />

                      <h4 className="text-base font-black tracking-[-0.02em] sm:text-lg">
                        {service.title}
                      </h4>
                    </div>

                    <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                      {service.shortDescription}
                    </p>
                  </div>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#061A2B]/15 transition-all duration-300 group-hover:border-[#FFD400] group-hover:bg-[#FFD400]">
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* =========================================================
            REMEMBER STRIP
        ========================================================== */}

        <div className="mt-10 grid border border-[#061A2B]/10 bg-[#061A2B] sm:grid-cols-3">
          <div className="flex items-center gap-4 border-b border-white/10 px-5 py-5 sm:border-b-0 sm:border-r sm:px-7">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#08263D]">
              <SearchCheck
                aria-hidden="true"
                className="h-4 w-4 text-[#FFD400]"
                strokeWidth={1.6}
              />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#A8BBC8]">
                First
              </p>

              <p className="mt-1 text-xs font-bold text-[#F8FAFC]">
                Describe the problem
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b border-white/10 px-5 py-5 sm:border-b-0 sm:border-r sm:px-7">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#08263D]">
              <Gauge
                aria-hidden="true"
                className="h-4 w-4 text-[#FFD400]"
                strokeWidth={1.6}
              />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#A8BBC8]">
                Then
              </p>

              <p className="mt-1 text-xs font-bold text-[#F8FAFC]">
                Understand the situation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-5 py-5 sm:px-7">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#FFD400]">
              <Zap
                aria-hidden="true"
                className="h-4 w-4 text-[#061A2B]"
                strokeWidth={2}
              />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#A8BBC8]">
                Next
              </p>

              <p className="mt-1 text-xs font-bold text-[#F8FAFC]">
                Get the right assistance
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================
            CTA
        ========================================================== */}

        <div className="mt-10 flex flex-col gap-6 border-t border-[#061A2B]/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#FFD400]">
              <Lightbulb
                aria-hidden="true"
                className="h-5 w-5 text-[#061A2B]"
                strokeWidth={1.7}
              />
            </div>

            <div>
              <p className="text-sm font-black text-[#061A2B]">
                Not sure what your vehicle needs?
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Contact {businessName} with your vehicle details and
                location.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/services"
              className="group inline-flex min-h-12 items-center gap-3 border border-[#061A2B]/15 px-5 text-xs font-bold uppercase tracking-[0.12em] text-[#061A2B] transition-all duration-300 hover:border-[#061A2B] hover:bg-[#061A2B] hover:text-[#F8FAFC]"
            >
              View Services

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