
"use client";

const STEPS = [
  "Vehicle",
  "Contact & Service",
  "Issue & Media",
  "Location & Time",
];

interface BookingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function BookingProgress({
  currentStep,
  totalSteps,
}: BookingProgressProps) {
  const safeTotalSteps = STEPS.length;
  const activeStep = Math.min(
    Math.max(currentStep, 1),
    safeTotalSteps
  );

  const progress = Math.min(
    (activeStep / safeTotalSteps) * 100,
    100
  );

  return (
    <div>
      <div className="mb-4 mt-22 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFD400]">
            Booking Request
          </p>

          <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Book an Automotive Service
          </h1>
        </div>

        <span className="shrink-0 text-sm text-[#A8BBC8]">
          Step {activeStep} of {safeTotalSteps}
        </span>
      </div>

      <div
        className="h-1.5 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuenow={activeStep}
        aria-valuemin={1}
        aria-valuemax={safeTotalSteps}
        aria-label="Booking progress"
      >
        <div
          className="h-full rounded-full bg-[#FFD400] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {STEPS.map((step, index) => {
          const number = index + 1;
          const active = number === activeStep;
          const complete = number < activeStep;

          return (
            <div key={step} className="min-w-0">
              <div
                className={[
                  "h-1 rounded-full transition",
                  complete || active
                    ? "bg-[#FFD400]"
                    : "bg-white/10",
                ].join(" ")}
              />

              <p
                className={[
                  "mt-2 truncate text-[10px] font-semibold sm:text-xs",
                  active
                    ? "text-white"
                    : complete
                      ? "text-[#FFD400]"
                      : "text-[#6F8796]",
                ].join(" ")}
              >
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
