import WorkingDayRow from "./WorkingDayRow";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function WorkingSchedule() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">
          Working Schedule
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Standard appointment hours used to
          generate one-hour booking slots.
        </p>
      </div>

      <div className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/5">
        {days.map((day) => (
          <WorkingDayRow
            key={day}
            day={day}
          />
        ))}
      </div>
    </section>
  );
}