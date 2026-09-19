"use client";
import type { ReactNode } from "react";
import {
  CalendarDays,
  Car,
  CheckCircle2,
  MapPin,
  Pencil,
  Wrench,
} from "lucide-react";

import type {
  BookingFormData,
} from "@/lib/booking/booking.types";

interface ReviewStepProps {
  booking: BookingFormData;
  onEdit: (
    step: number
  ) => void;
  termsAccepted: boolean;
  onTermsChange: (
    value: boolean
  ) => void;
}

function formatDate(
  value: string
) {
  if (!value) return "Not selected";

  return new Intl.DateTimeFormat(
    "en-AU",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(
    new Date(
      `${value}T00:00:00`
    )
  );
}

function Section({
  icon,
  title,
  step,
  onEdit,
  children,
}: {
  icon: ReactNode;
  title: string;
  step: number;
  onEdit: (
    step: number
  ) => void;
 children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD400]/10 text-[#FFD400]">
            {icon}
          </div>

          <h3 className="font-bold">
            {title}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => onEdit(step)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFD400] hover:text-[#F5B800]"
        >
          <Pencil size={13} />
          Edit
        </button>
      </div>

      <div className="mt-5">
        {children}
      </div>
    </section>
  );
}

export default function ReviewStep({
  booking,
  onEdit,
  termsAccepted,
  onTermsChange,
}: ReviewStepProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#FFD400]">
        Step 5
      </p>

      <h2 className="mt-2 text-2xl font-black">
        Review your request
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#A8BBC8]">
        Check everything carefully before
        submitting your booking request.
      </p>

      <div className="mt-8 space-y-4">
        <Section
          icon={<Car size={19} />}
          title="Vehicle"
          step={1}
          onEdit={onEdit}
        >
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <Info
              label="Registration"
              value={
                booking.vehicle
                  .registrationNumber
              }
            />

            <Info
              label="Vehicle"
              value={`${booking.vehicle.make} ${booking.vehicle.model}`}
            />

            <Info
              label="Year"
              value={
                booking.vehicle.year
              }
            />

            <Info
              label="Fuel"
              value={
                booking.vehicle
                  .fuelType ||
                "Not provided"
              }
            />

            <Info
              label="Issue"
              value={
                booking.vehicle.issue ||
                "Not provided"
              }
            />
          </div>
        </Section>

        <Section
          icon={<Wrench size={19} />}
          title="Service"
          step={2}
          onEdit={onEdit}
        >
          <p className="font-semibold">
            {booking.service.serviceName}
          </p>
        </Section>

        <Section
          icon={<CalendarDays size={19} />}
          title="Date & Time"
          step={3}
          onEdit={onEdit}
        >
          <p className="font-semibold">
            {formatDate(
              booking.appointment.date
            )}
          </p>

          <p className="mt-2 text-sm text-[#A8BBC8]">
            {booking.appointment.startTime} –{" "}
            {booking.appointment.endTime}
          </p>
        </Section>

        <Section
          icon={<MapPin size={19} />}
          title="Contact & Location"
          step={4}
          onEdit={onEdit}
        >
          <div className="space-y-2 text-sm">
            <p className="font-semibold">
              {booking.customer.fullName}
            </p>

            <p className="text-[#A8BBC8]">
              {booking.customer.phone}
            </p>

            {booking.customer.email && (
              <p className="text-[#A8BBC8]">
                {booking.customer.email}
              </p>
            )}

            <div className="border-t border-white/10 pt-3">
              <p>
                {booking.location.address}
              </p>

              <p className="text-[#A8BBC8]">
                {booking.location.suburb},{" "}
                {booking.location.state}{" "}
                {booking.location.postcode}
              </p>
            </div>
          </div>
        </Section>
      </div>

      <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(event) =>
            onTermsChange(
              event.target.checked
            )
          }
          className="mt-1 h-4 w-4 accent-[#FFD400]"
        />

        <span className="text-sm leading-6 text-[#A8BBC8]">
          I confirm that the information
          provided above is correct and I
          agree to the{" "}
          <a
            href="/terms"
            target="_blank"
            className="font-semibold text-white underline decoration-[#FFD400]"
          >
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            target="_blank"
            className="font-semibold text-white underline decoration-[#FFD400]"
          >
            Privacy Policy
          </a>
          .
        </span>
      </label>

      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#FFD400]/10 bg-[#FFD400]/5 p-4">
        <CheckCircle2
          className="shrink-0 text-[#FFD400]"
          size={19}
        />

        <p className="text-xs leading-5 text-[#A8BBC8]">
          Your selected date and time will be
          checked again when the request is
          submitted.
        </p>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#6F8796]">
        {label}
      </p>

      <p className="mt-1 font-medium text-white">
        {value || "Not provided"}
      </p>
    </div>
  );
}