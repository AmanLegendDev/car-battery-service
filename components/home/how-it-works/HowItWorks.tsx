import Link from "next/link";
import {
  ArrowUpRight,
  BatteryCharging,
  CheckCircle2,
  MapPin,
  Phone,
  SearchCheck,
  Wrench,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

const DEFAULT_STEPS = [
  {
    number: "01",
    eyebrow: "Tell us what you need",
    title: "Start with your situation",
    description:
      "Tell us about your vehicle, battery issue and current location so we can understand what assistance you need.",
    icon: Phone,
  },
  {
    number: "02",
    eyebrow: "Mobile assistance",
    title: "We come to your vehicle",
    description:
      "Our mobile service is designed to provide battery assistance at your vehicle's location, so you don't have to take the car to a workshop.",
    icon: MapPin,
  },
  {
    number: "03",
    eyebrow: "Get back on the road",
    title: "Get the right assistance",
    description:
      "Depending on your situation, we can help with battery testing, replacement or jump start assistance.",
    icon: Wrench,
  },
];

export default async function HowItWorks() {
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
        settings.primaryCallNumber || settings.phone || callNumber;
    }
  } catch (error) {
    console.error(
      "Failed to load how-it-works settings:",
      error
    );
  }

  const phoneHref = `tel:${callNumber.replace(/[^\d+]/g, "")}`;

  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="relative overflow-hidden bg-[#F8FAFC] text-[#061A2B]"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-[#0D6E91]/[0.06] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#FFD400]/[0.07] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        {/* Section intro */}
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#0D6E91]">
                How It Works
              </span>
            </div>

            <p className="mt-5 max-w-xs text-sm font-semibold leading-6 text-slate-400">
              A straightforward mobile battery service from the
              first conversation to the assistance you need.
            </p>
          </div>

          <div className="max-w-3xl lg:ml-auto">
            <h2
              id="how-it-works-heading"
              className="text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-5xl lg:text-6xl"
            >
              Simple from
              <br />
              <span className="text-[#0D6E91]">
                the first call.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              {businessName} keeps the process focused on one thing:
              getting the right battery assistance to your vehicle
              without unnecessary hassle.
            </p>
          </div>
        </div>

        {/* Process */}
        <div className="mt-16 lg:mt-20">
          {/* Desktop connection line */}
          <div
            aria-hidden="true"
            className="relative mb-10 hidden h-px bg-[#061A2B]/10 lg:block"
          >
            <div className="absolute inset-y-0 left-0 w-1/3 bg-[#FFD400]" />

            <div className="absolute -top-2 left-[32%] h-4 w-4 border-4 border-[#F8FAFC] bg-[#FFD400]" />

            <div className="absolute -top-2 left-[66%] h-4 w-4 border-4 border-[#F8FAFC] bg-[#0D6E91]" />

            <div className="absolute -top-2 right-0 h-4 w-4 border-4 border-[#F8FAFC] bg-[#061A2B]" />
          </div>

          <div className="grid lg:grid-cols-3">
            {DEFAULT_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === DEFAULT_STEPS.length - 1;

              return (
                <article
                  key={step.number}
                  className={`relative ${
                    !isLast
                      ? "border-b border-[#061A2B]/10 lg:border-b-0 lg:border-r lg:border-[#061A2B]/10"
                      : ""
                  }`}
                >
                  <div className="py-8 lg:px-10 lg:py-2 first:lg:pl-0 last:lg:pr-0">
                    {/* Mobile timeline */}
                    <div className="absolute left-0 top-10 flex h-7 w-7 items-center justify-center border border-[#061A2B]/15 bg-[#F8FAFC] lg:hidden">
                      <span className="h-2 w-2 bg-[#FFD400]" />
                    </div>

                    <div className="pl-12 lg:pl-0">
                      {/* Number + icon */}
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-xs font-bold tracking-[0.2em] text-slate-400">
                          {step.number}
                        </span>

                        <div className="flex h-11 w-11 items-center justify-center border border-[#061A2B]/10 bg-white">
                          <Icon
                            aria-hidden="true"
                            className="h-5 w-5 text-[#0D6E91]"
                            strokeWidth={1.8}
                          />
                        </div>
                      </div>

                      <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0D6E91]">
                        {step.eyebrow}
                      </p>

                      <h3 className="mt-3 max-w-sm text-2xl font-black leading-tight tracking-[-0.035em] sm:text-3xl">
                        {step.title}
                      </h3>

                      <p className="mt-5 max-w-sm text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                        {step.description}
                      </p>

                      {/* Small progress indicator */}
                      <div className="mt-8 flex items-center gap-3">
                        <span
                          className={`h-1.5 w-1.5 ${
                            index === 0
                              ? "bg-[#FFD400]"
                              : "bg-[#0D6E91]"
                          }`}
                        />

                        <span className="h-px w-10 bg-[#061A2B]/10" />

                        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                          Step {index + 1} of 3
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Bottom service note */}
        <div className="mt-16 border-t border-[#061A2B]/10 pt-8 lg:mt-20 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#061A2B] text-[#FFD400]">
              <BatteryCharging
                aria-hidden="true"
                className="h-5 w-5"
                strokeWidth={1.8}
              />
            </div>

            <div>
              <p className="text-sm font-bold text-[#061A2B]">
                Mobile battery assistance in {serviceRegion}
              </p>

              <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500 sm:text-sm">
                Battery testing, replacement and jump start assistance
                are available according to your vehicle&apos;s
                situation.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 lg:mt-0">
            <Link
              href="/services"
              className="group inline-flex min-h-12 items-center gap-3 border border-[#061A2B]/15 px-5 text-xs font-bold uppercase tracking-[0.12em] text-[#061A2B] transition-all duration-300 hover:border-[#061A2B] hover:bg-[#061A2B] hover:text-[#F8FAFC]"
            >
              Explore Services

              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>

            <a
              href={phoneHref}
              className="group inline-flex min-h-12 items-center gap-3 bg-[#FFD400] px-5 text-xs font-black uppercase tracking-[0.12em] text-[#061A2B] transition-all duration-300 hover:bg-[#F5B800]"
            >
              <Phone
                aria-hidden="true"
                className="h-4 w-4"
              />

              Call {phone}

              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}