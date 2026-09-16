import ServiceAreaListItem from "./ServiceAreaListItem";
import type { ServiceAreaListingItem } from "../ServiceAreasListingPage";

interface ServiceAreasDirectoryProps {
  serviceAreas: ServiceAreaListingItem[];
}

export default function ServiceAreasDirectory({
  serviceAreas,
}: ServiceAreasDirectoryProps) {
  return (
    <section className="bg-[#F8FAFC] text-[#061A2B]">
      <div className="mx-auto max-w-[1420px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        {/* Section header */}
        <div className="grid gap-8 border-b border-[#061A2B]/10 pb-10 lg:grid-cols-[1fr_0.45fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#061A2B]/40">
                Coverage Directory
              </span>
            </div>

            <h2 className="mt-5 max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              Find your location.
              <br />
              <span className="text-[#061A2B]/30">
                Then explore the details.
              </span>
            </h2>
          </div>

          <div className="lg:pb-1">
            <p className="text-sm leading-7 text-[#061A2B]/50">
              Each listed area has its own service information,
              coverage details and local context.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-2xl font-semibold tracking-[-0.04em]">
                {String(serviceAreas.length).padStart(2, "0")}
              </span>

              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#061A2B]/35">
                Listed locations
              </span>
            </div>
          </div>
        </div>

        {/* Directory */}
        <div className="mt-10 sm:mt-14">
          {serviceAreas.map((serviceArea, index) => (
            <ServiceAreaListItem
              key={serviceArea.id}
              serviceArea={serviceArea}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}