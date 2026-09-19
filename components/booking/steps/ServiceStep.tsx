"use client";

import {
  BatteryCharging,
  Check,
} from "lucide-react";

import type {
  BookingServiceData,
} from "@/lib/booking/booking.types";

interface Service {
  id: string;
  title: string;
  shortDescription: string;
}

interface ServiceStepProps {
  services: Service[];
  value: BookingServiceData;
  onChange: (
    value: Partial<BookingServiceData>
  ) => void;
}

export default function ServiceStep({
  services,
  value,
  onChange,
}: ServiceStepProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#FFD400]">
        Step 2
      </p>

      <h2 className="mt-2 text-2xl font-black">
        What service do you need?
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#A8BBC8]">
        Select the service that best matches
        what you need at your vehicle's
        location.
      </p>

      <div className="mt-8 grid gap-4">
        {services.map((service) => {
          const selected =
            value.serviceId === service.id;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() =>
                onChange({
                  serviceId: service.id,
                  serviceName: service.title,
                })
              }
              className={[
                "relative rounded-2xl border p-5 text-left transition",
                selected
                  ? "border-[#FFD400] bg-[#FFD400]/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]",
              ].join(" ")}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0D6E91]/20 text-[#FFD400]">
                  <BatteryCharging
                    size={22}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-bold text-white">
                      {service.title}
                    </h3>

                    {selected && (
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
                        <Check size={14} />
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm leading-6 text-[#A8BBC8]">
                    {service.shortDescription}
                  </p>
                </div>
              </div>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() =>
            onChange({
              serviceId: "not-sure",
              serviceName:
                "Not sure — I need help",
            })
          }
          className={[
            "rounded-2xl border p-5 text-left transition",
            value.serviceId === "not-sure"
              ? "border-[#FFD400] bg-[#FFD400]/10"
              : "border-white/10 bg-white/[0.03] hover:border-white/20",
          ].join(" ")}
        >
          <h3 className="font-bold">
            Not sure — I need help
          </h3>

          <p className="mt-1 text-sm text-[#A8BBC8]">
            Choose this if you are unsure which
            service you need.
          </p>
        </button>
      </div>
    </div>
  );
}