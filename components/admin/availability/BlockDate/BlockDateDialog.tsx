"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Ban,
  X,
} from "lucide-react";

interface BlockDateDialogProps {
  open: boolean;
  selectedDate: string;
  selectedSlotCount: number;
  saving: boolean;
  hasExistingFullDayBlock: boolean;
  onClose: () => void;
  onConfirm: (input: {
    allDayBlocked: boolean;
    reason: string;
  }) => void;
}

function formatDate(
  date: string,
) {
  if (!date) return "";

  return new Date(
    `${date}T12:00:00`,
  ).toLocaleDateString(
    "en-AU",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );
}

export default function BlockDateDialog({
  open,
  selectedDate,
  selectedSlotCount,
  saving,
  hasExistingFullDayBlock,
  onClose,
  onConfirm,
}: BlockDateDialogProps) {
  const [allDayBlocked, setAllDayBlocked] =
    useState(false);

  const [reason, setReason] =
    useState("");

  useEffect(() => {
    if (!open) {
      setAllDayBlocked(false);
      setReason("");
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#071521] shadow-2xl shadow-black/50">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
          <div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[#FFD400]/15 bg-[#FFD400]/5">
              <Ban className="h-5 w-5 text-[#FFD400]" />
            </div>

            <h2 className="text-xl font-semibold text-white">
              Block Availability
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {formatDate(selectedDate)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {hasExistingFullDayBlock ? (
            <div className="flex gap-3 rounded-2xl border border-red-400/10 bg-red-400/[0.04] p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

              <p className="text-sm leading-6 text-red-300">
                This date is already blocked for
                the entire day. Saving again will
                keep it as a full-day block.
              </p>
            </div>
          ) : null}

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <input
              type="checkbox"
              checked={allDayBlocked}
              onChange={(event) =>
                setAllDayBlocked(
                  event.target.checked,
                )
              }
              className="mt-1 h-4 w-4 accent-[#FFD400]"
            />

            <span>
              <span className="block text-sm font-semibold text-white">
                Block entire day
              </span>

              <span className="mt-1 block text-xs leading-5 text-zinc-600">
                All 9 appointment slots will
                become unavailable.
              </span>
            </span>
          </label>

          {!allDayBlocked ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-sm font-medium text-zinc-300">
                Selected slots
              </p>

              <p className="mt-1 text-2xl font-semibold text-white">
                {selectedSlotCount}
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                One-hour appointment slots will
                be blocked.
              </p>
            </div>
          ) : null}

          <div>
            <label
              htmlFor="availability-reason"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Internal reason
              <span className="ml-1 text-zinc-600">
                (optional)
              </span>
            </label>

            <textarea
              id="availability-reason"
              value={reason}
              onChange={(event) =>
                setReason(event.target.value)
              }
              maxLength={300}
              rows={3}
              placeholder="e.g. Personal appointment"
              className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-[#FFD400]/40"
            />

            <p className="mt-1 text-right text-[11px] text-zinc-700">
              {reason.length}/300
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 p-5 sm:flex-row sm:justify-end sm:p-6">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-11 rounded-xl border border-white/10 px-5 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={
              saving ||
              (!allDayBlocked &&
                selectedSlotCount === 0)
            }
            onClick={() =>
              onConfirm({
                allDayBlocked,
                reason: reason.trim(),
              })
            }
            className="h-11 rounded-xl bg-[#FFD400] px-5 text-sm font-semibold text-[#061A2B] transition hover:bg-[#F5B800] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving
              ? "Saving..."
              : allDayBlocked
                ? "Block Entire Day"
                : "Block Selected Slots"}
          </button>
        </div>
      </div>
    </div>
  );
}