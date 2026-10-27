
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Phone,
  Wrench,
} from "lucide-react";

interface FAQsListingCTAProps {
  businessName: string;
  phone: string;
}

export default function FAQsListingCTA({
  businessName,
  phone,
}: FAQsListingCTAProps) {
  const phoneHref = phone.trim()
    ? `tel:${phone.replace(/[^\d+]/g, "")}`
    : null;

  return (
    <section className="relative isolate overflow-hidden bg-[#061A2B] text-white">
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#0D6E91]/20 blur-[130px]" />

        <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-[#FFD400]/[0.07] blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* CTA content */}
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
          {/* Text */}
          <div className="max-w-3xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFD400]">
                Still need help?
              </span>
            </div>

            <h2 className="text-[clamp(2.2rem,5vw,4.8rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
              Your vehicle.
              <br />

              <span className="text-white/35">
                The right support.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
              Still have questions? Contact{" "}
              <span className="font-semibold text-white/80">
                {businessName}
              </span>{" "}
              to discuss your vehicle, understand the available
              service options and find the right next step.
            </p>

            <div className="mt-6 flex items-center gap-3 text-xs leading-5 text-white/40">
              <Wrench
                size={16}
                className="shrink-0 text-[#FFD400]"
                aria-hidden="true"
              />

              <span>
                Clear information to help you make an informed decision.
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row lg:min-w-[210px] lg:flex-col">
            {phoneHref ? (
              <a
                href={phoneHref}
                aria-label={`Call ${businessName}`}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-6 text-sm font-bold text-[#061A2B] transition-colors hover:bg-[#F5B800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061A2B]"
              >
                <Phone size={16} aria-hidden="true" />

                Call Now

                <ArrowRight
                  size={15}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>
            ) : null}

            <Link
              href="/services"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white transition-colors hover:border-white/25 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              Explore Services

              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>

            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-white/60 transition-colors hover:text-[#FFD400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              Contact Us

              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-12 border-t border-white/10 pt-5">
          <p className="text-xs leading-6 text-white/35">
            Have a question that is not covered in our FAQs?
            Get in touch to discuss your enquiry and the services
            available for your vehicle.
          </p>
        </div>
      </div>
    </section>
  );
}
