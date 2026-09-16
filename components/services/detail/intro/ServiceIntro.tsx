import { ArrowDownRight } from "lucide-react";

interface ServiceIntroProps {
  title: string;
  description?: string;
}

export default function ServiceIntro({
  title,
  description,
}: ServiceIntroProps) {
  if (!description?.trim()) {
    return null;
  }

  return (
    <section className="relative bg-[#F8FAFC] text-[#061A2B]">
      <div className="mx-auto max-w-[1420px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.38fr_0.62fr] lg:gap-20">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#061A2B]/45">
                The Service
              </span>
            </div>

            <div className="mt-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#061A2B]/10">
              <ArrowDownRight
                className="h-4 w-4"
                strokeWidth={1.8}
              />
            </div>
          </div>

          <div>
            <p className="max-w-4xl text-2xl font-medium leading-[1.25] tracking-[-0.035em] sm:text-3xl lg:text-[2.7rem]">
              {description}
            </p>

            <p className="mt-8 max-w-xl text-sm leading-7 text-[#061A2B]/55 sm:text-base">
              {title} is one of the services available through Car Battery
              Service. Service details and availability depend on the vehicle
              and situation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}