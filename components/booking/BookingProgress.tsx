"use client";

const STEPS = [
  "Vehicle",
  "Service",
  "Date & Time",
  "Your Details",
  "Review",
];

interface BookingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function BookingProgress({
  currentStep,
}: BookingProgressProps) {
  return (
    <div>
      <div className="mb-4 flex items-end justify-between mt-22">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFD400]">
            Booking request
          </p>

          <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Book a Battery Service
          </h1>
        </div>

        <span className="text-sm text-[#A8BBC8]">
          Step {currentStep} of {STEPS.length}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[#FFD400] transition-all duration-300"
          style={{
            width: `${
              (currentStep / STEPS.length) *
              100
            }%`,
          }}
        />
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {STEPS.map((step, index) => {
          const number = index + 1;
          const active =
            number === currentStep;
          const complete =
            number < currentStep;

          return (
            <div
              key={step}
              className="min-w-0"
            >
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