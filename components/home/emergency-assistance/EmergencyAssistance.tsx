import Link from "next/link";
import {
  ArrowUpRight,
  BatteryWarning,
  CalendarCheck,
  MapPin,
  Phone,
  Zap,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

export default async function EmergencyAssistance() {
  let phone = "+61 467 037 886";
  let callNumber = "+61 467 037 886";
  let bookingCta = "Book a Battery Service";
  let serviceRegion = "Melbourne West";

  try {
    await connectDB();

    const settings = await SiteSettings.findOne()
      .select({
        phone: 1,
        primaryCallNumber: 1,
        bookingCta: 1,
        primaryServiceRegion: 1,
      })
      .lean();

    if (settings) {
      phone = settings.phone || phone;
      callNumber = settings.primaryCallNumber || phone;
      bookingCta = settings.bookingCta || bookingCta;
      serviceRegion =
        settings.primaryServiceRegion || serviceRegion;
    }
  } catch (error) {
    console.error(
      "Failed to load emergency assistance settings:",
      error
    );
  }

  const phoneHref = `tel:${callNumber.replace(/[^\d+]/g, "")}`;

  return (
    <section
      aria-labelledby="emergency-assistance-heading"
      className="relative overflow-hidden bg-[#061A2B]"
    >
      {/* Background technical lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
      >
        <div className="absolute left-[8%] top-0 h-full w-px bg-white/5" />
        <div className="absolute left-[30%] top-0 h-full w-px bg-white/5" />
        <div className="absolute left-[72%] top-0 h-full w-px bg-white/5" />
        <div className="absolute right-[8%] top-0 h-full w-px bg-white/5" />
      </div>

      <div
        aria-hidden="true"
        className="absolute -right-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#0D6E91]/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="relative overflow-hidden border border-[#A8BBC8]/15 bg-[#08263D]">
          {/* Yellow edge */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 top-0 w-1 bg-[#FFD400]"
          />

          <div className="grid lg:grid-cols-[1fr_auto]">
            {/* Main message */}
            <div className="px-6 py-7 sm:px-8 sm:py-9 lg:px-11 lg:py-10">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center bg-[#FFD400] text-[#061A2B]">
                    <Zap
                      aria-hidden="true"
                      className="h-3.5 w-3.5 fill-current"
                    />
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFD400]">
                    Immediate Assistance
                  </span>
                </div>

                <span className="hidden h-px w-10 bg-[#A8BBC8]/20 sm:block" />

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A8BBC8]">
                  {serviceRegion}
                </span>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
                <div>
                  <div className="flex items-start gap-4">
                    <BatteryWarning
                      aria-hidden="true"
                      className="mt-1 hidden h-8 w-8 shrink-0 text-[#FFD400] sm:block"
                      strokeWidth={1.4}
                    />

                    <h2
                      id="emergency-assistance-heading"
                      className="max-w-3xl text-3xl font-black leading-[1] tracking-[-0.04em] text-[#F8FAFC] sm:text-4xl lg:text-[46px]"
                    >
                      Stranded with a
                      <span className="text-[#FFD400]">
                        {" "}
                        flat battery?
                      </span>
                    </h2>
                  </div>

                  <p className="mt-5 max-w-2xl text-sm leading-6 text-[#A8BBC8] sm:text-base sm:leading-7">
                    Get mobile battery assistance at your vehicle&apos;s
                    location. Call us or book a service to discuss what
                    your vehicle needs.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#F8FAFC]">
                      <MapPin
                        aria-hidden="true"
                        className="h-4 w-4 text-[#FFD400]"
                      />
                      <span>Mobile service</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-[#F8FAFC]">
                      <BatteryWarning
                        aria-hidden="true"
                        className="h-4 w-4 text-[#FFD400]"
                      />
                      <span>Battery assistance</span>
                    </div>
                  </div>
                </div>

                {/* Phone detail */}
                <div className="border-t border-[#A8BBC8]/15 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#A8BBC8]">
                    Speak with us
                  </p>

                  <a
                    href={phoneHref}
                    className="mt-2 block text-lg font-black tracking-[-0.02em] text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
                  >
                    {phone}
                  </a>

                  <p className="mt-1 text-xs text-[#A8BBC8]">
                    Discuss your vehicle and location.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-center border-t border-[#A8BBC8]/15 bg-[#061A2B] p-5 sm:flex-row sm:items-center lg:w-[360px] lg:flex-col lg:border-l lg:border-t-0 lg:p-7">
              <a
                href={phoneHref}
                className="group flex min-h-[58px] items-center justify-between gap-5 bg-[#FFD400] px-5 text-sm font-black text-[#061A2B] transition-all duration-300 hover:bg-[#F5B800]"
              >
                <span className="flex items-center gap-3">
                  <Phone
                    aria-hidden="true"
                    className="h-4 w-4"
                    strokeWidth={2.5}
                  />
                  Call Now
                </span>

                <ArrowUpRight
                  aria-hidden="true"
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>

              <Link
                href="/book-service"
                className="group mt-3 flex min-h-[58px] items-center justify-between gap-5 border border-[#A8BBC8]/20 px-5 text-sm font-bold text-[#F8FAFC] transition-all duration-300 hover:border-[#FFD400]/60 hover:bg-[#08263D]"
              >
                <span className="flex items-center gap-3">
                  <CalendarCheck
                    aria-hidden="true"
                    className="h-4 w-4 text-[#FFD400]"
                  />
                  {bookingCta}
                </span>

                <ArrowUpRight
                  aria-hidden="true"
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>

              <p className="mt-4 text-center text-[9px] font-semibold uppercase tracking-[0.15em] text-[#A8BBC8]">
                Vehicle details &amp; location help us understand your
                situation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}