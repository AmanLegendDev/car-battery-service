"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, RefreshCw } from "lucide-react";

import AvailabilityHeader from "./AvailabilityHeader";
import AvailabilityStats from "./AvailabilityStats";
import WorkingSchedule from "./WorkingSchedule/WorkingSchedule";
import AvailabilityCalendar from "./AvailabilityCalendar/AvailabilityCalendar";
import SlotManager from "./SlotManager/SlotManager";
import BlockDateDialog from "./BlockDate/BlockDateDialog";
import BlockedList from "./BlockedList/BlockedList";

import type {
  AvailabilityRecord,
  AppointmentSlot,
} from "@/lib/availability/availability.types";

import { generateDailySlots } from "@/lib/availability/availability.utils";

export default function AvailabilityPage() {
  const [records, setRecords] = useState<
    AvailabilityRecord[]
  >([]);

  const [selectedDate, setSelectedDate] =
    useState<string>("");

  const [selectedSlots, setSelectedSlots] =
    useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const dailySlots = useMemo(
    () => generateDailySlots(),
    [],
  );

  async function loadAvailability(
    showRefresh = false,
  ) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(
        "/api/admin/availability",
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load availability.",
        );
      }

      setRecords(data.data ?? []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load availability.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadAvailability();
  }, []);

  const selectedRecord =
    records.find(
      (record) =>
        record.date === selectedDate,
    ) ?? null;

  const blockedSlotKeys = useMemo(() => {
    if (!selectedRecord) {
      return new Set<string>();
    }

    const keys = new Set<string>();

    for (const block of selectedRecord.timeBlocks) {
      keys.add(`${block.start}-${block.end}`);
    }

    return keys;
  }, [selectedRecord]);

  const blockedDatesCount = records.filter(
    (record) => record.allDayBlocked,
  ).length;

  const blockedSlotsCount =
    records.reduce(
      (total, record) =>
        total + record.timeBlocks.length,
      0,
    );

  function handleDateSelect(date: string) {
    setSelectedDate(date);
    setSelectedSlots([]);
    setError("");
  }

  function toggleSlot(slot: AppointmentSlot) {
    if (!selectedDate) {
      return;
    }

    const key = `${slot.start}-${slot.end}`;

    if (blockedSlotKeys.has(key)) {
      return;
    }

    setSelectedSlots((current) =>
      current.includes(key)
        ? current.filter(
            (item) => item !== key,
          )
        : [...current, key],
    );
  }

  function openBlockDialog() {
    if (!selectedDate) {
      setError(
        "Select a date before blocking availability.",
      );
      return;
    }

    setDialogOpen(true);
  }

  async function saveBlock(input: {
    allDayBlocked: boolean;
    reason: string;
  }) {
    if (!selectedDate) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const selectedTimeBlocks =
        input.allDayBlocked
          ? []
          : dailySlots
              .filter((slot) =>
                selectedSlots.includes(
                  `${slot.start}-${slot.end}`,
                ),
              )
              .map((slot) => ({
                start: slot.start,
                end: slot.end,
              }));

      const response = await fetch(
        "/api/admin/availability",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            date: selectedDate,
            allDayBlocked:
              input.allDayBlocked,
            timeBlocks:
              selectedTimeBlocks,
            reason: input.reason,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to save availability.",
        );
      }

      setDialogOpen(false);
      setSelectedSlots([]);

      await loadAvailability(true);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save availability.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeBlock(
    id: string,
  ) {
    try {
      setError("");

      const response = await fetch(
        `/api/admin/availability/${id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to remove block.",
        );
      }

      if (
        records.find(
          (record) => record.id === id,
        )?.date === selectedDate
      ) {
        setSelectedSlots([]);
      }

      await loadAvailability(true);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to remove block.",
      );
    }
  }

  return (
    <div className="min-h-full space-y-8">
      <AvailabilityHeader
        onRefresh={() =>
          void loadAvailability(true)
        }
        refreshing={refreshing}
      />

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <AvailabilityStats
        workingDays={7}
        blockedDates={blockedDatesCount}
        blockedSlots={blockedSlotsCount}
        totalDailySlots={dailySlots.length}
      />

      <WorkingSchedule />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 shadow-2xl shadow-black/10 sm:p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-[#FFD400]" />

                <h2 className="text-lg font-semibold text-white">
                  Availability Calendar
                </h2>
              </div>

              <p className="mt-1 text-sm text-zinc-500">
                Select a date to manage its
                appointment slots.
              </p>
            </div>

            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin text-zinc-500" />
            ) : null}
          </div>

          <AvailabilityCalendar
            selectedDate={selectedDate}
            records={records}
            onSelectDate={handleDateSelect}
          />
        </section>

        <SlotManager
          selectedDate={selectedDate}
          slots={dailySlots}
          selectedSlots={selectedSlots}
          blockedSlotKeys={blockedSlotKeys}
          selectedRecord={selectedRecord}
          onToggleSlot={toggleSlot}
          onBlock={openBlockDialog}
          saving={saving}
        />
      </div>

      <BlockedList
        records={records}
        onRemove={removeBlock}
      />

      <BlockDateDialog
        open={dialogOpen}
        selectedDate={selectedDate}
        selectedSlotCount={
          selectedSlots.length
        }
        saving={saving}
        hasExistingFullDayBlock={
          selectedRecord?.allDayBlocked === true
        }
        onClose={() => {
          if (!saving) {
            setDialogOpen(false);
          }
        }}
        onConfirm={saveBlock}
      />
    </div>
  );
}