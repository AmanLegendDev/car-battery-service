
import {
  ArrowUpRight,
  CarFront,
  MapPin,
  Settings2,
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
  const businessName =
    business.businessName || "Mobile Car Services";

  const description =
    business.description ||
    `${businessName} provides convenient mobile automotive assistance, helping customers with vehicle servicing, battery services and other vehicle-related needs. Contact our team to discuss your requirements and confirm service availability.`;

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          {/* Section heading */}
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0D6E91]">
              About {businessName}
            </span>

            <h2 className="mt-4 max-w-md text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#061A2B] sm:text-4xl">
              Professional car care, wherever you are.
            </h2>

            <p className="mt-5 max-w-md text-base leading-8 text-[#5F7482]">
              Practical automotive support designed around
              your vehicle, your location and your needs.
            </p>
          </div>

          {/* Main content */}
          <div className="max-w-3xl">
            <p className="text-xl font-medium leading-9 tracking-[-0.015em] text-[#061A2B] sm:text-2xl">
              {description}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {/* Automotive assistance */}
              <div className="rounded-[1.5rem] border border-[#08263D]/10 bg-white p-6 shadow-[0_12px_40px_rgba(6,26,43,0.035)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#061A2B] text-[#FFD400]">
                  <CarFront size={20} />
                </div>

                <h3 className="mt-6 text-lg font-semibold text-[#061A2B]">
                  Automotive assistance
                </h3>

                <p className="mt-2 text-sm leading-7 text-[#5F7482]">
                  From vehicle maintenance to battery services
                  and roadside assistance, our team can help
                  you explore the right service for your needs.
                </p>
              </div>

              {/* Convenient mobile service */}
              <div className="rounded-[1.5rem] border border-[#08263D]/10 bg-white p-6 shadow-[0_12px_40px_rgba(6,26,43,0.035)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFD400] text-[#061A2B]">
                  <Settings2 size={20} />
                </div>

                <h3 className="mt-6 text-lg font-semibold text-[#061A2B]">
                  Convenient mobile care
                </h3>

                <p className="mt-2 text-sm leading-7 text-[#5F7482]">
                  Get in touch to discuss your vehicle's
                  requirements, check service availability
                  and arrange a suitable appointment.
                </p>
              </div>
            </div>

            {/* Primary service region */}
            {business.primaryServiceRegion ? (
              <div className="mt-6 flex items-center justify-between gap-5 rounded-[1.5rem] border border-[#08263D]/10 bg-[#08263D] p-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#FFD400]">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A8BBC8]">
                      Primary Service Region
                    </p>

                    <p className="mt-2 text-lg font-semibold text-[#F8FAFC]">
                      {business.primaryServiceRegion}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#A8BBC8]">
                      Contact us to confirm availability in your area.
                    </p>
                  </div>
                </div>

                <ArrowUpRight
                  size={21}
                  className="shrink-0 text-[#FFD400]"
                  aria-hidden="true"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
