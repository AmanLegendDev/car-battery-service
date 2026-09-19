"use client";

import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  LockKeyhole,
} from "lucide-react";

import type {
  PublicAvailabilityDay,
} from "@/lib/booking/booking.availability";

interface DateTimeStepProps {
  availability: PublicAvailabilityDay[];
  loading: boolean;
  error: string;
  selectedDate: string;
  selectedStartTime: string;
  selectedEndTime: string;
  selectedMonth: string;
  onMonthChange: (
    month: string
  ) => void;
  onDateSelect: (
    date: string
  ) => void;
  onTimeSelect: (
    start: string,
    end: string
  ) => void;
  onRetry: () => void;
}

function formatMonth(
  month: string
): string {
  if (!month) return "";

  const date = new Date(
    `${month}-01T00:00:00`
  );

  return new Intl.DateTimeFormat(
    "en-AU",
    {
      month: "long",
      year: "numeric",
    }
  ).format(date);
}

function formatDate(
  date: string
): string {
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
      `${date}T00:00:00`
    )
  );
}

export default function DateTimeStep({
  availability,
  loading,
  error,
  selectedDate,
  selectedStartTime,
  selectedEndTime,
  selectedMonth,
  onMonthChange,
  onDateSelect,
  onTimeSelect,
  onRetry,
}: DateTimeStepProps) {
  const daysForMonth =
    availability.filter((day) =>
      day.date.startsWith(
        selectedMonth
      )
    );

  const selectedDay =
    availability.find(
      (day) =>
        day.date === selectedDate
    );

  const changeMonth = (
    direction: number
  ) => {
    if (!selectedMonth) return;

    const date = new Date(
      `${selectedMonth}-01T00:00:00`
    );

    date.setMonth(
      date.getMonth() + direction
    );

    onMonthChange(
      date.toISOString().slice(0, 7)
    );
  };

  return (
    <div>
      <p className="text-sm font-semibold text-[#FFD400]">
        Step 3
      </p>

      <h2 className="mt-2 text-2xl font-black">
        Choose your date & time
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#A8BBC8]">
        Select an available appointment. Today
        and past dates cannot be selected.
      </p>

      {error && (
        <div className="mt-6 flex gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[380px] items-center justify-center">
          <div className="text-center">
            <Loader2
              className="mx-auto animate-spin text-[#FFD400]"
              size={32}
            />

            <p className="mt-4 text-sm text-[#A8BBC8]">
              Checking live availability...
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#08263D]/50">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <button
                type="button"
                onClick={() =>
                  changeMonth(-1)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[#A8BBC8] transition hover:bg-white/10 hover:text-white"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="text-center">
                <p className="font-bold">
                  {formatMonth(
                    selectedMonth
                  )}
                </p>

                <p className="mt-1 text-xs text-[#6F8796]">
                  Available dates are selectable
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  changeMonth(1)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[#A8BBC8] transition hover:bg-white/10 hover:text-white"
                aria-label="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-7 border-b border-white/10">
              {[
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun",
              ].map((day) => (
                <div
                  key={day}
                  className="px-1 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-[#6F8796]"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-px bg-white/5">
              {daysForMonth.map(
                (day) => {
                  const selected =
                    day.date ===
                    selectedDate;

                  const disabled =
                    !day.available;

                  return (
                    <button
                      key={day.date}
                      type="button"
                      disabled={disabled}
                      onClick={() =>
                        onDateSelect(
                          day.date
                        )
                      }
                      className={[
                        "min-h-[76px] bg-[#08263D] p-2 text-left transition",
                        disabled
                          ? "cursor-not-allowed opacity-45"
                          : "hover:bg-[#0D6E91]/20",
                        selected
                          ? "bg-[#FFD400]/10 ring-1 ring-inset ring-[#FFD400]"
                          : "",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span
                          className={[
                            "text-sm font-bold",
                            selected
                              ? "text-[#FFD400]"
                              : "text-white",
                          ].join(" ")}
                        >
                          {Number(
                            day.date.slice(
                              -2
                            )
                          )}
                        </span>

                        {!disabled && (
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        )}
                      </div>

                      <p className="mt-2 text-[9px] font-semibold uppercase tracking-wide">
                        {day.isToday
                          ? "Today"
                          : day.allDayBlocked
                          ? "Blocked"
                          : day.available
                          ? "Available"
                          : "Unavailable"}
                      </p>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-4 text-xs text-[#A8BBC8]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Available
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#6F8796]" />
              Unavailable
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FFD400]" />
              Selected
            </div>
          </div>

          {selectedDay ? (
            <div className="mt-8">
              <div className="flex items-center gap-3">
                <CalendarDays
                  size={20}
                  className="text-[#FFD400]"
                />

                <div>
                  <p className="font-bold">
                    {formatDate(
                      selectedDate
                    )}
                  </p>

                  <p className="text-xs text-[#6F8796]">
                    Choose an available
                    one-hour appointment
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {selectedDay.slots.map(
                  (slot) => {
                    const selected =
                      selectedStartTime ===
                        slot.start &&
                      selectedEndTime ===
                        slot.end;

                    const available =
                      slot.status ===
                      "available";

                    return (
                      <button
                        key={`${slot.start}-${slot.end}`}
                        type="button"
                        disabled={
                          !available
                        }
                        title={
                          slot.reason ||
                          undefined
                        }
                        onClick={() =>
                          onTimeSelect(
                            slot.start,
                            slot.end
                          )
                        }
                        className={[
                          "flex min-h-[66px] items-center justify-between rounded-2xl border px-4 text-left transition",
                          available
                            ? "cursor-pointer hover:border-[#FFD400]/50 hover:bg-white/[0.05]"
                            : "cursor-not-allowed border-white/5 bg-white/[0.02] opacity-45",
                          selected
                            ? "border-[#FFD400] bg-[#FFD400]/10"
                            : "border-white/10",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-3">
                          {available ? (
                            <Clock3
                              size={18}
                              className={
                                selected
                                  ? "text-[#FFD400]"
                                  : "text-[#A8BBC8]"
                              }
                            />
                          ) : (
                            <LockKeyhole
                              size={17}
                              className="text-[#6F8796]"
                            />
                          )}

                          <div>
                            <p className="text-sm font-bold">
                              {slot.label}
                            </p>

                            <p className="mt-1 text-[10px] uppercase tracking-wide text-[#6F8796]">
                              {slot.status ===
                              "available"
                                ? "Available"
                                : slot.status ===
                                  "booked"
                                ? "Already booked"
                                : "Unavailable"}
                            </p>
                          </div>
                        </div>

                        {selected && (
                          <span className="rounded-full bg-[#FFD400] px-2 py-1 text-[9px] font-black uppercase text-[#061A2B]">
                            Selected
                          </span>
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
              <CalendarDays
                className="mx-auto text-[#6F8796]"
                size={28}
              />

              <p className="mt-3 font-semibold">
                Select an available date
              </p>

              <p className="mt-1 text-sm text-[#6F8796]">
                Your available appointment times
                will appear here.
              </p>
            </div>
          )}
        </>
      )}

      {!loading && availability.length === 0 && !error && (
        <div className="mt-6 text-center">
          <p className="text-sm text-[#A8BBC8]">
            No availability is currently loaded.
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="mt-3 text-sm font-bold text-[#FFD400]"
          >
            Refresh availability
          </button>
        </div>
      )}
    </div>
  );
}