import { ArrowDownRight } from "lucide-react";

interface ServiceProcessStep {
  title: string;
  description: string;
}

interface ServiceProcessProps {
  steps?: ServiceProcessStep[];
}

export default function ServiceProcess({
  steps,
}: ServiceProcessProps) {
  const processSteps = steps?.filter(
    (step) =>
      step &&
      typeof step.title === "string" &&
      step.title.trim(),
  );

  if (!processSteps?.length) {
    return null;
  }

  return (
    <section className="bg-[#061A2B] text-[#F8FAFC]">
      <div className="mx-auto max-w-[1420px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.38fr_0.62fr] lg:gap-24">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                How It Works
              </span>
            </div>

            <h2 className="mt-6 max-w-md text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              A clear path from problem to service.
            </h2>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/45">
              The service process below follows the steps configured for this
              service.
            </p>

            <div className="mt-10 hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 lg:flex">
              <ArrowDownRight
                className="h-4 w-4 text-[#FFD400]"
                strokeWidth={1.8}
              />
            </div>
          </div>

          <div>
            {processSteps.map((step, index) => (
              <div
                key={`${step.title}-${index}`}
                className="group relative border-t border-white/[0.1] py-8 sm:py-10"
              >
                <div className="grid gap-6 sm:grid-cols-[90px_1fr] sm:gap-8">
                  <div>
                    <span className="text-5xl font-semibold tracking-[-0.06em] text-white/[0.12] transition-colors duration-300 group-hover:text-[#FFD400]/50 sm:text-6xl">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.025em] sm:text-2xl">
                      {step.title}
                    </h3>

                    {step.description?.trim() ? (
                      <p className="mt-3 max-w-xl text-sm leading-7 text-white/45 sm:text-base">
                        {step.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}

            <div className="border-t border-white/[0.1]" />
          </div>
        </div>
      </div>
    </section>
  );
}