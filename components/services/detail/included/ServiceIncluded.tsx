import { Check, ArrowUpRight } from "lucide-react";

interface ServiceIncludedProps {
  items?: string[];
}

export default function ServiceIncluded({
  items,
}: ServiceIncludedProps) {
  const includedItems = items?.filter(
    (item) => typeof item === "string" && item.trim(),
  );

  if (!includedItems?.length) {
    return null;
  }

  return (
    <section className="bg-[#F8FAFC] text-[#061A2B]">
      <div className="mx-auto max-w-[1420px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.42fr_0.58fr] lg:gap-24">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#061A2B]/45">
                What's Included
              </span>
            </div>

            <h2 className="mt-6 max-w-md text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Everything listed for this service.
            </h2>

            <p className="mt-6 max-w-sm text-sm leading-7 text-[#061A2B]/50">
              The following items are based on the service information provided
              in the business system.
            </p>
          </div>

          <div className="border-t border-[#061A2B]/10">
            {includedItems.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="group flex items-center gap-5 border-b border-[#061A2B]/10 py-6 sm:py-7"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#061A2B] text-[#FFD400]">
                  <Check className="h-4 w-4" strokeWidth={2.4} />
                </span>

                <p className="flex-1 text-base font-medium leading-6 text-[#061A2B]/80 sm:text-lg">
                  {item}
                </p>

                <span className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#061A2B]/10 transition-all duration-300 group-hover:rotate-45 group-hover:border-[#061A2B]/25 sm:flex">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}