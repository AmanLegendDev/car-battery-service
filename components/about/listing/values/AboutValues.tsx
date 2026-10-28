
import {
  CarFront,
  MapPin,
  MessageCircle,
} from "lucide-react";

interface AboutValuesProps {
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

const VALUES = [
  {
    icon: CarFront,
    number: "01",
    title: "Vehicle-focused care",
    description:
      "From vehicle maintenance to battery services and other automotive needs, the focus is on finding the right assistance for your vehicle.",
  },
  {
    icon: MapPin,
    number: "02",
    title: "Convenient mobile service",
    description:
      "Mobile assistance designed around your location. Contact the team to discuss your requirements and confirm service availability in your area.",
  },
  {
    icon: MessageCircle,
    number: "03",
    title: "Clear communication",
    description:
      "Get in touch to explain your vehicle's needs, understand the available service options and arrange a suitable appointment.",
  },
] as const;

export default function AboutValues({
  business,
}: AboutValuesProps) {
  const businessName =
    business.businessName || "Mobile Car Services";

  const serviceRegion =
    business.primaryServiceRegion ||
    "Melbourne West, Victoria";

  const description =
    business.description ||
    `${businessName} provides mobile automotive assistance, including vehicle maintenance, battery services and other vehicle-related support. Contact the team to discuss your requirements and confirm availability.`;

  return (
    <section className="relative overflow-hidden bg-[#061A2B] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      {/* Background effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 bottom-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[#0D6E91]/15 blur-[110px]" />

        <div className="absolute -right-40 top-[-10rem] h-[30rem] w-[30rem] rounded-full bg-[#FFD400]/[0.07] blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(248,250,252,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(248,250,252,0.8) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFD400]">
            What Guides Us
          </span>

          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#F8FAFC] sm:text-4xl lg:text-5xl">
            Automotive support built around you.
          </h2>

          <p className="mt-5 text-base leading-8 text-[#A8BBC8]">
            {description}
          </p>
        </div>

        {/* Core values */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {VALUES.map((value) => {
            const Icon = value.icon;

            return (
              <article
                key={value.number}
                className="group rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFD400] text-[#061A2B] transition-transform duration-300 group-hover:scale-105">
                    <Icon size={21} aria-hidden="true" />
                  </div>

                  <span className="text-[11px] font-bold tracking-[0.16em] text-[#A8BBC8]">
                    {value.number}
                  </span>
                </div>

                <h3 className="mt-8 text-xl font-semibold tracking-[-0.025em] text-[#F8FAFC]">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#A8BBC8]">
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>

        {/* Service region */}
        {business.primaryServiceRegion ? (
          <div className="mt-8 flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFD400]">
                Where We Operate
              </p>

              <p className="mt-2 text-lg font-semibold text-[#F8FAFC] sm:text-xl">
                {serviceRegion}
              </p>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#A8BBC8]">
                Contact our team to discuss your vehicle's
                requirements and confirm service availability
                in your area.
              </p>
            </div>

            <MapPin
              size={25}
              className="shrink-0 text-[#FFD400]"
              aria-hidden="true"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
