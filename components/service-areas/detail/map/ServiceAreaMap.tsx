import {
  ArrowUpRight,
  ExternalLink,
  MapPin,
} from "lucide-react";

interface ServiceAreaMapProps {
  serviceAreaName: string;
  mapUrl: string;
}

export default function ServiceAreaMap({
  serviceAreaName,
  mapUrl,
}: ServiceAreaMapProps) {
  if (!mapUrl) {
    return null;
  }

  return (
    <section className="bg-[#F8FAFC] text-[#061A2B]">
      <div className="mx-auto max-w-[1420px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-stretch lg:gap-14">
          {/* Intro */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#061A2B] text-[#FFD400]">
                  <MapPin
                    className="h-3.5 w-3.5"
                    strokeWidth={1.8}
                  />
                </span>

                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#061A2B]/40">
                  Location
                </span>
              </div>

              <h2 className="mt-6 max-w-xl text-4xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-5xl lg:text-6xl">
                Find the
                <br />
                <span className="text-[#061A2B]/30">
                  {serviceAreaName} area.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-[#061A2B]/50">
                Use the map provided by the business to explore the
                location information for this service area.
              </p>
            </div>

            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 inline-flex min-h-12 w-fit items-center gap-3 rounded-full bg-[#061A2B] pl-5 pr-1.5 text-sm font-semibold text-[#F8FAFC] transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>Open map</span>

              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B] transition-transform duration-300 group-hover:rotate-45">
                <ExternalLink
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              </span>
            </a>
          </div>

          {/* Map */}
          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-[#061A2B]/10 bg-[#E9EEF1] sm:min-h-[520px]">
            <iframe
              src={mapUrl}
              title={`${serviceAreaName} location map`}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />

            {/* Floating label */}
            <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-3 rounded-full border border-white/20 bg-[#061A2B]/75 px-4 py-2.5 text-white shadow-lg backdrop-blur-md sm:left-7 sm:top-7">
              <MapPin
                className="h-3.5 w-3.5 text-[#FFD400]"
                strokeWidth={1.8}
              />

              <span className="text-[9px] font-bold uppercase tracking-[0.18em]">
                {serviceAreaName}
              </span>
            </div>

            <div className="pointer-events-none absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B] shadow-lg sm:bottom-7 sm:right-7">
              <ArrowUpRight
                className="h-4 w-4"
                strokeWidth={1.8}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}