import ServiceListItem from "./ServiceListItem";

interface ServicesDirectoryProps {
  services: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    heroImage: {
      secureUrl: string;
      width: number;
      height: number;
      alt: string;
    } | null;
    estimatedTime: string;
    emergencyService: boolean;
    onSiteService: boolean;
    ctaText: string;
  }[];
}

export default function ServicesDirectory({
  services,
}: ServicesDirectoryProps) {
  if (!services.length) {
    return null;
  }

  return (
    <section className="bg-[#F8FAFC] text-[#061A2B]">
      <div className="mx-auto max-w-[1420px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        {/* Section heading */}
        <div className="grid gap-8 border-b border-[#061A2B]/10 pb-10 lg:grid-cols-[0.55fr_0.45fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#061A2B]/45">
                Service Directory
              </span>
            </div>

            <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Choose the service that fits the situation.
            </h2>
          </div>

          <div className="lg:ml-auto lg:max-w-md">
            <p className="text-sm leading-7 text-[#061A2B]/50 sm:text-base">
              Explore the mobile battery services currently available from Car
              Battery Service.
            </p>

            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#061A2B]/30">
              {services.length}{" "}
              {services.length === 1 ? "service" : "services"} available
            </p>
          </div>
        </div>

        {/* Directory */}
        <div>
          {services.map((service, index) => (
            <ServiceListItem
              key={service.id}
              service={service}
              index={index}
            />
          ))}

          <div className="border-t border-[#061A2B]/10" />
        </div>
      </div>
    </section>
  );
}