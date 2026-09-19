"use client";

import type {
  BookingCustomerData,
  BookingLocationData,
} from "@/lib/booking/booking.types";

interface CustomerStepProps {
  customer: BookingCustomerData;
  location: BookingLocationData;
  onCustomerChange: (
    value: Partial<BookingCustomerData>
  ) => void;
  onLocationChange: (
    value: Partial<BookingLocationData>
  ) => void;
}

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none transition placeholder:text-[#667E8D] focus:border-[#FFD400]/60";

export default function CustomerStep({
  customer,
  location,
  onCustomerChange,
  onLocationChange,
}: CustomerStepProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#FFD400]">
        Step 4
      </p>

      <h2 className="mt-2 text-2xl font-black">
        Where should we come?
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#A8BBC8]">
        Give us the contact and vehicle location
        details for your service request.
      </p>

      <div className="mt-8">
        <h3 className="font-bold">
          Your details
        </h3>

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">
              Full Name *
            </span>

            <input
              value={customer.fullName}
              onChange={(event) =>
                onCustomerChange({
                  fullName:
                    event.target.value,
                })
              }
              placeholder="Your full name"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold">
              Mobile Number *
            </span>

            <input
              value={customer.phone}
              onChange={(event) =>
                onCustomerChange({
                  phone:
                    event.target.value,
                })
              }
              placeholder="+61 ..."
              className={inputClass}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-sm font-semibold">
              Email
              <span className="ml-2 text-xs font-normal text-[#6F8796]">
                Optional
              </span>
            </span>

            <input
              type="email"
              value={customer.email}
              onChange={(event) =>
                onCustomerChange({
                  email:
                    event.target.value,
                })
              }
              placeholder="you@example.com"
              className={inputClass}
            />
          </label>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 pt-8">
        <h3 className="font-bold">
          Vehicle location
        </h3>

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-semibold">
              Street Address *
            </span>

            <input
              value={location.address}
              onChange={(event) =>
                onLocationChange({
                  address:
                    event.target.value,
                })
              }
              placeholder="123 Example Street"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold">
              Suburb *
            </span>

            <input
              value={location.suburb}
              onChange={(event) =>
                onLocationChange({
                  suburb:
                    event.target.value,
                })
              }
              placeholder="Werribee"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold">
              State *
            </span>

            <input
              value={location.state}
              onChange={(event) =>
                onLocationChange({
                  state:
                    event.target.value,
                })
              }
              placeholder="VIC"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold">
              Postcode *
            </span>

            <input
              value={location.postcode}
              onChange={(event) =>
                onLocationChange({
                  postcode:
                    event.target.value,
                })
              }
              placeholder="3030"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold">
              Access / Location Notes
            </span>

            <input
              value={location.accessNotes}
              onChange={(event) =>
                onLocationChange({
                  accessNotes:
                    event.target.value,
                })
              }
              placeholder="Optional"
              className={inputClass}
            />
          </label>
        </div>
      </div>

      <label className="mt-8 block">
        <span className="text-sm font-semibold">
          Additional notes
        </span>

        <textarea
          value={customer.notes}
          onChange={(event) =>
            onCustomerChange({
              notes:
                event.target.value,
            })
          }
          rows={4}
          placeholder="Anything else we should know?"
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none placeholder:text-[#667E8D] focus:border-[#FFD400]/60"
        />
      </label>
    </div>
  );
}