import {
  Clock3,
  MapPin,
  Siren,
} from "lucide-react";

interface ServiceDetailsProps {
  estimatedTime?: string;
  onSiteService?: boolean;
  emergencyService?: boolean;
}

interface DetailItem {
  label: string;
  value: string;
  icon: typeof Clock3;
}

export default function ServiceDetails({
  estimatedTime,
  onSiteService,
  emergencyService,
}: ServiceDetailsProps) {
  const details: DetailItem[] = [];

  if (estimatedTime?.trim()) {
    details.push({
      label: "Estimated Time",
      value: estimatedTime,
      icon: Clock3,
    });
  }

  if (onSiteService) {
    details.push({
      label: "Service Location",
      value: "At your vehicle",
      icon: MapPin,
    });
  }

  if (emergencyService) {
    details.push({
      label: "Emergency",
      value: "Available where applicable",
      icon: Siren,
    });
  }

  if (!details.length) {
    return null;
  }

  return (
    <section className="bg-[#EAF0F4] text-[#061A2B]">
      <div className="mx-auto max-w-[1420px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.4fr_0.6fr] lg:gap-24">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#061A2B]/45">
                Service Details
              </span>
            </div>

            <h2 className="mt-6 max-w-md text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl">
              The practical details.
            </h2>
          </div>

          <div className="divide-y divide-[#061A2B]/10 border-y border-[#061A2B]/10">
            {details.map((detail) => {
              const Icon = detail.icon;

              return (
                <div
                  key={detail.label}
                  className="flex items-center gap-5 py-6 sm:py-7"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#061A2B] text-[#FFD400]">
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#061A2B]/35">
                      {detail.label}
                    </p>

                    <p className="mt-1 text-base font-semibold text-[#061A2B]/80 sm:text-lg">
                      {detail.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}