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
import ServiceStep from "./steps/ServiceStep";
import DateTimeStep from "./steps/DateTimeStep";
import CustomerStep from "./steps/CustomerStep";
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

interface BookingService {
  id: string;
  title: string;
  shortDescription: string;
}

interface BookingPageProps {
  services: BookingService[];
}

const TOTAL_STEPS = 5;

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

  const [error, setError] =
    useState("");

  const [selectedMonth, setSelectedMonth] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

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
        console.error(err);

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

  const validateStep = (
    currentStep: number
  ): boolean => {
    setError("");

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

    if (currentStep === 2) {
      const result =
        bookingServiceSchema.safeParse(
          booking.service
        );

      if (!result.success) {
        setError(
          result.error.issues[0]?.message ||
            "Please select a service."
        );

        return false;
      }

      return true;
    }

    if (currentStep === 3) {
      const result =
        bookingAppointmentSchema.safeParse(
          booking.appointment
        );

      if (!result.success) {
        setError(
          result.error.issues[0]?.message ||
            "Please select a date and time."
        );

        return false;
      }

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

    if (currentStep === 4) {
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

      return true;
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep(step)) {
      return;
    }

    setStep((current) =>
      Math.min(current + 1, TOTAL_STEPS)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const previousStep = () => {
    setError("");

    setStep((current) =>
      Math.max(current - 1, 1)
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
        item.date ===
        booking.appointment.date
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

  /**
   * FINAL BOOKING SUBMISSION
   *
   * Client-side validation first.
   * Server API performs the final validation
   * and availability re-check before saving.
   */
  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    setError("");

    // Validate all customer-entered sections again.
    if (!validateStep(1)) {
      setStep(1);
      return;
    }

    if (!validateStep(2)) {
      setStep(2);
      return;
    }

    if (!validateStep(3)) {
      setStep(3);
      return;
    }

    if (!validateStep(4)) {
      setStep(4);
      return;
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

  return (
    <main className="min-h-screen bg-[#061A2B] text-white">
      

      <section className="px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <BookingProgress
            currentStep={step}
            totalSteps={TOTAL_STEPS}
          />

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10">
                {step === 1 && (
                  <VehicleStep
                    value={booking.vehicle}
                    onChange={updateVehicle}
                  />
                )}

                {step === 2 && (
                  <ServiceStep
                    services={services}
                    value={booking.service}
                    onChange={updateService}
                  />
                )}

                {step === 3 && (
                  <DateTimeStep
                    availability={availability}
                    loading={loadingAvailability}
                    error={availabilityError}
                    selectedDate={
                      booking.appointment.date
                    }
                    selectedStartTime={
                      booking.appointment.startTime
                    }
                    selectedEndTime={
                      booking.appointment.endTime
                    }
                    selectedMonth={selectedMonth}
                    onMonthChange={
                      setSelectedMonth
                    }
                    onDateSelect={selectDate}
                    onTimeSelect={selectTime}
                    onRetry={() =>
                      loadAvailability()
                    }
                  />
                )}

                {step === 4 && (
                  <CustomerStep
                    customer={booking.customer}
                    location={booking.location}
                    onCustomerChange={
                      updateCustomer
                    }
                    onLocationChange={
                      updateLocation
                    }
                  />
                )}

                {step === 5 && (
                  <ReviewStep
                    booking={booking}
                    onEdit={goToStep}
                    termsAccepted={
                      booking.termsAccepted
                    }
                    onTermsChange={
                      setTermsAccepted
                    }
                  />
                )}

                {error && (
                  <div
                    role="alert"
                    className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-200"
                  >
                    {error}
                  </div>
                )}

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

                  {step < TOTAL_STEPS ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={submitting}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-6 text-sm font-bold text-[#061A2B] transition hover:bg-[#F5B800] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Continue
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
                          Submit Booking Request
                          <Check size={17} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-8 space-y-4">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFD400]">
                    Your booking
                  </p>

                  <h2 className="mt-3 text-xl font-bold">
                    Request a battery service
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#A8BBC8]">
                    Choose your vehicle, service,
                    available appointment and
                    location details.
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
                        Dates and time slots are
                        checked against current
                        availability.
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