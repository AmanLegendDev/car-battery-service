
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { INITIAL_BOOKING_DATA } from "./bookingData";

import BookingHeader from "./BookingHeader";
import BookingProgress from "./BookingProgress";

import VehicleStep from "./steps/VehicleStep";
import CustomerStep from "./steps/CustomerStep";
import MediaUpload from "./steps/MediaUpload";
import LocationStep from "./steps/LocationStep";
import ReviewStep from "./steps/ReviewStep";

import type {
  BookingFormData,
  BookingVehicleData,
  BookingServiceData,
  BookingDateTimeData,
  BookingCustomerData,
  BookingLocationData,
} from "@/lib/booking/booking.types";

import {
  bookingVehicleSchema,
  bookingServiceSchema,
  bookingAppointmentSchema,
  bookingCustomerSchema,
  bookingLocationSchema,
} from "@/lib/booking/booking.validation";

import type {
  PublicAvailabilityDay,
} from "@/lib/booking/booking.availability";

/* =========================================
   TYPES
========================================= */

interface BookingService {
  id: string;
  title: string;
  shortDescription: string;
}

interface BookingPageProps {
  services: BookingService[];
}

/*
 * Four customer-facing steps.
 * Review is a separate final screen.
 */

const TOTAL_STEPS = 4;
const REVIEW_STEP = 5;

export default function BookingPage({
  services,
}: BookingPageProps) {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [booking, setBooking] =
    useState<BookingFormData>(
      INITIAL_BOOKING_DATA
    );

  const [availability, setAvailability] =
    useState<PublicAvailabilityDay[]>([]);

  const [loadingAvailability, setLoadingAvailability] =
    useState(false);

  const [availabilityError, setAvailabilityError] =
    useState("");

  const [error, setError] = useState("");

  const [selectedMonth, setSelectedMonth] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  /* =========================================
     BOOKING STATE UPDATES
  ========================================= */

  const updateVehicle = (
    value: Partial<BookingVehicleData>
  ) => {
    setBooking((current) => ({
      ...current,
      vehicle: {
        ...current.vehicle,
        ...value,
      },
    }));
  };

  const updateService = (
    value: Partial<BookingServiceData>
  ) => {
    setBooking((current) => ({
      ...current,
      service: {
        ...current.service,
        ...value,
      },
    }));
  };

  const updateAppointment = (
    value: Partial<BookingDateTimeData>
  ) => {
    setBooking((current) => ({
      ...current,
      appointment: {
        ...current.appointment,
        ...value,
      },
    }));
  };

  const updateCustomer = (
    value: Partial<BookingCustomerData>
  ) => {
    setBooking((current) => ({
      ...current,
      customer: {
        ...current.customer,
        ...value,
      },
    }));
  };

  const updateLocation = (
    value: Partial<BookingLocationData>
  ) => {
    setBooking((current) => ({
      ...current,
      location: {
        ...current.location,
        ...value,
      },
    }));
  };

  /* =========================================
     LIVE AVAILABILITY
  ========================================= */

  const loadAvailability = useCallback(
    async (from?: string, to?: string) => {
      try {
        setLoadingAvailability(true);
        setAvailabilityError("");

        const params = new URLSearchParams();

        if (from) {
          params.set("from", from);
        }

        if (to) {
          params.set("to", to);
        }

        const query = params.toString();

        const response = await fetch(
          `/api/booking/availability${
            query ? `?${query}` : ""
          }`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to load availability."
          );
        }

        setAvailability(data.days ?? []);

        if (
          !selectedMonth &&
          data.bookingStartsFrom
        ) {
          setSelectedMonth(
            data.bookingStartsFrom.slice(0, 7)
          );
        }
      } catch (err) {
        console.error(
          "Availability loading error:",
          err
        );

        setAvailabilityError(
          err instanceof Error
            ? err.message
            : "Unable to load availability."
        );
      } finally {
        setLoadingAvailability(false);
      }
    },
    [selectedMonth]
  );

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  const selectedDay = useMemo(() => {
    return availability.find(
      (day) =>
        day.date === booking.appointment.date
    );
  }, [
    availability,
    booking.appointment.date,
  ]);

  /* =========================================
     STEP VALIDATION
  ========================================= */

  const validateStep = (
    currentStep: number
  ): boolean => {
    setError("");

    // STEP 1 — VEHICLE

    if (currentStep === 1) {
      const result =
        bookingVehicleSchema.safeParse(
          booking.vehicle
        );

      if (!result.success) {
        setError(
          result.error.issues[0]?.message ||
            "Please complete your vehicle details."
        );

        return false;
      }

      return true;
    }

    // STEP 2 — CONTACT + SERVICE

    if (currentStep === 2) {
      const customerResult =
        bookingCustomerSchema.safeParse(
          booking.customer
        );

      if (!customerResult.success) {
        setError(
          customerResult.error.issues[0]?.message ||
            "Please complete your contact details."
        );

        return false;
      }

      const serviceResult =
        bookingServiceSchema.safeParse(
          booking.service
        );

      if (!serviceResult.success) {
        setError(
          serviceResult.error.issues[0]?.message ||
            "Please select a service."
        );

        return false;
      }

      return true;
    }

    // STEP 3 — ISSUE + MEDIA

    if (currentStep === 3) {
      const result =
        bookingServiceSchema.safeParse(
          booking.service
        );

      if (!result.success) {
        setError(
          result.error.issues[0]?.message ||
            "Please check your service details and uploads."
        );

        return false;
      }

      return true;
    }

    // STEP 4 — LOCATION + APPOINTMENT

    if (currentStep === 4) {
      const locationResult =
        bookingLocationSchema.safeParse(
          booking.location
        );

      if (!locationResult.success) {
        setError(
          locationResult.error.issues[0]?.message ||
            "Please complete your service location."
        );

        return false;
      }

      const appointmentResult =
        bookingAppointmentSchema.safeParse(
          booking.appointment
        );

      if (!appointmentResult.success) {
        setError(
          appointmentResult.error.issues[0]?.message ||
            "Please select a date and time."
        );

        return false;
      }

      // Recheck selected slot against live availability.

      if (
        !selectedDay ||
        !selectedDay.slots.some(
          (slot) =>
            slot.start ===
              booking.appointment.startTime &&
            slot.end ===
              booking.appointment.endTime &&
            slot.status === "available"
        )
      ) {
        setError(
          "That time is no longer available. Please select another time."
        );

        loadAvailability();

        return false;
      }

      return true;
    }

    return true;
  };

  /* =========================================
     NAVIGATION
  ========================================= */

  const nextStep = () => {
    if (!validateStep(step)) {
      return;
    }

    /*
     * After the fourth step,
     * open the separate review screen.
     */

    if (step === TOTAL_STEPS) {
      setStep(REVIEW_STEP);
    } else {
      setStep((current) =>
        Math.min(current + 1, TOTAL_STEPS)
      );
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const previousStep = () => {
    setError("");

    setStep((current) =>
      current === REVIEW_STEP
        ? TOTAL_STEPS
        : Math.max(current - 1, 1)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goToStep = (targetStep: number) => {
    if (
      targetStep < 1 ||
      targetStep > TOTAL_STEPS
    ) {
      return;
    }

    setError("");
    setStep(targetStep);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================
     APPOINTMENT SELECTION
  ========================================= */

  const selectDate = (date: string) => {
    const day = availability.find(
      (item) => item.date === date
    );

    if (!day || !day.available) {
      return;
    }

    updateAppointment({
      date,
      startTime: "",
      endTime: "",
    });

    setError("");
  };

  const selectTime = (
    startTime: string,
    endTime: string
  ) => {
    const day = availability.find(
      (item) =>
        item.date === booking.appointment.date
    );

    const slot = day?.slots.find(
      (item) =>
        item.start === startTime &&
        item.end === endTime
    );

    if (
      !slot ||
      slot.status !== "available"
    ) {
      return;
    }

    updateAppointment({
      startTime,
      endTime,
    });

    setError("");
  };

  /* =========================================
     TERMS ACCEPTANCE
  ========================================= */

  const setTermsAccepted = (
    accepted: boolean
  ) => {
    setBooking((current) => ({
      ...current,
      termsAccepted: accepted,
    }));

    if (accepted) {
      setError("");
    }
  };

  /* =========================================
     FINAL BOOKING SUBMISSION
  ========================================= */

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    setError("");

    // Revalidate all four customer steps.

    for (let currentStep = 1; currentStep <= TOTAL_STEPS; currentStep++) {
      if (!validateStep(currentStep)) {
        setStep(currentStep);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        return;
      }
    }

    if (!booking.termsAccepted) {
      setError(
        "Please accept the Terms & Conditions and Privacy Policy before submitting your booking request."
      );

      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        "/api/booking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(booking),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to submit your booking request."
        );
      }

      const reference =
        typeof data.reference === "string"
          ? data.reference
          : "";

      if (!reference) {
        throw new Error(
          "Booking was submitted, but no booking reference was returned."
        );
      }

      router.push(
        `/booking/success?reference=${encodeURIComponent(
          reference
        )}`
      );
    } catch (err) {
      console.error(
        "Booking submission error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your booking request. Please try again."
      );

      setSubmitting(false);
    }
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <main className="min-h-screen bg-[#061A2B] text-white">

      <section className="px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          <BookingHeader />

          <BookingProgress
            currentStep={
              step === REVIEW_STEP
                ? TOTAL_STEPS
                : step
            }
            totalSteps={TOTAL_STEPS}
          />

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">

            {/* MAIN FORM */}

            <div>
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10">

                {/* STEP 1 — VEHICLE */}

                {step === 1 && (
                  <VehicleStep
                    value={booking.vehicle}
                    onChange={updateVehicle}
                  />
                )}

                {/* STEP 2 — CONTACT + SERVICE */}

                {step === 2 && (
                  <CustomerStep
                    customer={booking.customer}
                    service={booking.service}
                    services={services}
                    onCustomerChange={updateCustomer}
                    onServiceChange={updateService}
                  />
                )}

                {/* STEP 3 — MEDIA + ISSUE */}

                {step === 3 && (
                  <div>
                    <p className="text-sm font-semibold text-[#FFD400]">
                      Step 3
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      Tell Us About The Issue
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#A8BBC8]">
                      Describe the problem and upload photos
                      or a short video to help our mechanic
                      prepare before arriving.
                    </p>

                    <label className="mt-8 block">
                      <span className="text-sm font-semibold">
                        Describe the issue
                      </span>

                      <textarea
                        value={booking.service.issueDescription}
                        onChange={(event) =>
                          updateService({
                            issueDescription:
                              event.target.value,
                          })
                        }
                        rows={4}
                        maxLength={3000}
                        placeholder="Tell us what is happening with your vehicle..."
                        className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none placeholder:text-[#667E8D] focus:border-[#FFD400]/60"
                      />

                      <span className="mt-1 block text-right text-[11px] text-[#6F8796]">
                        {booking.service.issueDescription.length}/3000
                      </span>
                    </label>

                    <div className="mt-8 rounded-2xl bg-white p-4 sm:p-6">
                      <MediaUpload
                        images={booking.service.images}
                        video={booking.service.video}
                        onImagesChange={(images) =>
                          updateService({ images })
                        }
                        onVideoChange={(video) =>
                          updateService({ video })
                        }
                        disabled={submitting}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 4 — LOCATION + APPOINTMENT */}

               {step === 4 && (
  <LocationStep
    location={booking.location}
    appointment={booking.appointment}
    availability={availability}
    loading={loadingAvailability}
    error={availabilityError}
    selectedMonth={selectedMonth}
    onLocationChange={updateLocation}
    onAppointmentChange={updateAppointment}
    onMonthChange={setSelectedMonth}
    onDateSelect={selectDate}
    onTimeSelect={selectTime}
    onRetry={() => loadAvailability()}
  />
)}

                {/* FINAL REVIEW */}

                {step === REVIEW_STEP && (
                  <ReviewStep
                    booking={booking}
                    onEdit={goToStep}
                    termsAccepted={booking.termsAccepted}
                    onTermsChange={setTermsAccepted}
                  />
                )}

                {/* ERROR */}

                {error && (
                  <div
                    role="alert"
                    className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-200"
                  >
                    {error}
                  </div>
                )}

                {/* NAVIGATION */}

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">

                  <button
                    type="button"
                    onClick={previousStep}
                    disabled={
                      step === 1 || submitting
                    }
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ArrowLeft size={17} />
                    Back
                  </button>

                  {step < REVIEW_STEP ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={submitting}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-6 text-sm font-bold text-[#061A2B] transition hover:bg-[#F5B800] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {step === TOTAL_STEPS
                        ? "Review Booking"
                        : "Continue"}

                      <ArrowRight size={17} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={
                        submitting ||
                        !booking.termsAccepted
                      }
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-6 text-sm font-bold text-[#061A2B] shadow-lg shadow-[#FFD400]/10 transition hover:bg-[#F5B800] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2
                            size={17}
                            className="animate-spin"
                          />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Confirm Booking
                          <Check size={17} />
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* SIDEBAR */}

            <aside className="hidden lg:block">
              <div className="sticky top-8 space-y-4">

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFD400]">
                    Your booking
                  </p>

                  <h2 className="mt-3 text-xl font-bold">
                    Request an Automotive Service
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#A8BBC8]">
                    Tell us about your vehicle, choose
                    a service, share the issue and select
                    your preferred appointment.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      className="mt-0.5 text-[#FFD400]"
                      size={21}
                    />

                    <div>
                      <p className="font-semibold">
                        Live availability
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#A8BBC8]">
                        Dates and time slots are checked
                        against current availability.
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/"
                  className="block text-center text-sm text-[#A8BBC8] transition hover:text-white"
                >
                  Return to website
                </Link>

              </div>
            </aside>

          </div>
        </div>
      </section>
    </main>
  );
}
