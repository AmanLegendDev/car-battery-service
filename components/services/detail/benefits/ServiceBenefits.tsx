import {
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

interface ServiceBenefitsProps {
  items?: string[];
}

export default function ServiceBenefits({
  items,
}: ServiceBenefitsProps) {
  const benefits = items?.filter(
    (item) => typeof item === "string" && item.trim(),
  );

  if (!benefits?.length) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#061A2B] text-[#F8FAFC]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-180px] top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#0D6E91]/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-[1420px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.4fr_0.6fr] lg:gap-24">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                Why It Matters
              </span>
            </div>

            <h2 className="mt-6 max-w-md text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Built around the service you need.
            </h2>

            <p className="mt-7 max-w-sm text-sm leading-7 text-white/45">
              Key benefits configured for this service are shown here.
            </p>
          </div>

          <div className="border-t border-white/[0.1]">
            {benefits.map((benefit, index) => (
              <div
                key={`${benefit}-${index}`}
                className="group grid gap-5 border-b border-white/[0.1] py-7 sm:grid-cols-[70px_1fr_auto] sm:items-center sm:gap-7 sm:py-9"
              >
                <span className="text-sm font-bold tracking-[0.08em] text-[#FFD400]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.03] text-[#FFD400] transition-all duration-300 group-hover:border-[#FFD400]/30 group-hover:bg-[#FFD400]/10">
                    <CheckCircle2
                      className="h-4 w-4"
                      strokeWidth={1.8}
                    />
                  </span>

                  <p className="text-base font-medium leading-6 text-white/80 sm:text-lg">
                    {benefit}
                  </p>
                </div>

                <span className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/[0.1] transition-all duration-300 group-hover:rotate-45 group-hover:border-[#FFD400]/30 sm:flex">
                  <ArrowUpRight
                    className="h-4 w-4 text-white/55"
                    strokeWidth={1.8}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}