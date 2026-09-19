import {
  CalendarCheck2,
  CalendarOff,
  Clock3,
} from "lucide-react";

interface AvailabilityStatsProps {
  workingDays: number;
  blockedDates: number;
  blockedSlots: number;
  totalDailySlots: number;
}

export default function AvailabilityStats({
  workingDays,
  blockedDates,
  blockedSlots,
  totalDailySlots,
}: AvailabilityStatsProps) {
  const stats = [
    {
      label: "Working Days",
      value: workingDays,
      description: "Monday to Sunday",
      icon: CalendarCheck2,
    },
    {
      label: "Blocked Dates",
      value: blockedDates,
      description: "Full-day closures",
      icon: CalendarOff,
    },
    {
      label: "Blocked Slots",
      value: blockedSlots,
      description: `${totalDailySlots} slots per day`,
      icon: Clock3,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <Icon className="h-5 w-5 text-[#FFD400]" />
              </div>

              <span className="text-3xl font-semibold tracking-tight text-white">
                {stat.value}
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-zinc-300">
              {stat.label}
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              {stat.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}