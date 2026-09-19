"use client";

import {
  Ban,
  CalendarDays,
  Clock3,
  Trash2,
} from "lucide-react";

import type { AvailabilityRecord } from "@/lib/availability/availability.types";

interface BlockedListProps {
  records: AvailabilityRecord[];
  onRemove: (id: string) => void;
}

function formatDate(
  date: string,
) {
  return new Date(
    `${date}T12:00:00`,
  ).toLocaleDateString(
    "en-AU",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
}

export default function BlockedList({
  records,
  onRemove,
}: BlockedListProps) {
  const sortedRecords = [...records].sort(
    (a, b) =>
      a.date.localeCompare(b.date),
  );

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">
          Blocked Availability
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Review and remove dates or time blocks
          that are no longer needed.
        </p>
      </div>

      {sortedRecords.length === 0 ? (
        <div className="flex min-h-36 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/10 px-5 text-center">
          <div>
            <CalendarDays className="mx-auto h-7 w-7 text-zinc-700" />

            <p className="mt-3 text-sm text-zinc-500">
              No blocked availability yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedRecords.map((record) => (
            <div
              key={record.id}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/10 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {record.allDayBlocked ? (
                    <Ban className="h-4 w-4 text-red-400" />
                  ) : (
                    <Clock3 className="h-4 w-4 text-orange-400" />
                  )}

                  <p className="text-sm font-semibold text-white">
                    {formatDate(record.date)}
                  </p>
                </div>

                <p className="mt-1 text-xs text-zinc-600">
                  {record.allDayBlocked
                    ? "Entire day blocked"
                    : `${record.timeBlocks.length} blocked slot${
                        record.timeBlocks.length ===
                        1
                          ? ""
                          : "s"
                      }`}
                </p>

                {!record.allDayBlocked &&
                record.timeBlocks.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {record.timeBlocks.map(
                      (block) => (
                        <span
                          key={`${block.start}-${block.end}`}
                          className="rounded-lg border border-orange-400/10 bg-orange-400/[0.04] px-2.5 py-1 text-[11px] text-orange-300"
                        >
                          {block.start} –{" "}
                          {block.end}
                        </span>
                      ),
                    )}
                  </div>
                ) : null}

                {record.reason ? (
                  <p className="mt-3 text-xs text-zinc-600">
                    Reason: {record.reason}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() =>
                  onRemove(record.id)
                }
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-red-400/10 bg-red-400/[0.03] px-4 text-xs font-medium text-red-300 transition hover:border-red-400/20 hover:bg-red-400/[0.07]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove Block
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}