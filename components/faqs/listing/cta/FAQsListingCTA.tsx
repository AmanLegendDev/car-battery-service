import Link from "next/link";
import {
  ArrowRight,
  Phone,
} from "lucide-react";

interface FAQsListingCTAProps {
  businessName: string;
  phone: string;
}

export default function FAQsListingCTA({
  businessName,
  phone,
}: FAQsListingCTAProps) {
  const phoneHref = phone
    ? `tel:${phone.replace(/[^\d+]/g, "")}`
    : null;

  return (
    <section className="relative overflow-hidden bg-[#061A2B] text-white">
      {/* Atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
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

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
          {/* Content */}
          <div className="max-w-3xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFD400]">
                Still need help?
              </span>
            </div>

            <h2 className="text-[clamp(2.2rem,5vw,4.8rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
              Get a direct answer
              <span className="text-white/35">
                {" "}
                for your vehicle.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/50 sm:text-base sm:leading-8">
              If you still have questions, contact{" "}
              {businessName} directly about your battery
              service needs.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            {phoneHref ? (
              <a
                href={phoneHref}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-6 text-sm font-bold text-[#061A2B] transition hover:bg-[#F5B800]"
              >
                <Phone size={16} />

                Call now

                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>
            ) : null}

            <Link
              href="/services"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/[0.08]"
            >
              View services

              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}