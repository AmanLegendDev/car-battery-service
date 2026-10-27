
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Phone,
  Wrench,
} from "lucide-react";

interface TestimonialsListingCTAProps {
  businessName: string;
  phone: string;
}

function getPhoneHref(phone: string) {
  const cleanNumber = phone.replace(/[^\d+]/g, "");
  return cleanNumber ? `tel:${cleanNumber}` : null;
}

export default function TestimonialsListingCTA({
  businessName,
  phone,
}: TestimonialsListingCTAProps) {
  const phoneHref = getPhoneHref(phone);

  return (
    <section
      aria-labelledby="testimonials-final-cta-heading"
      className="relative isolate overflow-hidden bg-[#061A2B] text-[#F8FAFC]"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#0D6E91]/25 blur-[130px]" />

        <div className="absolute -right-32 top-0 h-[400px] w-[400px] rounded-full bg-[#FFD400]/[0.07] blur-[130px]" />

        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className="relative mx-auto max-w-[1420px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="relative overflow-hidden rounded-[28px] border border-white/[0.12] bg-gradient-to-br from-[#10354B] via-[#08263D] to-[#061A2B] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:rounded-[34px] sm:p-10 lg:p-14">
          {/* Decorative accent */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/[0.06]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-12 h-48 w-48 rounded-full border border-[#FFD400]/[0.12]"
          />

          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end lg:gap-16">
            {/* Main content */}
            <div className="min-w-0">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFD400] text-[#061A2B]">
                  <Wrench
                    aria-hidden="true"
                    className="h-5 w-5"
                    strokeWidth={1.8}
                  />
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFD400]">
                    Here to Help
                  </p>

                  <p className="mt-1 text-xs text-[#B8C8D2]">
                    {businessName}
                  </p>
                </div>
              </div>

              <h2
                id="testimonials-final-cta-heading"
                className="max-w-4xl text-[clamp(2.5rem,5.5vw,5.25rem)] font-semibold leading-[0.96] tracking-[-0.06em]"
              >
                Your vehicle deserves{" "}
                <span className="text-[#FFD400]">
                  the right care.
                </span>
              </h2>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-[#B8C8D2] sm:text-base sm:leading-8">
                Have questions or need help choosing a service? Contact{" "}
                {businessName} to discuss your vehicle and find out which
                options may suit your needs.
              </p>

              <div className="mt-7 flex items-center gap-3 text-xs text-white/45">
                <span className="h-px w-7 bg-[#FFD400]" />
                Automotive service enquiries
              </div>
            </div>

            {/* Actions */}
            <div className="flex w-full flex-col gap-3 lg:w-[280px]">
              {phoneHref ? (
                <a
                  href={phoneHref}
                  className="group inline-flex min-h-14 items-center justify-between gap-3 rounded-full bg-[#FFD400] px-5 text-sm font-bold text-[#061A2B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F5B800] hover:shadow-[0_14px_34px_rgba(255,212,0,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-4 focus-visible:ring-offset-[#08263D]"
                >
                  <span className="flex items-center gap-3">
                    <Phone
                      aria-hidden="true"
                      className="h-4 w-4"
                      strokeWidth={2}
                    />
                    Call Our Team
                  </span>

                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>
              ) : null}

              <Link
                href="/services"
                className="group inline-flex min-h-14 items-center justify-between gap-3 rounded-full border border-white/[0.14] bg-white/[0.04] px-5 text-sm font-semibold text-white transition-all duration-300 hover:border-[#0D6E91] hover:bg-[#0D6E91]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-4 focus-visible:ring-offset-[#08263D]"
              >
                <span>Explore Our Services</span>

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B] transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4"
                  />
                </span>
              </Link>

              <Link
                href="/contact"
                className="mt-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-xs font-semibold text-[#B8C8D2] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
              >
                Have a question? Contact us
                <ArrowRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                />
              </Link>
            </div>
          </div>

          {/* Bottom strip */}
          <div className="relative mt-10 flex flex-col gap-3 border-t border-white/[0.1] pt-5 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] leading-5 text-white/40">
              Speak with our team about your automotive service needs.
            </p>

            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
              {businessName}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
