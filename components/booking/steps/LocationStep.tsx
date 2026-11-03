
"use client";

import {
  MapPin,
  MapPinned,
  Home,
  Info,
} from "lucide-react";

import DateTimeStep from "./DateTimeStep";

import type {
  BookingLocationData,
  BookingDateTimeData,
} from "@/lib/booking/booking.types";

import type {
  PublicAvailabilityDay,
} from "@/lib/booking/booking.availability";

interface LocationStepProps {
  location: BookingLocationData;
  appointment: BookingDateTimeData;

  availability: PublicAvailabilityDay[];
  loading: boolean;
  error: string;
  selectedMonth: string;

  onLocationChange: (
    value: Partial<BookingLocationData>
  ) => void;

  onAppointmentChange: (
    value: Partial<BookingDateTimeData>
  ) => void;

  onMonthChange: (month: string) => void;
  onDateSelect: (date: string) => void;
  onTimeSelect: (start: string, end: string) => void;
  onRetry: () => void;
}

const SERVICE_AREAS = [
  "Wyndham Vale",
  "Werribee",
  "Hoppers Crossing",
  "Tarneit",
  "Point Cook",
  "Eynesbury",
  "Melton",
  "Geelong",
  "Lara",
  "Melbourne",
  "Corio",
  "Altona",
  "Deer Park",
  "Manor Lakes",
  "Altona North",
  "Little River",
  "Point Wilson",
  "Williamstown",
  "Caroline Springs",
  "Williams Landing",
];

const inputClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-[#08263D] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-[#6F8796] focus:border-[#0D6E91] focus:ring-2 focus:ring-[#0D6E91]/20";

const labelClass =
  "text-sm font-semibold text-[#DCE7EE]";

export default function LocationStep({
  location,
  appointment,
  availability,
  loading,
  error,
  selectedMonth,
  onLocationChange,
  onAppointmentChange,
  onMonthChange,
  onDateSelect,
  onTimeSelect,
  onRetry,
}: LocationStepProps) {
  return (
    <div className="space-y-10">
      {/* STEP HEADER */}
      <div>
        <p className="text-sm font-semibold text-[#FFD400]">
          Step 4 of 4
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          Service location & appointment
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#A8BBC8]">
          Enter where your vehicle is located, then
          choose your preferred service date and time.
        </p>
      </div>

      {/* LOCATION DETAILS */}
      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D6E91]/15 text-[#FFD400]">
            <MapPin size={20} />
          </div>

          <div>
            <h3 className="font-bold text-white">
              Where should we come?
            </h3>

            <p className="text-xs text-[#6F8796]">
              Enter your vehicle&apos;s service location.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* STREET ADDRESS */}
          <div>
            <label className={labelClass}>
              Street address *
            </label>

            <input
              type="text"
              value={location.address}
              onChange={(event) =>
                onLocationChange({
                  address: event.target.value,
                })
              }
              placeholder="e.g. 25 Example Street"
              autoComplete="street-address"
              className={inputClass}
            />
          </div>

          {/* SUBURB + POSTCODE */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>
                Suburb *
              </label>

              <input
                type="text"
                value={location.suburb}
                onChange={(event) =>
                  onLocationChange({
                    suburb: event.target.value,
                  })
                }
                placeholder="e.g. Werribee"
                autoComplete="address-level2"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Postcode *
              </label>

              <input
                type="text"
                inputMode="numeric"
                value={location.postcode}
                onChange={(event) =>
                  onLocationChange({
                    postcode: event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 4),
                  })
                }
                placeholder="e.g. 3030"
                maxLength={4}
                autoComplete="postal-code"
                className={inputClass}
              />
            </div>
          </div>

          {/* SERVICE AREA */}
          <div>
            <label className={labelClass}>
              Service area *
            </label>

            <div className="relative">
              <MapPinned
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6F8796]"
              />

              <select
                required
                value={location.serviceArea}
                onChange={(event) =>
                  onLocationChange({
                    serviceArea: event.target.value,
                  })
                }
                className={`${inputClass} appearance-none pl-11`}
              >
                <option value="" disabled>
                  Select your service area
                </option>

                {SERVICE_AREAS.map((area) => (
                  <option
                    key={area}
                    value={area}
                    className="bg-[#08263D] text-white"
                  >
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ACCESS INSTRUCTIONS */}
          <div>
            <label className={labelClass}>
              Access instructions
              <span className="ml-2 font-normal text-[#6F8796]">
                (Optional)
              </span>
            </label>

            <textarea
              value={location.accessNotes}
              onChange={(event) =>
                onLocationChange({
                  accessNotes: event.target.value,
                })
              }
              placeholder="e.g. Vehicle is parked in the underground car park. Please call on arrival."
              rows={3}
              maxLength={500}
              className={`${inputClass} resize-y`}
            />

            <p className="mt-1 text-right text-xs text-[#6F8796]">
              {location.accessNotes.length}/500
            </p>
          </div>
        </div>

        {/* LOCATION INFO */}
        <div className="mt-5 flex gap-3 rounded-2xl border border-[#0D6E91]/20 bg-[#0D6E91]/10 p-4">
          <Info
            size={18}
            className="mt-0.5 shrink-0 text-[#FFD400]"
          />

          <p className="text-xs leading-5 text-[#A8BBC8]">
            Please provide an accurate service address so
            our team can reach your vehicle without delays.
          </p>
        </div>
      </section>

      {/* APPOINTMENT */}
      <section className="border-t border-white/10 pt-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D6E91]/15 text-[#FFD400]">
            <Home size={20} />
          </div>

          <div>
            <h3 className="font-bold text-white">
              Choose your appointment
            </h3>

            <p className="text-xs text-[#6F8796]">
              Select an available date and time.
            </p>
          </div>
        </div>

        <DateTimeStep
          availability={availability}
          loading={loading}
          error={error}
          selectedDate={appointment.date}
          selectedStartTime={appointment.startTime}
          selectedEndTime={appointment.endTime}
          selectedMonth={selectedMonth}
          onMonthChange={onMonthChange}
          onDateSelect={onDateSelect}
          onTimeSelect={(start, end) =>
            onTimeSelect(start, end)
          }
          onRetry={onRetry}
        />
      </section>
    </div>
  );
}
