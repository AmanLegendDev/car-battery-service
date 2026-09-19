"use client";

import type {
  BookingVehicleData,
} from "@/lib/booking/booking.types";

import {
  BOOKING_FUEL_TYPES,
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

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
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

        <label className="block">
          <span className="text-sm font-semibold">
            Make *
          </span>

          <input
            value={value.make}
            onChange={(event) =>
              onChange({
                make: event.target.value,
              })
            }
            placeholder="Toyota"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold">
            Model *
          </span>

          <input
            value={value.model}
            onChange={(event) =>
              onChange({
                model: event.target.value,
              })
            }
            placeholder="Corolla"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold">
            Year *
          </span>

          <input
            type="number"
            min={1900}
            max={new Date().getFullYear() + 1}
            value={value.year}
            onChange={(event) =>
              onChange({
                year: event.target.value,
              })
            }
            placeholder="2020"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold">
            Fuel Type
          </span>

          <select
            value={value.fuelType}
            onChange={(event) =>
              onChange({
                fuelType:
                  event.target.value as BookingVehicleData["fuelType"],
              })
            }
            className={inputClass}
          >
            <option
              value=""
              className="bg-[#08263D]"
            >
              Select fuel type
            </option>

            {BOOKING_FUEL_TYPES.map(
              (fuelType) => (
                <option
                  key={fuelType}
                  value={fuelType}
                  className="bg-[#08263D]"
                >
                  {fuelType}
                </option>
              )
            )}
          </select>
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