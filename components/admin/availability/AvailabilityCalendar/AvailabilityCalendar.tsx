"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { AvailabilityRecord } from "@/lib/availability/availability.types";

interface AvailabilityCalendarProps {
  selectedDate: string;
  records: AvailabilityRecord[];
  onSelectDate: (date: string) => void;
}

function formatDateKey(
  year: number,
  month: number,
  day: number,
) {
  return `${year}-${String(month + 1).padStart(
    2,
    "0",
  )}-${String(day).padStart(2, "0")}`;
}

export default function AvailabilityCalendar({
  selectedDate,
  records,
  onSelectDate,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] =
    useState(() => {
      const now = new Date();

      return new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      );
    });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(
    year,
    month + 1,
    0,
  ).getDate();

  const firstDay = new Date(
    year,
    month,
    1,
  ).getDay();

  const cells = useMemo(() => {
    const result: Array<
      number | null
    > = [];

    for (let i = 0; i < firstDay; i++) {
      result.push(null);
    }

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      result.push(day);
    }

    return result;
  }, [daysInMonth, firstDay]);

  const recordMap = useMemo(
    () =>
      new Map(
        records.map((record) => [
          record.date,
          record,
        ]),
      ),
    [records],
  );

  const monthLabel =
    currentMonth.toLocaleDateString(
      "en-AU",
      {
        month: "long",
        year: "numeric",
      },
    );

  const todayKey = (() => {
    const now = new Date();

    return formatDateKey(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
  })();

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            setCurrentMonth(
              new Date(
                year,
                month - 1,
                1,
              ),
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:bg-white/[0.07] hover:text-white"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <p className="text-sm font-semibold text-white">
          {monthLabel}
        </p>

        <button
          type="button"
          onClick={() =>
            setCurrentMonth(
              new Date(
                year,
                month + 1,
                1,
              ),
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:bg-white/[0.07] hover:text-white"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7">
        {[
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
        ].map((day) => (
          <div
            key={day}
            className="py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-zinc-600"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((day, index) => {
          if (day === null) {
            return (
              <div
                key={`empty-${index}`}
                className="aspect-square"
              />
            );
          }

          const date = formatDateKey(
            year,
            month,
            day,
          );

          const record =
            recordMap.get(date);

          const isSelected =
            selectedDate === date;

          const isToday =
            todayKey === date;

          const isBlocked =
            record?.allDayBlocked === true;

          const hasSlotBlocks =
            !isBlocked &&
            Boolean(
              record &&
                record.timeBlocks.length,
            );

          return (
            <button
              key={date}
              type="button"
              onClick={() =>
                onSelectDate(date)
              }
              className={[
                "relative aspect-square rounded-xl border text-sm transition",
                isSelected
                  ? "border-[#FFD400]/60 bg-[#FFD400]/10 text-[#FFD400]"
                  : "border-transparent bg-white/[0.025] text-zinc-400 hover:border-white/10 hover:bg-white/[0.06] hover:text-white",
                isBlocked
                  ? "border-red-400/20 bg-red-400/5 text-red-300"
                  : "",
              ].join(" ")}
            >
              <span
                className={
                  isToday
                    ? "font-bold"
                    : ""
                }
              >
                {day}
              </span>

              {isToday ? (
                <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#FFD400]" />
              ) : null}

              {isBlocked ? (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-400" />
              ) : hasSlotBlocks ? (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-orange-400" />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-4 border-t border-white/5 pt-4 text-[11px] text-zinc-600">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#FFD400]" />
          Today
        </span>

        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-orange-400" />
          Slot blocks
        </span>

        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          Full day blocked
        </span>
      </div>
    </div>
  );
}