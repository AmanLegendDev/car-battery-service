import {
  ArrowRight,
  CircleCheck,
} from "lucide-react";

interface ServiceSuitableForProps {
  items?: string[];
}

export default function ServiceSuitableFor({
  items,
}: ServiceSuitableForProps) {
  const suitableItems = items?.filter(
    (item) => typeof item === "string" && item.trim(),
  );

  if (!suitableItems?.length) {
    return null;
  }

  return (
    <section className="bg-[#F8FAFC] text-[#061A2B]">
      <div className="mx-auto max-w-[1420px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mb-14 grid gap-8 lg:grid-cols-[0.55fr_0.45fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#061A2B]/45">
                Is This For You?
              </span>
            </div>

            <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Situations this service is suitable for.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-[#061A2B]/50 lg:ml-auto">
            These situations are based on the service information configured in
            the business system.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[28px] border border-[#061A2B]/10 bg-[#061A2B]/10 sm:grid-cols-2 lg:grid-cols-3">
          {suitableItems.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="group relative bg-[#F8FAFC] p-7 transition-colors duration-300 hover:bg-white sm:p-8 lg:p-9"
            >
              <div className="flex items-start justify-between gap-5">
                <span className="text-[11px] font-bold tracking-[0.12em] text-[#061A2B]/25">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#061A2B]/10 transition-all duration-300 group-hover:border-[#FFD400] group-hover:bg-[#FFD400]">
                  <CircleCheck className="h-4 w-4" strokeWidth={1.8} />
                </span>
              </div>

              <p className="mt-12 max-w-xs text-base font-semibold leading-6 tracking-[-0.015em] text-[#061A2B]/80 sm:text-lg">
                {item}
              </p>

              <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#061A2B]/30">
                <span>Relevant situation</span>

                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.8}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}