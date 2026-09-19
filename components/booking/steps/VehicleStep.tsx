"use client";

import type {
  BookingVehicleData,
} from "@/lib/booking/booking.types";

import {
  BOOKING_VEHICLE_ISSUES,
} from "@/lib/booking/booking.constants";

interface VehicleStepProps {
  value: BookingVehicleData;
  onChange: (
    value: Partial<BookingVehicleData>
  ) => void;
}

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none transition placeholder:text-[#667E8D] focus:border-[#FFD400]/60 focus:bg-white/[0.07]";

export default function VehicleStep({
  value,
  onChange,
}: VehicleStepProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#FFD400]">
        Step 1
      </p>

      <h2 className="mt-2 text-2xl font-black">
        Tell us about your vehicle
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A8BBC8]">
        These details help us understand the
        vehicle and the battery issue before
        your service request.
      </p>

      <div className="mt-8">
        <label className="block">
          <span className="text-sm font-semibold">
            Registration Number *
          </span>

          <input
            value={value.registrationNumber}
            onChange={(event) =>
              onChange({
                registrationNumber:
                  event.target.value.toUpperCase(),
              })
            }
            placeholder="ABC123"
            className={inputClass}
          />
        </label>
      </div>

      <div className="mt-8">
        <span className="text-sm font-semibold">
          What's happening?
        </span>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {BOOKING_VEHICLE_ISSUES.map(
            (issue) => {
              const selected =
                value.issue === issue;

              return (
                <button
                  key={issue}
                  type="button"
                  onClick={() =>
                    onChange({
                      issue,
                    })
                  }
                  className={[
                    "rounded-2xl border p-4 text-left text-sm font-semibold transition",
                    selected
                      ? "border-[#FFD400] bg-[#FFD400]/10 text-white"
                      : "border-white/10 bg-white/[0.03] text-[#A8BBC8] hover:border-white/20 hover:text-white",
                  ].join(" ")}
                >
                  {issue}
                </button>
              );
            }
          )}
        </div>
      </div>

      <label className="mt-8 block">
        <span className="text-sm font-semibold">
          Additional vehicle / issue notes
        </span>

        <textarea
          value={value.notes}
          onChange={(event) =>
            onChange({
              notes: event.target.value,
            })
          }
          rows={4}
          placeholder="Anything else we should know?"
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#667E8D] focus:border-[#FFD400]/60"
        />
      </label>
    </div>
  );
}