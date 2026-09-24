"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Archive,
  ArrowRight,
  CalendarDays,
  CarFront,
  Check,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Search,
  User,
  Wrench,
  X,
  XCircle,
} from "lucide-react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

type BookingAction =
  | "confirm"
  | "cancel"
  | "complete"
  | "archive";

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

type Filter =
  | "all"
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

type Counts = {
  all: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
};

const tabs: {
  key: Filter;
  label: string;
}[] = [
  {
    key: "pending",
    label: "Pending",
  },
  {
    key: "confirmed",
    label: "Confirmed",
  },
  {
    key: "completed",
    label: "Completed",
  },
  {
    key: "cancelled",
    label: "Cancelled",
  },
  {
    key: "all",
    label: "All",
  },
];

const emptyCounts: Counts = {
  all: 0,
  pending: 0,
  confirmed: 0,
  completed: 0,
  cancelled: 0,
};

function isValidFilter(
  value: string | null
): value is Filter {
  return (
    value === "all" ||
    value === "pending" ||
    value === "confirmed" ||
    value === "completed" ||
    value === "cancelled"
  );
}

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

function actionLabel(
  action: BookingAction
) {
  const labels: Record<
    BookingAction,
    string
  > = {
    confirm: "Confirm Booking",
    cancel: "Cancel Booking",
    complete: "Complete Booking",
    archive: "Archive Booking",
  };

  return labels[action];
}

export default function BookingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryStatus =
    searchParams.get("status");

  const activeFilter: Filter =
    isValidFilter(queryStatus)
      ? queryStatus
      : "all";

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [counts, setCounts] =
    useState<Counts>(emptyCounts);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [
    selectedBooking,
    setSelectedBooking,
  ] = useState<Booking | null>(null);

  const [
    confirmAction,
    setConfirmAction,
  ] = useState<{
    booking: Booking;
    action: BookingAction;
  } | null>(null);

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  function changeFilter(
    filter: Filter
  ) {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    params.set("status", filter);

    router.replace(
      `${pathname}?${params.toString()}`,
      {
        scroll: false,
      }
    );
  }

  const loadBookings = async () => {
    try {
      setLoading(true);

      const params =
        new URLSearchParams();

      params.set(
        "status",
        activeFilter
      );

      if (search.trim()) {
        params.set(
          "search",
          search.trim()
        );
      }

      params.set("page", "1");
      params.set("limit", "50");

      const response = await fetch(
        `/api/admin/bookings?${params.toString()}`,
        {
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ??
            "Failed to load bookings."
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
        "Could not load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [activeFilter]);

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        loadBookings();
      }, 350);

    return () =>
      window.clearTimeout(timer);
  }, [search, activeFilter]);

  /*
   * Lock page scrolling whenever a modal
   * is open.
   */
  useEffect(() => {
    const modalOpen =
      Boolean(
        selectedBooking ||
          confirmAction
      );

    document.body.style.overflow =
      modalOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [
    selectedBooking,
    confirmAction,
  ]);

  const visibleBookings =
    useMemo(
      () => bookings,
      [bookings]
    );

  function getActions(
    booking: Booking
  ): BookingAction[] {
    /*
     * Archive is intentionally available
     * ONLY from the All tab.
     */
    const actions: BookingAction[] =
      [];

    if (
      activeFilter === "all"
    ) {
      actions.push("archive");
    }

    if (
      booking.status === "pending"
    ) {
      actions.unshift(
        "confirm",
        "cancel"
      );
    }

    if (
      booking.status === "confirmed"
    ) {
      actions.unshift(
        "complete",
        "cancel"
      );
    }

    return actions;
  }

  async function executeAction() {
    if (!confirmAction) {
      return;
    }

    const {
      booking,
      action,
    } = confirmAction;

    try {
      setUpdatingId(
        booking._id
      );

      const response =
        await fetch(
          `/api/admin/bookings/${booking._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              action,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ??
            "Unable to update booking."
        );
      }

      toast.success(
        result?.message ??
          "Booking updated successfully."
      );

      setConfirmAction(null);
      setSelectedBooking(null);

      await loadBookings();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update booking."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#061A2B] px-4 py-6 text-[#F8FAFC] sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-[1600px]">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <header className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFD400] text-[#061A2B] shadow-[0_8px_30px_rgba(255,212,0,0.14)]">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8BBC8]">
                  Booking Management
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Bookings
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A8BBC8] sm:text-base">
                Manage customer appointments,
                confirmations and booking
                progress from one place.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#08263D] px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#718895]">
                Current View
              </p>

              <p className="mt-1 text-sm font-bold text-[#F8FAFC]">
                {tabs.find(
                  (tab) =>
                    tab.key ===
                    activeFilter
                )?.label ?? "All"}{" "}
                Bookings
              </p>
            </div>
          </div>
        </header>

        {/* =====================================================
            STATUS TABS
        ===================================================== */}
        <section className="mb-6 rounded-2xl border border-white/[0.08] bg-[#08263D] p-2 shadow-xl shadow-black/10">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const active =
                activeFilter ===
                tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() =>
                    changeFilter(
                      tab.key
                    )
                  }
                  className={`group flex min-w-[130px] flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition sm:min-w-0 ${
                    active
                      ? "bg-[#FFD400] text-[#061A2B] shadow-[0_8px_25px_rgba(255,212,0,0.12)]"
                      : "text-[#A8BBC8] hover:bg-[#061A2B] hover:text-[#F8FAFC]"
                  }`}
                >
                  <span>
                    {tab.label}
                  </span>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      active
                        ? "bg-[#061A2B]/10 text-[#061A2B]"
                        : "bg-white/[0.06] text-[#718895]"
                    }`}
                  >
                    {counts[tab.key]}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            SEARCH / TOOLBAR
        ===================================================== */}
        <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#F8FAFC]">
              {counts[activeFilter]}{" "}
              {activeFilter ===
              "all"
                ? "active bookings"
                : `${activeFilter} bookings`}
            </p>

            <p className="mt-1 text-xs text-[#718895]">
              Archived bookings are kept
              separately.
            </p>
          </div>

          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718895]" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search reference, customer, phone..."
              className="w-full rounded-xl border border-white/[0.08] bg-[#08263D] py-3 pl-10 pr-4 text-sm text-[#F8FAFC] outline-none placeholder:text-[#718895] transition focus:border-[#0D6E91] focus:ring-1 focus:ring-[#0D6E91]"
            />
          </div>
        </section>

        {/* =====================================================
            BOOKING LIST
        ===================================================== */}
        {loading ? (
          <LoadingState />
        ) : !visibleBookings.length ? (
          <EmptyState
            filter={activeFilter}
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {visibleBookings.map(
              (booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  actions={getActions(
                    booking
                  )}
                  updating={
                    updatingId ===
                    booking._id
                  }
                  onView={() =>
                    setSelectedBooking(
                      booking
                    )
                  }
                  onAction={(action) =>
                    setConfirmAction({
                      booking,
                      action,
                    })
                  }
                />
              )
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          DETAILS MODAL
      ===================================================== */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          actions={getActions(
            selectedBooking
          )}
          updating={
            updatingId ===
            selectedBooking._id
          }
          onClose={() =>
            setSelectedBooking(null)
          }
          onAction={(action) =>
            setConfirmAction({
              booking:
                selectedBooking,
              action,
            })
          }
        />
      )}

      {/* =====================================================
          CONFIRMATION MODAL
      ===================================================== */}
      {confirmAction && (
        <ConfirmationModal
          booking={
            confirmAction.booking
          }
          action={
            confirmAction.action
          }
          loading={
            updatingId ===
            confirmAction.booking._id
          }
          onClose={() =>
            setConfirmAction(null)
          }
          onConfirm={
            executeAction
          }
        />
      )}
    </main>
  );
}

/* ============================================================
   BOOKING CARD
============================================================ */

function BookingCard({
  booking,
  actions,
  updating,
  onView,
  onAction,
}: {
  booking: Booking;
  actions: BookingAction[];
  updating: boolean;
  onView: () => void;
  onAction: (
    action: BookingAction
  ) => void;
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

        {/* ACTIONS */}
        {actions.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-4">
            {actions.map(
              (action) => (
                <button
                  key={action}
                  type="button"
                  disabled={updating}
                  onClick={() =>
                    onAction(action)
                  }
                  className={getActionClass(
                    action
                  )}
                >
                  {action ===
                    "archive" && (
                    <Archive className="h-3.5 w-3.5" />
                  )}

                  {actionLabel(
                    action
                  )}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </article>
  );
}

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

function getActionClass(
  action: BookingAction
) {
  if (action === "confirm") {
    return "inline-flex items-center gap-2 rounded-xl bg-[#FFD400] px-4 py-2.5 text-xs font-bold text-[#061A2B] transition hover:bg-[#F5B800] disabled:opacity-50";
  }

  if (action === "complete") {
    return "inline-flex items-center gap-2 rounded-xl bg-[#67E8A5] px-4 py-2.5 text-xs font-bold text-[#061A2B] transition hover:brightness-95 disabled:opacity-50";
  }

  if (action === "cancel") {
    return "inline-flex items-center gap-2 rounded-xl border border-[#FF7D7D]/25 bg-[#FF7D7D]/10 px-4 py-2.5 text-xs font-bold text-[#FF7D7D] transition hover:bg-[#FF7D7D]/15 disabled:opacity-50";
  }

  return "inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#061A2B] px-4 py-2.5 text-xs font-bold text-[#A8BBC8] transition hover:border-[#FFD400]/25 hover:text-[#FFD400] disabled:opacity-50";
}

/* ============================================================
   DETAILS MODAL
============================================================ */

function BookingDetailsModal({
  booking,
  actions,
  updating,
  onClose,
  onAction,
}: {
  booking: Booking;
  actions: BookingAction[];
  updating: boolean;
  onClose: () => void;
  onAction: (
    action: BookingAction
  ) => void;
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

        {/* MODAL HEADER */}
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
            </div>

            <h2 className="mt-1 text-lg font-bold">
              Booking Details
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

        {/* MODAL CONTENT */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-2">

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
                  booking.customer
                    .phone
                }
              />

              <DetailRow
                label="Email"
                value={
                  booking.customer
                    .email ||
                  "Not provided"
                }
              />

              <DetailRow
                label="Customer Notes"
                value={
                  booking.customer
                    .notes ||
                  "None"
                }
              />
            </DetailSection>

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
                  booking.vehicle
                    .issue ||
                  "Not specified"
                }
              />

              <DetailRow
                label="Vehicle Notes"
                value={
                  booking.vehicle
                    .notes ||
                  "None"
                }
              />
            </DetailSection>

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
                  booking.service
                    .serviceId ||
                  "Not linked"
                }
              />
            </DetailSection>

            <DetailSection
              title="Appointment"
              icon={CalendarDays}
            >
              <DetailRow
                label="Date"
                value={formatDate(
                  booking.appointment
                    .date
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

            <div className="lg:col-span-2">
              <DetailSection
                title="Booking Timeline"
                icon={Clock3}
              >
                <DetailRow
                  label="Created"
                  value={new Date(
                    booking.createdAt
                  ).toLocaleString(
                    "en-AU"
                  )}
                />

                <DetailRow
                  label="Last Updated"
                  value={new Date(
                    booking.updatedAt
                  ).toLocaleString(
                    "en-AU"
                  )}
                />

                {booking.archived &&
                  booking.archivedAt && (
                    <DetailRow
                      label="Archived"
                      value={new Date(
                        booking.archivedAt
                      ).toLocaleString(
                        "en-AU"
                      )}
                    />
                  )}
              </DetailSection>
            </div>
          </div>
        </div>

        {/* MODAL ACTIONS */}
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-white/[0.08] bg-[#061A2B]/50 p-4 sm:px-6">
            {actions.map(
              (action) => (
                <button
                  key={action}
                  type="button"
                  disabled={updating}
                  onClick={() =>
                    onAction(action)
                  }
                  className={getActionClass(
                    action
                  )}
                >
                  {action ===
                    "archive" && (
                    <Archive className="h-3.5 w-3.5" />
                  )}

                  {actionLabel(
                    action
                  )}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
   CONFIRMATION MODAL
============================================================ */

function ConfirmationModal({
  booking,
  action,
  loading,
  onClose,
  onConfirm,
}: {
  booking: Booking;
  action: BookingAction;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const config: Record<
    BookingAction,
    {
      title: string;
      description: string;
      button: string;
    }
  > = {
    confirm: {
      title: "Confirm this booking?",
      description:
        "This booking will move from Pending to Confirmed and the appointment will become confirmed.",
      button:
        "Confirm Booking",
    },

    cancel: {
      title: "Cancel this booking?",
      description:
        "This booking will move to Cancelled. The appointment slot can become available again.",
      button:
        "Cancel Booking",
    },

    complete: {
      title: "Complete this booking?",
      description:
        "This will mark the appointment as successfully completed.",
      button:
        "Complete Booking",
    },

    archive: {
      title: "Archive this booking?",
      description:
        "This booking will be removed from the active booking workflow and moved to the archive. Its current status will remain unchanged.",
      button:
        "Archive Booking",
    },
  };

  const current =
    config[action];

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#020B13]/85 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.10] bg-[#08263D] shadow-[0_30px_100px_rgba(0,0,0,0.5)]">

        <div className="p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFD400]/10 text-[#FFD400]">
            {action ===
            "confirm" ? (
              <Check className="h-6 w-6" />
            ) : action ===
              "cancel" ? (
              <XCircle className="h-6 w-6" />
            ) : action ===
              "complete" ? (
              <CheckCircle2 className="h-6 w-6" />
            ) : (
              <Archive className="h-6 w-6" />
            )}
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#F8FAFC]">
            {current.title}
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#A8BBC8]">
            {current.description}
          </p>

          <div className="mt-5 rounded-2xl border border-white/[0.07] bg-[#061A2B] p-4">
            <p className="font-mono text-sm font-bold text-[#FFD400]">
              {booking.bookingReference}
            </p>

            <p className="mt-1 text-sm font-semibold text-[#F8FAFC]">
              {booking.customer.fullName}
            </p>

            <p className="mt-1 text-xs text-[#A8BBC8]">
              {
                booking.service
                  .serviceName
              }
            </p>
          </div>
        </div>

        <div className="flex gap-2 border-t border-white/[0.08] bg-[#061A2B]/50 p-4">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/[0.08] bg-[#08263D] px-4 py-3 text-sm font-bold text-[#A8BBC8] transition hover:text-[#F8FAFC] disabled:opacity-50"
          >
            Go Back
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition disabled:opacity-50 ${
              action === "cancel"
                ? "bg-[#FF7D7D] text-[#061A2B]"
                : "bg-[#FFD400] text-[#061A2B] hover:bg-[#F5B800]"
            }`}
          >
            {loading
              ? "Updating..."
              : current.button}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   EMPTY / LOADING
============================================================ */

function LoadingState() {
  return (
    <div className="flex min-h-80 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#08263D]">
      <div className="flex items-center gap-3 text-sm text-[#A8BBC8]">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#FFD400] border-t-transparent" />

        Loading bookings...
      </div>
    </div>
  );
}

function EmptyState({
  filter,
}: {
  filter: Filter;
}) {
  const label =
    filter === "all"
      ? "active bookings"
      : `${filter} bookings`;

  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.10] bg-[#08263D] px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#061A2B] text-[#718895]">
        <CalendarDays className="h-6 w-6" />
      </div>

      <h2 className="mt-5 text-lg font-bold text-[#F8FAFC]">
        No {label} found
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-[#A8BBC8]">
        There are no bookings matching
        the current status or search.
      </p>
    </div>
  );
}