import {
  ArrowUpRight,
  BatteryCharging,
  MapPin,
} from "lucide-react";

interface AboutStoryProps {
  business: {
    businessName: string;
    tagline: string;
    description: string;
    phone: string;
    primaryCallNumber: string;
    whatsapp: string;
    email: string;
    primaryServiceRegion: string;
  };
}

export default function AboutStory({
  business,
}: AboutStoryProps) {
  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          {/* Label */}
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0D6E91]">
              About The Service
            </span>

            <h2 className="mt-4 max-w-md text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#061A2B] sm:text-4xl">
              Practical battery assistance without unnecessary complexity.
            </h2>
          </div>

          {/* Content */}
          <div className="max-w-3xl">
            <p className="text-xl font-medium leading-9 tracking-[-0.015em] text-[#061A2B] sm:text-2xl">
              {business.description ||
                `${business.businessName} provides mobile car battery assistance for customers dealing with battery-related problems at their vehicle's location.`}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-[#08263D]/10 bg-white p-6 shadow-[0_12px_40px_rgba(6,26,43,0.035)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#061A2B] text-[#FFD400]">
                  <BatteryCharging size={20} />
                </div>

                <h3 className="mt-6 text-lg font-semibold text-[#061A2B]">
                  Battery-focused assistance
                </h3>

                <p className="mt-2 text-sm leading-7 text-[#5F7482]">
                  Services are focused on common car battery
                  needs, including replacement, testing and
                  jump start assistance.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-[#08263D]/10 bg-white p-6 shadow-[0_12px_40px_rgba(6,26,43,0.035)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFD400] text-[#061A2B]">
                  <MapPin size={20} />
                </div>

                <h3 className="mt-6 text-lg font-semibold text-[#061A2B]">
                  Mobile service
                </h3>

                <p className="mt-2 text-sm leading-7 text-[#5F7482]">
                  The service is designed around providing
                  Battery assistance at the customer&apos;s vehicle.
                  location.
                </p>
              </div>
            </div>

            {business.primaryServiceRegion ? (
              <div className="mt-6 flex items-center justify-between gap-5 rounded-[1.5rem] border border-[#08263D]/10 bg-[#08263D] p-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A8BBC8]">
                    Primary Service Region
                  </p>

                  <p className="mt-2 text-lg font-semibold text-[#F8FAFC]">
                    {business.primaryServiceRegion}
                  </p>
                </div>

                <ArrowUpRight
                  size={21}
                  className="shrink-0 text-[#FFD400]"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}