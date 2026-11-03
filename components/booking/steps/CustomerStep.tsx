
"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  UserRound,
  Phone,
  Mail,
  Wrench,
  ChevronDown,
  Check,
  Search,
  Sparkles,
} from "lucide-react";

import type {
  BookingCustomerData,
  BookingServiceData,
} from "@/lib/booking/booking.types";

/* =========================================
   TYPES
========================================= */

interface Service {
  id: string;
  title: string;
  shortDescription: string;
}

interface CustomerStepProps {
  customer: BookingCustomerData;
  service: BookingServiceData;
  services: Service[];

  onCustomerChange: (
    value: Partial<BookingCustomerData>
  ) => void;

  onServiceChange: (
    value: Partial<BookingServiceData>
  ) => void;
}

/* =========================================
   STYLES
========================================= */

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#08263D] px-4 text-sm text-white outline-none transition placeholder:text-[#667E8D] focus:border-[#FFD400]/60 focus:ring-2 focus:ring-[#FFD400]/10";

const NOT_SURE_SERVICE = {
  id: "not-sure",
  title: "Not sure — I need help",
  shortDescription:
    "Not sure which service your vehicle needs? Our team can help identify the right solution.",
};

/* =========================================
   COMPONENT
========================================= */

export default function CustomerStep({
  customer,
  service,
  services,
  onCustomerChange,
  onServiceChange,
}: CustomerStepProps) {
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedService = useMemo(() => {
    if (service.serviceId === "not-sure") {
      return NOT_SURE_SERVICE;
    }

    return services.find(
      (item) => item.id === service.serviceId
    );
  }, [services, service.serviceId]);

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return services;

    return services.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.shortDescription.toLowerCase().includes(query)
    );
  }, [services, search]);

  const selectService = (
    id: string,
    title: string
  ) => {
    onServiceChange({
      serviceId: id,
      serviceName: title,
    });

    setDropdownOpen(false);
    setSearch("");
  };

  return (
     <div className="w-full min-w-0 max-w-full">
      {/* HEADER */}

      <p className="text-sm font-semibold text-[#FFD400]">
        Step 2 of 4
      </p>

    <h2 className="mt-2 max-w-full break-words text-2xl font-black leading-tight text-white sm:text-3xl">
  Service & Booking Details
</h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-[#A8BBC8]">
        Select your service, share your contact details and describe the issue.
      </p>

      {/* DIVIDER */}

      <div className="my-9 border-t border-white/10" />

      {/* SERVICE SELECTION */}

      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D6E91]/20 text-[#FFD400]">
            <Wrench size={19} />
          </div>

          <div>
            <h3 className="font-bold text-white">
              Select Your Service
            </h3>

            <p className="mt-0.5 text-xs text-[#8298A7]">
              Choose the service you need.
            </p>
          </div>
        </div>

        {/* DROPDOWN */}

        <div className="relative mt-5">
          <button
            type="button"
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
            onClick={() =>
              setDropdownOpen((current) => !current)
            }
            className={[
  "flex min-h-14 w-full min-w-0 max-w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition",
  dropdownOpen
    ? "border-[#FFD400]/60 bg-[#08263D]"
    : "border-white/10 bg-[#08263D] hover:border-white/20",
].join(" ")}
          >
         <span className="flex min-w-0 flex-1 items-center gap-3">
  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0D6E91]/20 text-[#FFD400]">
    <Wrench size={17} />
  </span>

  <span className="min-w-0 flex-1">
    <span
      className={[
        "block whitespace-normal break-words text-sm font-semibold leading-5 [overflow-wrap:anywhere]",
        selectedService
          ? "text-white"
          : "text-[#8298A7]",
      ].join(" ")}
    >
      {selectedService?.title || "Choose a service"}
    </span>

    <span className="mt-1 block text-[11px] text-[#8298A7]">
      {services.length} services available
    </span>
  </span>
</span>

            <ChevronDown
              size={19}
              className={[
                "shrink-0 text-[#8298A7] transition-transform",
                dropdownOpen ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>

          {/* DROPDOWN PANEL */}

          {dropdownOpen && (
           <div className="absolute left-0 right-0 top-full z-30 mt-2 w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-white/10 bg-[#08263D] shadow-2xl shadow-black/40">
              {/* SEARCH */}

              <div className="border-b border-white/10 p-3">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8298A7]"
                  />

                  <input
                    autoFocus
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search services..."
                    className="h-11 w-full rounded-xl border border-white/10 bg-[#061A2B] pl-10 pr-3 text-sm text-white outline-none placeholder:text-[#667E8D] focus:border-[#FFD400]/50"
                  />
                </div>
              </div>

              {/* SERVICE OPTIONS */}

              <div
                role="listbox"
                aria-label="Available services"
                className="max-h-72 overflow-y-auto p-2"
              >
                {filteredServices.map((item) => {
                  const isSelected =
                    service.serviceId === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() =>
                        selectService(
                          item.id,
                          item.title
                        )
                      }
                      className={[
                        "flex w-full items-start gap-3 rounded-xl p-3 text-left transition",
                        isSelected
                          ? "bg-[#FFD400]/10"
                          : "hover:bg-white/[0.05]",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          isSelected
                            ? "bg-[#FFD400] text-[#061A2B]"
                            : "bg-white/5 text-[#A8BBC8]",
                        ].join(" ")}
                      >
                        {isSelected ? (
                          <Check size={16} />
                        ) : (
                          <Wrench size={15} />
                        )}
                      </span>

   <span className="min-w-0 flex-1">
  <span className="block break-words text-sm font-semibold leading-5 text-white">
    {item.title}
  </span>
</span>

                      {isSelected && (
                        <Check
                          size={17}
                          className="mt-1 shrink-0 text-[#FFD400]"
                        />
                      )}
                    </button>
                  );
                })}

                {filteredServices.length === 0 && (
                  <p className="px-4 py-7 text-center text-sm text-[#8298A7]">
                    No services found. Try another search.
                  </p>
                )}
              </div>

              {/* NOT SURE */}

              <div className="border-t border-white/10 p-2">
                <button
                  type="button"
                  onClick={() =>
                    selectService(
                      NOT_SURE_SERVICE.id,
                      NOT_SURE_SERVICE.title
                    )
                  }
                  className={[
                    "flex w-full items-center gap-3 rounded-xl p-3 text-left transition",
                    service.serviceId === "not-sure"
                      ? "bg-[#FFD400]/10"
                      : "hover:bg-white/[0.05]",
                  ].join(" ")}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFD400]/10 text-[#FFD400]">
                    <Sparkles size={17} />
                  </span>

                  <span className="min-w-0 flex-1">
  <span className="block text-sm font-bold text-white">
    Not sure — I need help
  </span>
</span>

                  {service.serviceId === "not-sure" && (
                    <Check
                      size={17}
                      className="text-[#FFD400]"
                    />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

       {/* SELECTED SERVICE */}

{selectedService && (
  <div className="mt-4 w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-[#FFD400]/25 bg-[#FFD400]/[0.06] p-4">
    <div className="flex w-full min-w-0 items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFD400] text-[#061A2B]">
        <Check size={18} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#FFD400]">
          Service Selected
        </p>

        <h4 className="mt-1 break-words text-sm font-bold leading-5 text-white [overflow-wrap:anywhere]">
          {selectedService.title}
        </h4>
      </div>

      <button
        type="button"
        onClick={() => setDropdownOpen(true)}
        className="shrink-0 text-xs font-semibold text-[#FFD400] hover:underline"
      >
        Change
      </button>
    </div>
  </div>
)}
      </section>

      {/* CONTACT DETAILS */}

      <section className="mt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D6E91]/20 text-[#FFD400]">
            <UserRound size={19} />
          </div>

          <div>
            <h3 className="font-bold text-white">
              Your Contact Details
            </h3>

            <p className="mt-0.5 text-xs text-[#8298A7]">
              So we can confirm your booking.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {/* FULL NAME */}

          <label className="block">
            <span className="text-sm font-semibold text-white">
              Full Name <span className="text-[#FFD400]">*</span>
            </span>

            <input
              type="text"
              autoComplete="name"
              value={customer.fullName}
              onChange={(event) =>
                onCustomerChange({
                  fullName: event.target.value,
                })
              }
              placeholder="Enter your full name"
              maxLength={120}
              className={inputClass}
            />
          </label>

          {/* PHONE */}

          <label className="block">
            <span className="flex items-center gap-2 text-sm font-semibold text-white">
              Mobile Number
              <span className="text-[#FFD400]">*</span>
            </span>

            <div className="relative">
              <Phone
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8298A7]"
              />

              <input
                type="tel"
                autoComplete="tel"
                value={customer.phone}
                onChange={(event) =>
                  onCustomerChange({
                    phone: event.target.value,
                  })
                }
                placeholder="+61 4XX XXX XXX"
                maxLength={30}
                className={`${inputClass} pl-11`}
              />
            </div>
          </label>

          {/* EMAIL */}

          <label className="block sm:col-span-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-white">
              Email Address

              <span className="text-xs font-normal text-[#8298A7]">
                Optional
              </span>
            </span>

            <div className="relative">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8298A7]"
              />

              <input
                type="email"
                autoComplete="email"
                value={customer.email}
                onChange={(event) =>
                  onCustomerChange({
                    email: event.target.value,
                  })
                }
                placeholder="you@example.com"
                maxLength={254}
                className={`${inputClass} pl-11`}
              />
            </div>
          </label>
        </div>
      </section>



      {/* ISSUE DESCRIPTION */}

      <div className="my-9 border-t border-white/10" />

      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D6E91]/20 text-[#FFD400]">
            <Sparkles size={19} />
          </div>

          <div>
            <h3 className="font-bold text-white">
              Describe the Issue
            </h3>
            <p className="mt-0.5 text-xs text-[#8298A7]">
              Tell us what is happening with your vehicle.
            </p>
          </div>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-semibold text-white">
            Issue Description <span className="text-xs font-normal text-[#8298A7]">Optional</span>
          </span>
          <textarea
            value={service.issueDescription ?? ""}
            onChange={(event) =>
              onServiceChange({
                issueDescription: event.target.value,
              })
            }
            placeholder="Describe the problem, warning lights, symptoms or any other details..."
            rows={5}
            maxLength={2000}
            className="mt-2 min-h-32 w-full resize-y rounded-xl border border-white/10 bg-[#08263D] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-[#667E8D] focus:border-[#FFD400]/60 focus:ring-2 focus:ring-[#FFD400]/10"
          />
          <span className="mt-2 block text-right text-xs text-[#8298A7]">
            {(service.issueDescription ?? "").length}/2000
          </span>
        </label>
      </section>
      {/* FOOTNOTE */}

      <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-xs leading-5 text-[#8298A7]">
          Your contact information will only be used to
          communicate about your service booking.
        </p>
      </div>
    </div>
  );
}
