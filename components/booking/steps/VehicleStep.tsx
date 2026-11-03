
"use client";

import type { BookingVehicleData } from "@/lib/booking/booking.types";

interface VehicleStepProps {
  value: BookingVehicleData;
  onChange: (value: Partial<BookingVehicleData>) => void;
}

const REGISTRATION_STATES = [
  "ACT",
  "NSW",
  "NT",
  "QLD",
  "SA",
  "TAS",
  "VIC",
  "WA",
] as const;

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none transition placeholder:text-[#667E8D] focus:border-[#FFD400]/60 focus:bg-white/[0.07]";

export default function VehicleStep({
  value,
  onChange,
}: VehicleStepProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#FFD400]">
        Step 1 of 4
      </p>

      <h2 className="mt-2 text-2xl font-black">
        Tell us about your vehicle
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A8BBC8]">
        Provide your vehicle details so our team can
        understand which vehicle needs assistance.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">

        {/* REGISTRATION NUMBER */}
        <label className="block">
          <span className="text-sm font-semibold">
            Registration Number
            <span className="ml-2 text-xs font-normal text-[#A8BBC8]">
              (Optional)
            </span>
          </span>

          <input
            type="text"
            value={value.registrationNumber}
            onChange={(event) =>
              onChange({
                registrationNumber:
                  event.target.value.toUpperCase(),
              })
            }
            placeholder="e.g. ABC123"
            autoComplete="off"
            className={inputClass}
          />
        </label>

        {/* REGISTRATION STATE */}
        <label className="block">
          <span className="text-sm font-semibold">
            Registration State *
          </span>

          <select
            required
            value={value.registrationState}
            onChange={(event) =>
              onChange({
                registrationState:
                  event.target.value as BookingVehicleData["registrationState"],
              })
            }
            className={`${inputClass} cursor-pointer`}
          >
            {REGISTRATION_STATES.map((state) => (
              <option
                key={state}
                value={state}
                className="bg-[#08263D] text-white"
              >
                {state}
              </option>
            ))}
          </select>
        </label>

        {/* VEHICLE MAKE */}
        <label className="block">
          <span className="text-sm font-semibold">
            Vehicle Make *
          </span>

          <input
            type="text"
            value={value.make}
            onChange={(event) =>
              onChange({ make: event.target.value })
            }
            placeholder="e.g. Toyota"
            className={inputClass}
          />
        </label>

        {/* VEHICLE MODEL */}
        <label className="block">
          <span className="text-sm font-semibold">
            Vehicle Model *
          </span>

          <input
            type="text"
            value={value.model}
            onChange={(event) =>
              onChange({ model: event.target.value })
            }
            placeholder="e.g. Corolla"
            className={inputClass}
          />
        </label>
      </div>

      {/* ADDITIONAL VEHICLE NOTES */}
      <label className="mt-8 block">
        <span className="text-sm font-semibold">
          Additional Vehicle Notes
          <span className="ml-2 text-xs font-normal text-[#A8BBC8]">
            (Optional)
          </span>
        </span>

        <textarea
          value={value.notes}
          onChange={(event) =>
            onChange({ notes: event.target.value })
          }
          rows={4}
          placeholder="Any additional information about your vehicle?"
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#667E8D] focus:border-[#FFD400]/60"
        />
      </label>

      <p className="mt-4 text-xs leading-5 text-[#A8BBC8]">
        Fields marked with * are required. Your registration
        number is optional.
      </p>
    </div>
  );
}
