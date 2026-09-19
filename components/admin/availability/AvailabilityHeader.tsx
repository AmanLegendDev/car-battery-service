import {
  CalendarClock,
  RefreshCw,
} from "lucide-react";

interface AvailabilityHeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
}

export default function AvailabilityHeader({
  onRefresh,
  refreshing,
}: AvailabilityHeaderProps) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#FFD400]/15 bg-[#FFD400]/5 px-3 py-1.5 text-xs font-medium text-[#FFD400]">
          <CalendarClock className="h-3.5 w-3.5" />
          Booking Availability
        </div>

        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
          Availability
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
          Manage working hours, blocked dates
          and individual appointment slots
          available to customers.
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshCw
          className={`h-4 w-4 ${
            refreshing
              ? "animate-spin"
              : ""
          }`}
        />

        Refresh
      </button>
    </header>
  );
}