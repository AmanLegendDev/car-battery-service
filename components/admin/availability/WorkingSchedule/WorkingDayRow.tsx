import { CheckCircle2 } from "lucide-react";

interface WorkingDayRowProps {
  day: string;
}

export default function WorkingDayRow({
  day,
}: WorkingDayRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 bg-black/10 px-4 py-4 sm:px-5">
      <div>
        <p className="text-sm font-medium text-white">
          {day}
        </p>

        <p className="mt-0.5 text-xs text-zinc-600">
          9 one-hour appointment slots
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-zinc-300">
          8:00 AM – 5:00 PM
        </span>

        <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-2.5 py-1 text-[11px] font-medium text-emerald-400 sm:inline-flex">
          <CheckCircle2 className="h-3 w-3" />
          Open
        </span>
      </div>
    </div>
  );
}