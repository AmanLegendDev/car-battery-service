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
    <div className="relative mx-auto w-full max-w-[620px] lg:ml-auto">
      <div className="absolute -inset-8 rounded-[42px] bg-[#0D6E91]/10 blur-3xl" />

      <div className="relative aspect-[4/5] overflow-hidden rounded-[34px] border border-white/[0.1] bg-[#08263D] shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:rounded-[42px]">
        {image?.secureUrl ? (
          <Image
            src={image.secureUrl}
            alt={image.alt?.trim() || title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 620px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_35%,rgba(13,110,145,0.35),transparent_34%),linear-gradient(145deg,#08263D_0%,#061A2B_65%,#04121E_100%)]" />

            <div className="absolute left-[12%] top-[14%] h-40 w-40 rounded-full border border-white/[0.06]" />
            <div className="absolute left-[18%] top-[20%] h-28 w-28 rounded-full border border-[#FFD400]/10" />

            <div className="absolute left-1/2 top-[39%] flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[30px] border border-[#FFD400]/20 bg-[#061A2B]/70 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <BatteryCharging
                className="h-16 w-16 text-[#FFD400]"
                strokeWidth={1.4}
              />
            </div>

            <div className="absolute bottom-[22%] left-[12%] h-px w-[76%] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.3em] text-white/35">
              MOBILE BATTERY ASSISTANCE
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#061A2B]/90 via-transparent to-[#061A2B]/10" />

        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/[0.1] bg-[#061A2B]/65 px-3 py-2 backdrop-blur-xl sm:left-6 sm:top-6">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
            <Zap className="h-3.5 w-3.5 fill-current" />
          </span>

          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/80">
            Mobile Service
          </span>
        </div>

        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-6 sm:left-6 sm:right-6">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/45">
              Service
            </p>

            <p className="mt-1 max-w-[260px] text-lg font-semibold leading-tight text-white sm:text-xl">
              {title}
            </p>
          </div>

          {region ? (
            <div className="hidden shrink-0 items-center gap-2 rounded-full border border-white/[0.1] bg-[#061A2B]/65 px-3 py-2 backdrop-blur-xl sm:flex">
              <MapPin className="h-3.5 w-3.5 text-[#FFD400]" />

              <span className="text-[10px] font-semibold text-white/75">
                {region}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-white/[0.1] bg-[#08263D]/90 px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:block lg:-left-8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFD400] text-[#061A2B]">
            <BatteryCharging className="h-4 w-4" strokeWidth={2} />
          </span>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">
              Battery Assistance
            </p>
            <p className="mt-0.5 text-xs font-semibold text-white/90">
              At your vehicle
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}