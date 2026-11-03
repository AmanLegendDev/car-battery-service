
import {
  ArrowUpRight,
  BadgeCheck,
  CircleDollarSign,
  MessageCircle,
} from "lucide-react";

interface ServicePricingProps {
  pricing?: {
    type: "fixed" | "from" | "quote";
    amount?: number | null;
    currency?: string;
  } | null;
  serviceTitle: string;
}

export default function ServicePricing({
  pricing,
  serviceTitle,
}: ServicePricingProps) {
  const pricingType = pricing?.type ?? "quote";
  const currency = pricing?.currency || "AUD";

  const hasValidAmount =
    (pricingType === "fixed" || pricingType === "from") &&
    typeof pricing?.amount === "number" &&
    Number.isFinite(pricing.amount) &&
    pricing.amount >= 0;

  const formattedPrice = hasValidAmount
    ? new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency,
      }).format(pricing.amount!)
    : null;

  const isQuote = !hasValidAmount;

  return (
    <section
      aria-labelledby="service-pricing-heading"
      className="relative overflow-hidden bg-[#F8FAFC] px-4 py-16 text-[#061A2B] sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-0 h-[360px] w-[360px] rounded-full bg-[#0D6E91]/[0.07] blur-[110px]"
      />

      <div className="relative mx-auto max-w-[1180px]">
        <div className="overflow-hidden rounded-[28px] border border-[#061A2B]/10 bg-white shadow-[0_20px_70px_rgba(6,26,43,0.07)] sm:rounded-[34px]">
          <div className="grid lg:grid-cols-[1fr_0.85fr]">
            {/* Pricing information */}
            <div className="relative p-6 sm:p-9 lg:p-12">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#FFD400]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.23em] text-[#061A2B]/50">
                  Clear & Simple Pricing
                </span>
              </div>

              <h2
                id="service-pricing-heading"
                className="mt-6 max-w-xl text-3xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-4xl lg:text-5xl"
              >
                Know what to expect before we get started.
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-[#061A2B]/65 sm:text-base sm:leading-8">
                Explore the pricing for {serviceTitle}. Contact our team if
                you need help confirming the right service for your vehicle.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#061A2B]/10 bg-[#F8FAFC] px-4 py-2.5">
                  <BadgeCheck
                    aria-hidden="true"
                    className="h-4 w-4 text-[#0D6E91]"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#061A2B]/65">
                    Professional Service
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-[#061A2B]/10 bg-[#F8FAFC] px-4 py-2.5">
                  <CircleDollarSign
                    aria-hidden="true"
                    className="h-4 w-4 text-[#0D6E91]"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#061A2B]/65">
                    {currency} Pricing
                  </span>
                </div>
              </div>
            </div>

            {/* Price panel */}
            <div className="relative flex flex-col justify-center overflow-hidden bg-[#061A2B] p-6 text-[#F8FAFC] sm:p-9 lg:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#FFD400]/10"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border border-[#FFD400]/10"
              />

              <div className="relative">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#FFD400]" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
                    {pricingType === "fixed"
                      ? "Fixed Service Price"
                      : pricingType === "from"
                        ? "Starting Price"
                        : "Personalised Pricing"}
                  </span>
                </div>

                <div className="mt-7">
                  {hasValidAmount && formattedPrice ? (
                    <>
                      {pricingType === "from" && (
                        <p className="mb-2 text-sm font-medium text-white/55">
                          Starting from
                        </p>
                      )}

                      <p className="break-words text-4xl font-bold tracking-[-0.05em] text-[#FFD400] sm:text-5xl lg:text-[3.5rem]">
                        {formattedPrice}
                      </p>

                      <p className="mt-3 text-xs leading-6 text-white/55">
                        {pricingType === "fixed"
                          ? "Listed service price"
                          : "Starting price for this service"}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-3xl font-bold leading-tight tracking-[-0.04em] text-[#FFD400] sm:text-4xl">
                        Contact for a Quote
                      </p>

                      <p className="mt-3 max-w-sm text-sm leading-7 text-white/60">
                        Get in touch with our team to discuss your vehicle
                        and confirm the service pricing.
                      </p>
                    </>
                  )}
                </div>

                <div className="my-8 h-px bg-white/10" />

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-[#FFD400]">
                    <MessageCircle
                      aria-hidden="true"
                      className="h-5 w-5"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Need help with pricing?
                    </p>

                    <p className="mt-1 text-xs leading-6 text-white/50">
                      Speak with our team about your vehicle and service
                      requirements.
                    </p>
                  </div>
                </div>

                <a
                  href="/contact"
                  className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#FFD400] px-6 text-xs font-bold uppercase tracking-[0.13em] text-[#061A2B] transition-all duration-300 hover:bg-[#F5B800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#061A2B]"
                >
                  Enquire About This Service

                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="h-1 w-full bg-gradient-to-r from-[#FFD400] via-[#0D6E91] to-transparent" />
        </div>
      </div>
    </section>
  );
}
