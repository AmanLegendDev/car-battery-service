import {
  BatteryCharging,
  MessageCircle,
  Navigation,
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
    icon: BatteryCharging,
    number: "01",
    title: "Battery focused",
    description:
      "The service is focused specifically on common car battery needs and assistance.",
  },
  {
    icon: Navigation,
    number: "02",
    title: "Mobile by nature",
    description:
      "The service model is built around helping customers at their vehicle's location.",
  },
  {
    icon: MessageCircle,
    number: "03",
    title: "Simple communication",
    description:
      "Customers can use direct contact options or the dedicated booking flow to get started.",
  },
] as const;

export default function AboutValues({
  business,
}: AboutValuesProps) {
  return (
    <section className="relative overflow-hidden bg-[#061A2B] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
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
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFD400]">
            How We Work
          </span>

          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#F8FAFC] sm:text-4xl lg:text-5xl">
            Built around the problem in front of you.
          </h2>

          <p className="mt-5 text-base leading-8 text-[#A8BBC8]">
            {business.businessName} keeps its service focus
            straightforward: mobile battery assistance for
            customers who need help with a battery-related
            problem.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {VALUES.map((value) => {
            const Icon = value.icon;

            return (
              <article
                key={value.number}
                className="group rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFD400] text-[#061A2B]">
                    <Icon size={21} />
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
      </div>
    </section>
  );
}