"use client";

import {
  Ban,
  CalendarDays,
  Check,
  LockKeyhole,
} from "lucide-react";

import type {
  AppointmentSlot,
  AvailabilityRecord,
} from "@/lib/availability/availability.types";

interface SlotManagerProps {
  selectedDate: string;
  slots: AppointmentSlot[];
  selectedSlots: string[];
  blockedSlotKeys: Set<string>;
  selectedRecord: AvailabilityRecord | null;
  onToggleSlot: (
    slot: AppointmentSlot,
  ) => void;
  onBlock: () => void;
  saving: boolean;
}

function formatSelectedDate(
  date: string,
) {
  if (!date) {
    return "No date selected";
  }

  const parsed = new Date(
    `${date}T12:00:00`,
  );

  return parsed.toLocaleDateString(
    "en-AU",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );
}

export default function SlotManager({
  selectedDate,
  slots,
  selectedSlots,
  blockedSlotKeys,
  selectedRecord,
  onToggleSlot,
  onBlock,
  saving,
}: SlotManagerProps) {
  const fullDayBlocked =
    selectedRecord?.allDayBlocked === true;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-[#FFD400]" />

          <h2 className="text-lg font-semibold text-white">
            Appointment Slots
          </h2>
        </div>

        <p className="mt-1 text-sm text-zinc-500">
          {formatSelectedDate(
            selectedDate,
          )}
        </p>
      </div>

      {!selectedDate ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/10 px-6 text-center">
          <CalendarDays className="h-8 w-8 text-zinc-700" />

          <p className="mt-4 text-sm font-medium text-zinc-400">
            Select a date
          </p>

          <p className="mt-1 max-w-xs text-xs leading-5 text-zinc-600">
            Choose a date from the calendar to
            view and manage its appointment
            slots.
          </p>
        </div>
      ) : fullDayBlocked ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-red-400/10 bg-red-400/[0.03] px-6 text-center">
          <Ban className="h-8 w-8 text-red-400" />

          <p className="mt-4 text-sm font-semibold text-red-300">
            Entire day is blocked
          </p>

          <p className="mt-1 max-w-xs text-xs leading-5 text-zinc-600">
            All appointment slots for this date
            are currently unavailable.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {slots.map((slot) => {
              const key = `${slot.start}-${slot.end}`;

              const isBlocked =
                blockedSlotKeys.has(key);

              const isSelected =
                selectedSlots.includes(key);

              return (
                <button
                  key={key}
                  type="button"
                  disabled={isBlocked}
                  onClick={() =>
                    onToggleSlot(slot)
                  }
                  className={[
                    "flex min-h-14 items-center justify-between rounded-xl border px-4 text-left transition",
                    isBlocked
                      ? "cursor-not-allowed border-red-400/10 bg-red-400/[0.03] text-red-300"
                      : isSelected
                        ? "border-[#FFD400]/40 bg-[#FFD400]/10 text-[#FFD400]"
                        : "border-white/10 bg-white/[0.02] text-zinc-300 hover:border-white/20 hover:bg-white/[0.06]",
                  ].join(" ")}
                >
                  <span className="text-sm font-medium">
                    {slot.label}
                  </span>

                  {isBlocked ? (
                    <LockKeyhole className="h-4 w-4" />
                  ) : isSelected ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-600">
                      Select
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-white/5 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-300">
                {selectedSlots.length > 0
                  ? `${selectedSlots.length} slot${
                      selectedSlots.length === 1
                        ? ""
                        : "s"
                    } selected`
                  : "No slots selected"}
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Select one or more slots to block.
              </p>
            </div>

            <button
              type="button"
              onClick={onBlock}
              disabled={
                saving ||
                selectedSlots.length === 0
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-5 text-sm font-semibold text-[#061A2B] transition hover:bg-[#F5B800] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Ban className="h-4 w-4" />
              Block Selected
            </button>
          </div>
        </>
      )}
    </section>
  );
}