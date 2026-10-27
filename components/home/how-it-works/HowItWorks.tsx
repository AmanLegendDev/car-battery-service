
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  MapPin,
  Phone,
  Wrench,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

const PROCESS_STEPS = [
  {
    number: "01",
    eyebrow: "Tell us what you need",
    title: "Describe your vehicle needs",
    description:
      "Tell us about your vehicle, the issue you're experiencing and your location. Our team can help you understand the next steps.",
    icon: ClipboardList,
  },
  {
    number: "02",
    eyebrow: "Discuss your options",
    title: "Find the right service",
    description:
      "We'll discuss your requirements, explain the available service options and help you confirm whether we can assist with your vehicle.",
    icon: Wrench,
  },
  {
    number: "03",
    eyebrow: "Arrange your service",
    title: "Plan your next step",
    description:
      "Once the service and availability are confirmed, arrange an appointment with our team and get clear information about what happens next.",
    icon: CalendarCheck,
  },
];

export default async function HowItWorks() {
  let businessName = "Rapid Auto Services";
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

      <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        {/* Section introduction */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 bg-[#FFD400]"
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0D6E91] sm:tracking-[0.24em]">
                How It Works
              </span>
            </div>

            <p className="mt-4 max-w-xs text-sm font-semibold leading-6 text-slate-400 sm:mt-5">
              A clear, straightforward process from your first enquiry
              to arranging the service you need.
            </p>
          </div>

          <div className="max-w-3xl lg:ml-auto">
            <h2
              id="how-it-works-heading"
              className="text-4xl font-black leading-[0.98] tracking-[-0.05em] sm:text-5xl lg:text-6xl"
            >
              Automotive care,
              <br />
              <span className="text-[#0D6E91]">
                made straightforward.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-6 sm:text-lg sm:leading-7">
              {businessName} helps you take the next step with clear
              communication, service information and appointment
              coordination across {serviceRegion}.
            </p>
          </div>
        </div>

        {/* Three-step process */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
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
            {PROCESS_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === PROCESS_STEPS.length - 1;

              return (
                <article
                  key={step.number}
                  className={`relative ${
                    !isLast
                      ? "border-b border-[#061A2B]/10 lg:border-b-0 lg:border-r lg:border-[#061A2B]/10"
                      : ""
                  }`}
                >
                  <div className="py-7 sm:py-8 lg:px-8 lg:py-2 xl:px-10 first:lg:pl-0 last:lg:pr-0">
                    {/* Mobile timeline marker */}
                    <div
                      aria-hidden="true"
                      className="absolute left-0 top-9 flex h-7 w-7 items-center justify-center border border-[#061A2B]/15 bg-[#F8FAFC] lg:hidden"
                    >
                      <span className="h-2 w-2 bg-[#FFD400]" />
                    </div>

                    <div className="pl-12 lg:pl-0">
                      {/* Step number and icon */}
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

                      <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0D6E91] sm:mt-10 sm:tracking-[0.2em]">
                        {step.eyebrow}
                      </p>

                      <h3 className="mt-3 max-w-sm text-2xl font-black leading-tight tracking-[-0.035em] sm:text-3xl">
                        {step.title}
                      </h3>

                      <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600 sm:mt-5 sm:text-base sm:leading-7">
                        {step.description}
                      </p>

                      {/* Progress indicator */}
                      <div className="mt-7 flex items-center gap-3 sm:mt-8">
                        <span
                          aria-hidden="true"
                          className={`h-1.5 w-1.5 ${
                            index === 0
                              ? "bg-[#FFD400]"
                              : "bg-[#0D6E91]"
                          }`}
                        />

                        <span
                          aria-hidden="true"
                          className="h-px w-10 bg-[#061A2B]/10"
                        />

                        <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:tracking-[0.16em]">
                          Step {index + 1} of {PROCESS_STEPS.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Bottom contact panel */}
        <div className="mt-12 border-t border-[#061A2B]/10 pt-7 sm:mt-16 sm:pt-8 lg:mt-20 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#061A2B] text-[#FFD400]">
              <Wrench
                aria-hidden="true"
                className="h-5 w-5"
                strokeWidth={1.8}
              />
            </div>

            <div>
              <p className="text-sm font-bold text-[#061A2B]">
                Need help choosing a service?
              </p>

              <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500 sm:text-sm">
                Contact {businessName} to discuss your vehicle,
                confirm service availability and understand your
                options.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 lg:mt-0">
            <Link
              href="/services"
              className="group inline-flex min-h-12 items-center gap-3 border border-[#061A2B]/15 px-5 text-xs font-bold uppercase tracking-[0.1em] text-[#061A2B] transition-colors hover:border-[#061A2B] hover:bg-[#061A2B] hover:text-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D6E91] sm:tracking-[0.12em]"
            >
              Explore Services

              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>

            <a
              href={phoneHref}
              aria-label={`Call ${businessName} on ${phone}`}
              className="group inline-flex min-h-12 items-center gap-3 bg-[#FFD400] px-5 text-xs font-black uppercase tracking-[0.1em] text-[#061A2B] transition-colors hover:bg-[#F5B800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D6E91] sm:tracking-[0.12em]"
            >
              <Phone aria-hidden="true" className="h-4 w-4" />

              Call Our Team

              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
