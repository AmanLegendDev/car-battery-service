"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Archive,
  CalendarDays,
  CarFront,
  Clock3,
  MapPin,
  Search,
  User,
  Wrench,
  X,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

type Booking = {
  _id: string;
  bookingReference: string;

  customer: {
    fullName: string;
    phone: string;
    email: string;
    notes: string;
  };

  vehicle: {
    registrationNumber: string;
    issue:
      | "Car won't start"
      | "Battery appears flat"
      | "Needs a jump start"
      | "Battery testing"
      | "Battery replacement"
      | "Not sure / Need help"
      | "";
    notes: string;
  };

  service: {
    serviceId: string | null;
    serviceName: string;
  };

  location: {
    address: string;
    suburb: string;
    state: string;
    postcode: string;
    accessNotes: string;
  };

  appointment: {
    date: string;
    startTime: string;
    endTime: string;
    timezone: string;
  };

  status: BookingStatus;

  archived: boolean;
  archivedAt?: string | null;

  createdAt: string;
  updatedAt: string;
};

type Counts = {
  all: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
};

const emptyCounts: Counts = {
  all: 0,
  pending: 0,
  confirmed: 0,
  completed: 0,
  cancelled: 0,
};

function statusLabel(
  status: BookingStatus
) {
  const labels: Record<
    BookingStatus,
    string
  > = {
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return labels[status];
}

function statusClasses(
  status: BookingStatus
) {
  const classes: Record<
    BookingStatus,
    string
  > = {
    pending:
      "border-[#FFD400]/25 bg-[#FFD400]/10 text-[#FFD400]",

    confirmed:
      "border-[#5EC8FF]/25 bg-[#5EC8FF]/10 text-[#5EC8FF]",

    completed:
      "border-[#67E8A5]/25 bg-[#67E8A5]/10 text-[#67E8A5]",

    cancelled:
      "border-[#FF7D7D]/25 bg-[#FF7D7D]/10 text-[#FF7D7D]",
  };

  return classes[status];
}

function formatDate(date: string) {
  const parsed = new Date(
    `${date}T00:00:00`
  );

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat(
    "en-AU",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(parsed);
}

function formatDateTime(
  value?: string | null
) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString(
    "en-AU"
  );
}

export default function ArchivedBookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [counts, setCounts] =
    useState<Counts>(emptyCounts);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  async function loadArchivedBookings() {
    try {
      setLoading(true);

      const params =
        new URLSearchParams();

      if (search.trim()) {
        params.set(
          "search",
          search.trim()
        );
      }

      params.set("page", "1");
      params.set("limit", "50");

      const response = await fetch(
        `/api/admin/bookings/archive?${params.toString()}`,
        {
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ??
            "Failed to load archived bookings."
        );
      }

      setBookings(
        result.data ?? []
      );

      setCounts(
        result.counts ?? emptyCounts
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not load archived bookings."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        loadArchivedBookings();
      }, 250);

    return () =>
      window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const modalOpen =
      Boolean(selectedBooking);

    document.body.style.overflow =
      modalOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [selectedBooking]);

  return (
    <main className="min-h-screen bg-[#061A2B] px-4 py-6 text-[#F8FAFC] sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-[1600px]">

        {/* HEADER */}
        <header className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFD400] text-[#061A2B] shadow-[0_8px_30px_rgba(255,212,0,0.14)]">
                  <Archive className="h-5 w-5" />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8BBC8]">
                  Booking Archive
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Archived Bookings
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A8BBC8] sm:text-base">
                View bookings that have been removed from the active booking workflow.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push("/admin/bookings")
              }
              className="inline-flex items-center justify-center rounded-xl border border-white/[0.08] bg-[#08263D] px-5 py-3 text-sm font-bold text-[#A8BBC8] transition hover:border-[#FFD400]/30 hover:text-[#FFD400]"
            >
              Back to Bookings
            </button>
          </div>
        </header>

        {/* SUMMARY */}
        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

          <ArchiveStat
            label="All Archived"
            count={counts.all}
            className="text-[#FFD400]"
          />

          <ArchiveStat
            label="Pending"
            count={counts.pending}
            className="text-[#FFD400]"
          />

          <ArchiveStat
            label="Confirmed"
            count={counts.confirmed}
            className="text-[#5EC8FF]"
          />

          <ArchiveStat
            label="Completed"
            count={counts.completed}
            className="text-[#67E8A5]"
          />

          <ArchiveStat
            label="Cancelled"
            count={counts.cancelled}
            className="text-[#FF7D7D]"
          />

        </section>

        {/* SEARCH */}
        <section className="mb-6 flex justify-end">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718895]" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search archived bookings..."
              className="w-full rounded-xl border border-white/[0.08] bg-[#08263D] py-3 pl-10 pr-4 text-sm text-[#F8FAFC] outline-none placeholder:text-[#718895] transition focus:border-[#0D6E91] focus:ring-1 focus:ring-[#0D6E91]"
            />
          </div>
        </section>

        {/* LIST */}
        {loading ? (
          <LoadingState />
        ) : !bookings.length ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {bookings.map(
              (booking) => (
                <ArchivedBookingCard
                  key={booking._id}
                  booking={booking}
                  onView={() =>
                    setSelectedBooking(
                      booking
                    )
                  }
                />
              )
            )}
          </div>
        )}
      </div>

      {/* DETAILS MODAL */}
      {selectedBooking && (
        <ArchivedBookingDetailsModal
          booking={selectedBooking}
          onClose={() =>
            setSelectedBooking(null)
          }
        />
      )}
    </main>
  );
}

/* ============================================================
   STAT
============================================================ */

function ArchiveStat({
  label,
  count,
  className,
}: {
  label: string;
  count: number;
  className: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#08263D] p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#718895]">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${className}`}
      >
        {count}
      </p>
    </div>
  );
}

/* ============================================================
   CARD
============================================================ */

function ArchivedBookingCard({
  booking,
  onView,
}: {
  booking: Booking;
  onView: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08263D] shadow-[0_10px_35px_rgba(0,0,0,0.10)] transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-[#0A2D47]">

      <div className="p-5">

        {/* TOP */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#FFD400]">
                {booking.bookingReference}
              </span>

              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusClasses(
                  booking.status
                )}`}
              >
                {statusLabel(
                  booking.status
                )}
              </span>

              <span className="rounded-full border border-white/[0.08] bg-[#061A2B] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#718895]">
                Archived
              </span>
            </div>

            <h2 className="mt-2 truncate text-lg font-bold text-[#F8FAFC]">
              {booking.customer.fullName}
            </h2>
          </div>

          <button
            type="button"
            onClick={onView}
            className="shrink-0 rounded-xl border border-white/[0.08] bg-[#061A2B] px-3 py-2 text-xs font-bold text-[#A8BBC8] transition hover:border-[#FFD400]/30 hover:text-[#FFD400]"
          >
            View Details
          </button>
        </div>

        {/* INFO */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">

          <InfoItem
            icon={Wrench}
            label="Service"
            value={
              booking.service
                .serviceName
            }
          />

          <InfoItem
            icon={CarFront}
            label="Vehicle"
            value={
              booking.vehicle
                .registrationNumber
            }
          />

          <InfoItem
            icon={CalendarDays}
            label="Appointment"
            value={`${formatDate(
              booking.appointment.date
            )} · ${
              booking.appointment.startTime
            } – ${
              booking.appointment.endTime
            }`}
          />

          <InfoItem
            icon={MapPin}
            label="Location"
            value={`${booking.location.suburb}, ${booking.location.state}`}
          />

        </div>

        {/* ARCHIVE INFO */}
        <div className="mt-5 border-t border-white/[0.07] pt-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-[#718895]">
              Archived
            </span>

            <span className="text-xs font-semibold text-[#A8BBC8]">
              {formatDateTime(
                booking.archivedAt
              )}
            </span>
          </div>
        </div>

      </div>
    </article>
  );
}

/* ============================================================
   INFO ITEM
============================================================ */

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Wrench;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#061A2B]/70 p-3">

      <div className="flex items-center gap-2 text-[#718895]">
        <Icon className="h-3.5 w-3.5" />

        <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
          {label}
        </span>
      </div>

      <p className="mt-1.5 truncate text-sm font-semibold text-[#F8FAFC]">
        {value || "—"}
      </p>

    </div>
  );
}

/* ============================================================
   DETAILS MODAL
============================================================ */

function ArchivedBookingDetailsModal({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020B13]/80 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/[0.10] bg-[#08263D] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 sm:px-6">

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">

              <span className="font-mono text-sm font-bold text-[#FFD400]">
                {booking.bookingReference}
              </span>

              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${statusClasses(
                  booking.status
                )}`}
              >
                {statusLabel(
                  booking.status
                )}
              </span>

              <span className="rounded-full border border-white/[0.08] bg-[#061A2B] px-2.5 py-1 text-[10px] font-bold uppercase text-[#718895]">
                Archived
              </span>

            </div>

            <h2 className="mt-1 text-lg font-bold">
              Archived Booking Details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-[#A8BBC8] transition hover:bg-[#061A2B] hover:text-[#F8FAFC]"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* CONTENT */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">

          <div className="grid gap-5 lg:grid-cols-2">

            {/* CUSTOMER */}
            <DetailSection
              title="Customer"
              icon={User}
            >
              <DetailRow
                label="Full Name"
                value={
                  booking.customer
                    .fullName
                }
              />

              <DetailRow
                label="Phone"
                value={
                  booking.customer.phone
                }
              />

              <DetailRow
                label="Email"
                value={
                  booking.customer.email ||
                  "Not provided"
                }
              />

              <DetailRow
                label="Customer Notes"
                value={
                  booking.customer.notes ||
                  "None"
                }
              />
            </DetailSection>

            {/* VEHICLE */}
            <DetailSection
              title="Vehicle"
              icon={CarFront}
            >
              <DetailRow
                label="Registration"
                value={
                  booking.vehicle
                    .registrationNumber
                }
              />

              <DetailRow
                label="Issue"
                value={
                  booking.vehicle.issue ||
                  "Not specified"
                }
              />

              <DetailRow
                label="Vehicle Notes"
                value={
                  booking.vehicle.notes ||
                  "None"
                }
              />
            </DetailSection>

            {/* SERVICE */}
            <DetailSection
              title="Service"
              icon={Wrench}
            >
              <DetailRow
                label="Service"
                value={
                  booking.service
                    .serviceName
                }
              />

              <DetailRow
                label="Service ID"
                value={
                  booking.service.serviceId ||
                  "Not linked"
                }
              />
            </DetailSection>

            {/* APPOINTMENT */}
            <DetailSection
              title="Appointment"
              icon={CalendarDays}
            >
              <DetailRow
                label="Date"
                value={formatDate(
                  booking.appointment.date
                )}
              />

              <DetailRow
                label="Time"
                value={`${booking.appointment.startTime} – ${booking.appointment.endTime}`}
              />

              <DetailRow
                label="Timezone"
                value={
                  booking.appointment
                    .timezone
                }
              />
            </DetailSection>

            {/* LOCATION */}
            <div className="lg:col-span-2">
              <DetailSection
                title="Service Location"
                icon={MapPin}
              >
                <DetailRow
                  label="Address"
                  value={
                    booking.location
                      .address
                  }
                />

                <DetailRow
                  label="Suburb"
                  value={
                    booking.location
                      .suburb
                  }
                />

                <DetailRow
                  label="State"
                  value={
                    booking.location
                      .state
                  }
                />

                <DetailRow
                  label="Postcode"
                  value={
                    booking.location
                      .postcode
                  }
                />

                <DetailRow
                  label="Access Notes"
                  value={
                    booking.location
                      .accessNotes ||
                    "None"
                  }
                />
              </DetailSection>
            </div>

            {/* TIMELINE */}
            <div className="lg:col-span-2">
              <DetailSection
                title="Booking Timeline"
                icon={Clock3}
              >
                <DetailRow
                  label="Created"
                  value={formatDateTime(
                    booking.createdAt
                  )}
                />

                <DetailRow
                  label="Last Updated"
                  value={formatDateTime(
                    booking.updatedAt
                  )}
                />

                <DetailRow
                  label="Archived"
                  value={formatDateTime(
                    booking.archivedAt
                  )}
                />
              </DetailSection>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end border-t border-white/[0.08] bg-[#061A2B]/50 p-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#FFD400] px-5 py-3 text-sm font-bold text-[#061A2B] transition hover:bg-[#F5B800]"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

/* ============================================================
   DETAIL SECTION
============================================================ */

function DetailSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof User;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#061A2B]/60 p-4">

      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#FFD400]" />

        <h3 className="text-sm font-bold text-[#F8FAFC]">
          {title}
        </h3>
      </div>

      <div className="space-y-3">
        {children}
      </div>

    </section>
  );
}

/* ============================================================
   DETAIL ROW
============================================================ */

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-white/[0.05] pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-5">

      <span className="shrink-0 text-xs font-medium text-[#718895]">
        {label}
      </span>

      <span className="text-sm font-semibold text-[#F8FAFC] sm:max-w-[70%] sm:text-right">
        {value}
      </span>

    </div>
  );
}

/* ============================================================
   LOADING
============================================================ */

function LoadingState() {
  return (
    <div className="flex min-h-80 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#08263D]">

      <div className="flex items-center gap-3 text-sm text-[#A8BBC8]">

        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#FFD400] border-t-transparent" />

        Loading archived bookings...

      </div>

    </div>
  );
}

/* ============================================================
   EMPTY
============================================================ */

function EmptyState() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.10] bg-[#08263D] px-6 text-center">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#061A2B] text-[#718895]">
        <Archive className="h-6 w-6" />
      </div>

      <h2 className="mt-5 text-lg font-bold text-[#F8FAFC]">
        No archived bookings
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-[#A8BBC8]">
        Bookings that are archived from the active booking workflow will appear here.
      </p>

    </div>
  );
}