
"use client";

import type { ReactNode } from "react";

import {
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  Image as ImageIcon,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Video,
  Wrench,
  UserRound,
} from "lucide-react";

import type {
  BookingFormData,
} from "@/lib/booking/booking.types";

interface ReviewStepProps {
  booking: BookingFormData;
  onEdit: (step: number) => void;
  termsAccepted: boolean;
  onTermsChange: (value: boolean) => void;
}

const valueOrFallback = (
  value?: string | null
) => {
  return value?.trim() || "Not provided";
};

function formatDate(value: string) {
  if (!value) return "Not selected";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
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
  onEdit: (step: number) => void;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFD400]/10 text-[#FFD400]">
            {icon}
          </div>

          <h3 className="font-bold text-white">
            {title}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => onEdit(step)}
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-[#FFD400] transition hover:text-[#F5B800]"
        >
          <Pencil size={13} />
          Edit
        </button>
      </div>

      <div className="space-y-5 p-5">
        {children}
      </div>
    </section>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#6F8796]">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium leading-6 text-white">
        {valueOrFallback(value)}
      </p>
    </div>
  );
}

function MediaPreview({
  images,
  video,
}: {
  images: string[];
  video: string;
}) {
  const validImages = images.filter(Boolean);

  if (validImages.length === 0 && !video) {
    return (
      <p className="text-sm text-[#8298A7]">
        No photos or video uploaded.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {validImages.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <ImageIcon size={16} className="text-[#FFD400]" />

            <p className="text-xs font-bold text-white">
              Uploaded Photos ({validImages.length})
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {validImages.map((src, index) => (
              <a
                key={`${src}-${index}`}
                href={src}
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#061A2B]"
              >
                <img
                  src={src}
                  alt={`Uploaded vehicle photo ${index + 1}`}
                  loading="lazy"
                  className="h-32 w-full object-cover transition duration-300 group-hover:scale-105"
                />

                <span className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1.5 text-[10px] font-medium text-white">
                  Photo {index + 1}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {video && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Video size={16} className="text-[#FFD400]" />

            <p className="text-xs font-bold text-white">
              Uploaded Video
            </p>
          </div>

          <video
            src={video}
            controls
            playsInline
            preload="metadata"
            className="max-h-72 w-full rounded-xl border border-white/10 bg-black"
          >
            Your browser does not support video playback.
          </video>
        </div>
      )}
    </div>
  );
}

export default function ReviewStep({
  booking,
  onEdit,
  termsAccepted,
  onTermsChange,
}: ReviewStepProps) {
  const vehicle = booking.vehicle;
  const customer = booking.customer;
  const service = booking.service;
  const location = booking.location;
  const appointment = booking.appointment;

  return (
    <div>
      <p className="text-sm font-semibold text-[#FFD400]">
        Final Review
      </p>

      <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
        Review your booking request
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A8BBC8]">
        Check all your vehicle, contact, service, media,
        location and appointment details before submitting.
        You can edit any section if something needs changing.
      </p>

      <div className="mt-8 space-y-4">

        {/* VEHICLE INFORMATION */}
       
{/* VEHICLE INFORMATION */}
<Section
  icon={<Car size={19} />}
  title="Vehicle Information"
  step={1}
  onEdit={onEdit}
>
  <div className="grid gap-4 sm:grid-cols-2">
    <Info
      label="Registration Number"
      value={vehicle.registrationNumber}
    />

    <Info
      label="Registration State"
      value={vehicle.registrationState}
    />

    <Info
      label="Vehicle Make"
      value={vehicle.make}
    />

    <Info
      label="Vehicle Model"
      value={vehicle.model}
    />
  </div>

  <div className="border-t border-white/10 pt-4">
    <Info
      label="Additional Vehicle Notes"
      value={vehicle.notes}
    />
  </div>
</Section>


        {/* CONTACT INFORMATION */}
        <Section
          icon={<UserRound size={19} />}
          title="Contact Information"
          step={2}
          onEdit={onEdit}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <UserRound
                size={17}
                className="mt-1 shrink-0 text-[#8298A7]"
              />
              <Info
                label="Full Name"
                value={customer.fullName}
              />
            </div>

            <div className="flex items-start gap-3">
              <Phone
                size={17}
                className="mt-1 shrink-0 text-[#8298A7]"
              />
              <Info
                label="Mobile Number"
                value={customer.phone}
              />
            </div>

            <div className="flex items-start gap-3 sm:col-span-2">
              <Mail
                size={17}
                className="mt-1 shrink-0 text-[#8298A7]"
              />
              <Info
                label="Email Address"
                value={customer.email || "Not provided (optional)"}
              />
            </div>
          </div>
        </Section>

        {/* SERVICE INFORMATION */}
        <Section
          icon={<Wrench size={19} />}
          title="Selected Service"
          step={2}
          onEdit={onEdit}
        >
          <Info
            label="Service"
            value={service.serviceName}
          />

          <p className="text-xs leading-5 text-[#8298A7]">
            You can change your selected service using the Edit button.
          </p>
        </Section>

        {/* ISSUE DESCRIPTION AND MEDIA */}
        <Section
          icon={<ImageIcon size={19} />}
          title="Issue Description & Media"
          step={3}
          onEdit={onEdit}
        >
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#6F8796]">
              Problem Description
            </p>

            <div className="rounded-xl border border-white/10 bg-[#061A2B]/70 p-4">
              <p className="whitespace-pre-wrap break-words text-sm leading-6 text-white">
                {valueOrFallback(service.issueDescription)}
              </p>
            </div>
          </div>

          <MediaPreview
            images={service.images || []}
            video={service.video || ""}
          />
        </Section>

        {/* LOCATION INFORMATION */}
        <Section
          icon={<MapPin size={19} />}
          title="Service Location"
          step={4}
          onEdit={onEdit}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Info
                label="Street Address"
                value={location.address}
              />
            </div>

            <Info
              label="Suburb"
              value={location.suburb}
            />

            <Info
              label="Postcode"
              value={location.postcode}
            />

            <Info
              label="Service Area"
              value={location.serviceArea}
            />

            <Info
              label="State"
              value={location.state}
            />
          </div>

          <div className="border-t border-white/10 pt-4">
            <Info
              label="Access Notes / Directions"
              value={location.accessNotes}
            />
          </div>
        </Section>

        {/* APPOINTMENT INFORMATION */}
        <Section
          icon={<CalendarDays size={19} />}
          title="Appointment Details"
          step={4}
          onEdit={onEdit}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <CalendarDays
                size={17}
                className="mt-1 shrink-0 text-[#FFD400]"
              />

              <Info
                label="Appointment Date"
                value={formatDate(appointment.date)}
              />
            </div>

            <div className="flex items-start gap-3">
              <Clock3
                size={17}
                className="mt-1 shrink-0 text-[#FFD400]"
              />

              <Info
                label="Appointment Time"
                value={
                  appointment.startTime && appointment.endTime
                    ? `${appointment.startTime} – ${appointment.endTime}`
                    : "Not selected"
                }
              />
            </div>

            <div className="sm:col-span-2">
              <Info
                label="Timezone"
                value={appointment.timezone}
              />
            </div>
          </div>
        </Section>
      </div>

      {/* TERMS AND CONDITIONS */}
      <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(event) =>
            onTermsChange(event.target.checked)
          }
          className="mt-1 h-4 w-4 shrink-0 accent-[#FFD400]"
        />

        <span className="text-sm leading-6 text-[#A8BBC8]">
          I confirm that the information provided above
          is correct and I agree to the{" "}

          <a
            href="/terms"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-white underline decoration-[#FFD400]"
          >
            Terms & Conditions
          </a>

          {" "}and{" "}

          <a
            href="/privacy"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-white underline decoration-[#FFD400]"
          >
            Privacy Policy
          </a>
          .
        </span>
      </label>

      {!termsAccepted && (
        <p className="mt-2 text-xs text-[#A8BBC8]">
          Please accept the terms before submitting your booking.
        </p>
      )}

      {/* SUBMISSION NOTICE */}
      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#FFD400]/10 bg-[#FFD400]/[0.05] p-4">
        <CheckCircle2
          className="mt-0.5 shrink-0 text-[#FFD400]"
          size={19}
        />

        <p className="text-xs leading-5 text-[#A8BBC8]">
          Your selected date and time will be checked again
          when your booking request is submitted.
          Your booking is not confirmed until the server
          successfully accepts your request.
        </p>
      </div>
    </div>
  );
}
