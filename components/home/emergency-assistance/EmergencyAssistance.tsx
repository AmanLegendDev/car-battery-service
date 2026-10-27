
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  MapPin,
  Phone,
  Wrench,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

export default async function EmergencyAssistance() {
  let phone = "+61 467 037 886";
  let callNumber = "+61 467 037 886";
  let bookingCta = "Book a Service";
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
      "Failed to load automotive assistance settings:",
      error
    );
  }

  const phoneHref = `tel:${callNumber.replace(/[^\d+]/g, "")}`;

  return (
    <section
      aria-labelledby="emergency-assistance-heading"
      className="relative isolate overflow-hidden bg-[#061A2B] text-[#F8FAFC]"
    >
      {/* Ambient automotive atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_45%,rgba(13,110,145,0.18),transparent_45%)]" />

        <div className="absolute inset-y-0 left-[8%] w-px bg-white/[0.035]" />
        <div className="absolute inset-y-0 left-[30%] w-px bg-white/[0.035]" />
        <div className="absolute inset-y-0 right-[8%] w-px bg-white/[0.035]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
        <div className="relative overflow-hidden rounded-[24px] border border-white/[0.10] bg-[#08263D] shadow-[0_24px_80px_rgba(0,0,0,0.20)] sm:rounded-[30px]">
          {/* Yellow brand accent */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1 bg-[#FFD400] sm:w-1.5"
          />

          <div className="grid lg:grid-cols-[minmax(0,1fr)_330px]">
            {/* Main message */}
            <div className="relative px-6 py-8 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
              {/* Eyebrow and service region */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                <span className="inline-flex items-center gap-2.5 rounded-full border border-[#FFD400]/20 bg-[#FFD400]/[0.07] px-3 py-2">
                  <Wrench
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-[#FFD400]"
                  />

                  <span className="text-[9px] font-extrabold uppercase tracking-[0.17em] text-[#FFD400] sm:text-[10px]">
                    Automotive Assistance
                  </span>
                </span>

                <span className="inline-flex items-center gap-2 text-[10px] font-semibold text-[#A8BBC8]">
                  <MapPin
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-[#FFD400]"
                  />
                  {serviceRegion}
                </span>
              </div>

              {/* Heading and description */}
              <div className="mt-7 flex items-start gap-4 sm:mt-8 sm:gap-5">
                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#FFD400]/20 bg-[#FFD400]/[0.08] sm:flex">
                  <Wrench
                    aria-hidden="true"
                    className="h-6 w-6 text-[#FFD400]"
                    strokeWidth={1.7}
                  />
                </div>

                <div>
                  <h2
                    id="emergency-assistance-heading"
                    className="max-w-3xl text-[clamp(1.8rem,5vw,3.25rem)] font-black leading-[1.05] tracking-[-0.045em] text-[#F8FAFC]"
                  >
                    Need automotive
                    <span className="mt-1 block text-[#FFD400]">
                      assistance?
                    </span>
                  </h2>

                  <p className="mt-4 max-w-2xl text-sm leading-6 text-[#B5C5D0] sm:mt-5 sm:text-base sm:leading-7">
                    From vehicle concerns to service enquiries, Rapid
                    Auto Services helps you take the next step. Contact
                    our team to discuss your vehicle&apos;s needs,
                    available services and booking options.
                  </p>
                </div>
              </div>

              {/* Supporting information */}
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-3 sm:mt-7 sm:gap-x-7">
                <li className="flex items-center gap-2 text-xs font-semibold text-[#E5EDF2]">
                  <CheckCircle2
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-[#FFD400]"
                  />
                  Personalised service enquiries
                </li>

                <li className="flex items-center gap-2 text-xs font-semibold text-[#E5EDF2]">
                  <CheckCircle2
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-[#FFD400]"
                  />
                  Availability confirmation
                </li>
              </ul>

              {/* Contact details */}
              <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-white/[0.09] pt-5 sm:mt-8 sm:pt-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
                  <Phone
                    aria-hidden="true"
                    className="h-4 w-4 text-[#FFD400]"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8FA5B3]">
                    Speak with our team
                  </p>

                  <a
                    href={phoneHref}
                    aria-label={`Call ${phone}`}
                    className="mt-1 inline-block text-base font-extrabold tracking-[-0.02em] text-[#F8FAFC] transition-colors hover:text-[#FFD400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] sm:text-lg"
                  >
                    {phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Conversion panel */}
            <div className="relative flex flex-col justify-center gap-3 border-t border-white/[0.09] bg-[#061A2B]/70 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-8">
              <div className="mb-2">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#FFD400]">
                  Let&apos;s get started
                </p>

                <p className="mt-2 text-sm leading-6 text-[#A8BBC8]">
                  Tell us about your vehicle and location so our team
                  can discuss suitable service options.
                </p>
              </div>

              <a
                href={phoneHref}
                aria-label={`Call Rapid Auto Services on ${phone}`}
                className="group flex min-h-[56px] items-center justify-between gap-3 rounded-xl bg-[#FFD400] px-4 text-sm font-extrabold text-[#061A2B] shadow-[0_10px_30px_rgba(255,212,0,0.10)] transition-colors hover:bg-[#F5B800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061A2B]"
              >
                <span className="flex items-center gap-3">
                  <Phone
                    aria-hidden="true"
                    className="h-4 w-4"
                  />
                  Call Our Team
                </span>

                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1"
                />
              </a>

              <Link
                href="/book-service"
                className="group flex min-h-[56px] items-center justify-between gap-3 rounded-xl border border-white/[0.14] bg-white/[0.025] px-4 text-sm font-bold text-[#F8FAFC] transition-colors hover:border-[#FFD400]/50 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
              >
                <span className="flex items-center gap-3">
                  <CalendarCheck
                    aria-hidden="true"
                    className="h-4 w-4 text-[#FFD400]"
                  />
                  {bookingCta}
                </span>

                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-[#FFD400] transition-transform group-hover:translate-x-1"
                />
              </Link>

              <p className="mt-2 text-[10px] leading-5 text-[#8FA5B3]">
                Contact us to confirm available services and appointment
                details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
