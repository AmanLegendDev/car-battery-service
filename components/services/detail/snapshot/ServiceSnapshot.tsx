import {
  BatteryCharging,
  Clock3,
  ShieldCheck,
  MapPin,
} from "lucide-react";

interface ServiceSnapshotProps {
  estimatedTime?: string;
  onSiteService?: boolean;
  emergencyService?: boolean;
}

interface SnapshotItem {
  label: string;
  value: string;
  icon: typeof Clock3;
}

export default function ServiceSnapshot({
  estimatedTime,
  onSiteService,
  emergencyService,
}: ServiceSnapshotProps) {
  const items: SnapshotItem[] = [];

  if (estimatedTime?.trim()) {
    items.push({
      label: "Estimated Time",
      value: estimatedTime,
      icon: Clock3,
    });
  }

  if (onSiteService) {
    items.push({
      label: "Service Type",
      value: "At your vehicle",
      icon: MapPin,
    });
  }

  if (emergencyService) {
    items.push({
      label: "Availability",
      value: "Emergency service",
      icon: ShieldCheck,
    });
  }

  items.push({
    label: "Category",
    value: "Battery service",
    icon: BatteryCharging,
  });

  return (
    <section className="bg-[#08263D] text-[#F8FAFC]">
      <div className="mx-auto max-w-[1420px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/45">
                At a Glance
              </span>
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Service snapshot
            </h2>
          </div>

          <span className="hidden text-xs text-white/30 sm:block">
            SERVICE DETAILS
          </span>
        </div>

        <div className="grid border-y border-white/[0.1] sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={`${item.label}-${index}`}
                className="group border-b border-white/[0.1] px-5 py-7 last:border-b-0 sm:border-r sm:px-6 sm:py-8 sm:nth-[2n]:border-r-0 lg:border-b-0 lg:nth-[2n]:border-r lg:last:border-r-0"
              >
                <div className="flex items-start justify-between gap-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.035] text-[#FFD400] transition-colors duration-300 group-hover:border-[#FFD400]/25 group-hover:bg-[#FFD400]/10">
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>

                  <span className="text-[10px] font-bold text-white/20">
                    0{index + 1}
                  </span>
                </div>

                <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                  {item.label}
                </p>

                <p className="mt-2 text-base font-semibold text-white/90">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}