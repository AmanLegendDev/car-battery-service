
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
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
    title: "Service options that suit your needs",
    description:
      "Every vehicle concern is different. Tell us what is happening, and our team can discuss the available services and suitable next steps.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Clear communication from the start",
    description:
      "We focus on understanding your requirements, explaining service options clearly and helping you confirm availability before proceeding.",
  },
  {
    number: "03",
    icon: Smartphone,
    title: "A straightforward booking process",
    description:
      "Get in touch by phone or arrange a service online. Share your vehicle details and location so your enquiry can be handled more efficiently.",
  },
  {
    number: "04",
    icon: Wrench,
    title: "Practical, customer-focused support",
    description:
      "Our approach starts with your situation. We help you understand the available options and coordinate the next step for your vehicle.",
  },
];

export default async function WhyChooseUs() {
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

      <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        {/* Section header */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 bg-[#FFD400]"
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFD400] sm:tracking-[0.24em]">
                Why Choose Us
              </span>
            </div>

            <div className="mt-5 flex items-center gap-3 sm:mt-6">
              <span
                aria-hidden="true"
                className="h-px w-8 bg-[#0D6E91]"
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#A8BBC8] sm:tracking-[0.18em]">
                The Rapid Auto Approach
              </span>
            </div>
          </div>

          <div className="max-w-4xl lg:ml-auto">
            <h2
              id="why-choose-us-heading"
              className="text-4xl font-black leading-[0.98] tracking-[-0.05em] sm:text-5xl lg:text-6xl"
            >
              Automotive care,
              <br />
              <span className="text-[#FFD400]">
                centred around you.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-[#A8BBC8] sm:mt-6 sm:text-lg sm:leading-7">
              {businessName} takes a customer-focused approach to
              automotive assistance, with clear communication,
              practical service information and support in
              understanding your options across {serviceRegion}.
            </p>
          </div>
        </div>

        {/* Main value proposition */}
        <div className="mt-10 border-y border-white/10 sm:mt-14 lg:mt-20">
          <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
            {/* Left visual panel */}
            <div className="relative overflow-hidden border-b border-white/10 bg-[#08263D] lg:border-b-0 lg:border-r">
              <div className="relative min-h-[340px] p-6 sm:min-h-[420px] sm:p-9 lg:min-h-[590px] lg:p-10">
                {/* Location label */}
                <div className="absolute right-6 top-6 font-mono text-[9px] tracking-[0.15em] text-[#A8BBC8]/60 sm:right-9 sm:top-9 sm:tracking-[0.2em]">
                  RAS / {serviceRegion.toUpperCase()}
                </div>

                {/* Technical grid */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-30"
                >
                  <div className="absolute left-0 right-0 top-[32%] h-px bg-white/[0.045]" />
                  <div className="absolute left-0 right-0 top-[68%] h-px bg-white/[0.045]" />
                  <div className="absolute bottom-0 left-[25%] top-0 w-px bg-white/[0.035]" />
                  <div className="absolute bottom-0 left-[75%] top-0 w-px bg-white/[0.035]" />
                </div>

                {/* Automotive service motif */}
                <div className="absolute left-1/2 top-[48%] flex h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:h-[230px] sm:w-[230px] lg:h-[260px] lg:w-[260px]">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border border-[#A8BBC8]/10"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-[18%] rounded-full border border-[#0D6E91]/30"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 bg-[#FFD400]"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute -left-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 bg-[#0D6E91]"
                  />

                  <div className="relative flex h-[108px] w-[108px] items-center justify-center border border-[#FFD400]/30 bg-[#061A2B] shadow-[0_0_80px_rgba(13,110,145,0.18)] sm:h-[132px] sm:w-[132px]">
                    <Wrench
                      aria-hidden="true"
                      className="h-11 w-11 text-[#FFD400] sm:h-14 sm:w-14"
                      strokeWidth={1.3}
                    />

                    <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[7px] font-bold uppercase tracking-[0.15em] text-[#A8BBC8] sm:tracking-[0.2em]">
                      Automotive Care
                    </span>
                  </div>
                </div>

                {/* Service identity */}
                <div className="relative z-10 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center border border-[#FFD400]/40 bg-[#061A2B]">
                    <ShieldCheck
                      aria-hidden="true"
                      className="h-4 w-4 text-[#FFD400]"
                      strokeWidth={1.7}
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#F8FAFC] sm:tracking-[0.2em]">
                      Our approach
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-[#A8BBC8]">
                      Customer focused
                    </p>
                  </div>
                </div>

                {/* Bottom message */}
                <div className="absolute bottom-6 left-6 right-6 sm:bottom-9 sm:left-9 sm:right-9">
                  <div className="flex items-end justify-between gap-5">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#A8BBC8]">
                        What matters to us
                      </p>

                      <p className="mt-2 max-w-xs text-xl font-black leading-tight tracking-[-0.03em] sm:text-2xl">
                        Clear advice. Practical next steps.
                      </p>
                    </div>

                    <span className="hidden h-10 w-10 shrink-0 items-center justify-center border border-white/10 sm:flex">
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

            {/* Right value list */}
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
                    <div className="grid gap-4 px-5 py-6 sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:gap-6 sm:px-7 sm:py-8 lg:grid-cols-[48px_minmax(0,1fr)_auto] lg:gap-7 lg:px-9 lg:py-9">
                      {/* Number */}
                      <div>
                        <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#A8BBC8]/50">
                          {point.number}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-[#08263D] transition-colors duration-300 group-hover:border-[#FFD400]/40 group-hover:bg-[#FFD400]">
                            <Icon
                              aria-hidden="true"
                              className="h-4 w-4 text-[#FFD400] transition-colors duration-300 group-hover:text-[#061A2B]"
                              strokeWidth={1.7}
                            />
                          </span>

                          <h3 className="text-lg font-black leading-tight tracking-[-0.03em] sm:text-xl lg:text-2xl">
                            {point.title}
                          </h3>
                        </div>

                        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#A8BBC8] sm:text-base sm:leading-7">
                          {point.description}
                        </p>
                      </div>

                      {/* Decorative arrow */}
                      <div className="hidden items-center sm:flex">
                        <span
                          aria-hidden="true"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 transition-colors duration-300 group-hover:border-[#FFD400] group-hover:bg-[#FFD400]"
                        >
                          <ArrowUpRight className="h-4 w-4 transition-colors duration-300 group-hover:text-[#061A2B]" />
                        </span>
                      </div>
                    </div>

                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 top-0 w-0 bg-[#FFD400] transition-all duration-300 motion-reduce:transition-none group-hover:w-1"
                    />
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        {/* Key service principles */}
        <div className="mt-6 grid border border-white/10 bg-[#08263D] sm:mt-8 sm:grid-cols-3">
          <div className="flex items-center gap-4 border-b border-white/10 px-5 py-5 sm:border-b-0 sm:border-r sm:px-6 lg:px-7">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#061A2B]">
              <Check
                aria-hidden="true"
                className="h-4 w-4 text-[#FFD400]"
                strokeWidth={2.5}
              />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#A8BBC8] sm:tracking-[0.16em]">
                Approach
              </p>

              <p className="mt-1 text-xs font-bold text-[#F8FAFC]">
                Customer focused
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b border-white/10 px-5 py-5 sm:border-b-0 sm:border-r sm:px-6 lg:px-7">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#061A2B]">
              <ClipboardCheck
                aria-hidden="true"
                className="h-4 w-4 text-[#FFD400]"
                strokeWidth={1.6}
              />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#A8BBC8] sm:tracking-[0.16em]">
                Process
              </p>

              <p className="mt-1 text-xs font-bold text-[#F8FAFC]">
                Clear next steps
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-5 py-5 sm:px-6 lg:px-7">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#061A2B]">
              <MapPin
                aria-hidden="true"
                className="h-4 w-4 text-[#FFD400]"
                strokeWidth={1.6}
              />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#A8BBC8] sm:tracking-[0.16em]">
                Service region
              </p>

              <p className="mt-1 text-xs font-bold text-[#F8FAFC]">
                {serviceRegion}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-7 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pt-8">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#A8BBC8]">
              Need help with your vehicle?
            </p>

            <p className="mt-2 text-lg font-black tracking-[-0.02em] text-[#F8FAFC] sm:text-xl">
              Let&apos;s discuss the right service for you.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/services"
              className="group inline-flex min-h-12 items-center gap-3 border border-white/15 px-4 text-[11px] font-bold uppercase tracking-[0.08em] text-[#F8FAFC] transition-colors hover:border-white/40 hover:bg-[#08263D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] sm:px-5 sm:text-xs sm:tracking-[0.12em]"
            >
              Explore Services

              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>

            <a
              href={phoneHref}
              aria-label={`Call ${businessName} on ${phone}`}
              className="group inline-flex min-h-12 items-center gap-3 bg-[#FFD400] px-4 text-[11px] font-black uppercase tracking-[0.08em] text-[#061A2B] transition-colors hover:bg-[#F5B800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] sm:px-5 sm:text-xs sm:tracking-[0.12em]"
            >
              <Phone
                aria-hidden="true"
                className="h-4 w-4"
              />

              Call Our Team

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
