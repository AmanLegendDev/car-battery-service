
import Image from "next/image";
import { BatteryCharging, MapPin, Zap } from "lucide-react";

interface ServiceHeroVisualProps {
  title: string;
  image?: {
    secureUrl: string;
    width: number;
    height: number;
    alt?: string;
  } | null;
  region?: string;
}

export default function ServiceHeroVisual({
  title,
  image,
  region,
}: ServiceHeroVisualProps) {
  return (
    <section
      aria-label={`${title} service`}
      className="relative isolate w-full"
    >
      {/* Ambient image glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 -z-10 rounded-[32px] bg-[#0D6E91]/15 blur-2xl sm:-inset-5 sm:rounded-[40px]"
      />

      {/* Wide landscape hero */}
      <div className="relative isolate min-h-[390px] overflow-hidden rounded-[24px] border border-white/[0.12] bg-[#08263D] shadow-[0_28px_90px_rgba(0,0,0,0.32)] sm:min-h-[460px] sm:rounded-[32px] lg:min-h-[510px]">
        {/* Background image */}
        {image?.secureUrl ? (
          <Image
            src={image.secureUrl}
            alt={image.alt?.trim() || title}
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 94vw, 1380px"
            className="object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_25%,rgba(13,110,145,0.55),transparent_45%),linear-gradient(120deg,#08263D_0%,#0D344B_45%,#061A2B_100%)]" />

            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:48px_48px]"
            />

            <div className="absolute right-[9%] top-[16%] flex h-36 w-36 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] sm:h-48 sm:w-48">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#FFD400]/25 bg-[#061A2B]/50 sm:h-32 sm:w-32">
                <BatteryCharging
                  className="h-12 w-12 text-[#FFD400] sm:h-16 sm:w-16"
                  strokeWidth={1.3}
                />
              </div>
            </div>
          </div>
        )}

        {/* Readability overlays */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#061A2B]/90 via-[#061A2B]/55 to-[#061A2B]/10"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#061A2B]/95 via-[#061A2B]/15 to-[#061A2B]/20"
        />

        {/* Top service badge */}
        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3 sm:left-7 sm:right-7 sm:top-7 lg:left-9 lg:right-9 lg:top-9">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-[#061A2B]/65 px-3 py-2 backdrop-blur-md sm:px-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
              <Zap className="h-3.5 w-3.5 fill-current" />
            </span>

            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white sm:text-[10px] sm:tracking-[0.2em]">
              Mobile Automotive Service
            </span>
          </div>

          {region ? (
            <div className="hidden shrink-0 items-center gap-2 rounded-full border border-white/15 bg-[#061A2B]/65 px-4 py-3 backdrop-blur-md sm:inline-flex">
              <MapPin className="h-4 w-4 text-[#FFD400]" />

              <span className="max-w-[220px] truncate text-xs font-semibold text-white/90">
                {region}
              </span>
            </div>
          ) : null}
        </div>

        {/* Main title overlay */}
        <div className="absolute inset-x-0 bottom-0 flex min-h-full items-end px-5 pb-7 pt-28 sm:px-8 sm:pb-9 sm:pt-32 lg:px-11 lg:pb-11">
          <div className="max-w-[950px]">
            <div className="mb-4 flex items-center gap-3 sm:mb-5">
              <span className="h-[2px] w-9 bg-[#FFD400] sm:w-12" />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/75 sm:text-xs sm:tracking-[0.28em]">
                Rapid Auto Services
              </span>
            </div>

            <h1 className="max-w-[950px] text-[clamp(2.35rem,6.5vw,5.75rem)] font-bold leading-[0.98] tracking-[-0.055em] text-[#F8FAFC] [overflow-wrap:break-word] [text-wrap:balance]">
              {title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 sm:mt-6">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-white/80 sm:text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />
                Professional Automotive Care
              </span>

              {region ? (
                <span className="inline-flex items-center gap-2 text-xs font-medium text-white/80 sm:hidden">
                  <MapPin className="h-3.5 w-3.5 text-[#FFD400]" />
                  {region}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom-right accent */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 h-1 w-1/3 bg-gradient-to-l from-[#FFD400] via-[#FFD400]/45 to-transparent"
        />
      </div>
    </section>
  );
}
