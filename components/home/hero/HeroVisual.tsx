import Image from "next/image";
import { BatteryCharging, MapPin } from "lucide-react";
import { HERO_DATA } from "./heroData";

export default function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* =========================================================
          MAIN HERO IMAGE
          ========================================================= */}
      <div className="absolute inset-0">
        <Image
          src={HERO_DATA.image.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="
            object-cover
            object-[73%_center]
            sm:object-[74%_center]
            lg:object-[72%_center]
            xl:object-[70%_center]
          "
        />
      </div>

      {/* =========================================================
          LEFT CONTENT READABILITY
          Strong on mobile, more transparent on desktop
          ========================================================= */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-r
          from-[#061A2B]
          via-[#061A2B]/[0.90]
          to-[#061A2B]/[0.34]
          lg:from-[#061A2B]
          lg:via-[#061A2B]/[0.78]
          lg:via-[44%]
          lg:to-transparent
        "
      />

      {/* =========================================================
          MOBILE EXTRA DARKNESS
          Keeps typography readable over the image
          ========================================================= */}
      <div className="absolute inset-0 bg-[#061A2B]/[0.16] lg:hidden" />

      {/* =========================================================
          TOP FADE
          Seamlessly connects hero with floating navbar
          ========================================================= */}
      <div
        className="
          absolute inset-x-0 top-0 h-32
          bg-gradient-to-b
          from-[#061A2B]/[0.68]
          to-transparent
          sm:h-36
        "
      />

      {/* =========================================================
          BOTTOM CINEMATIC FADE
          ========================================================= */}
      <div
        className="
          absolute inset-x-0 bottom-0 h-[42%]
          bg-gradient-to-t
          from-[#061A2B]
          via-[#061A2B]/[0.72]
          to-transparent
        "
      />

      {/* =========================================================
          BLUE AUTOMOTIVE ATMOSPHERE
          ========================================================= */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(
            circle_at_76%_42%,
            rgba(13,110,145,0.20),
            transparent_34%
          )]
        "
      />

      {/* =========================================================
          SUBTLE NAVY VIGNETTE
          ========================================================= */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(
            circle_at_70%_48%,
            transparent_25%,
            rgba(6,26,43,0.22)_62%,
            rgba(6,26,43,0.60)_100%
          )]
        "
      />

      {/* =========================================================
          MOBILE IMAGE FOCUS
          Slightly protects the left copy area while keeping
          vehicle/service visible behind the content.
          ========================================================= */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-b
          from-transparent
          via-transparent
          to-[#061A2B]/[0.24]
          lg:hidden
        "
      />

      {/* =========================================================
          PREMIUM SERVICE CARD
          Desktop/tablet only — intentionally removed on mobile
          to keep the hero clean.
          ========================================================= */}
      <div className="absolute bottom-[11%] right-[5%] hidden w-[224px] sm:block lg:bottom-[12%] lg:right-[6%] xl:right-[7%]">
        <div className="rounded-[20px] border border-white/[0.12] bg-[#08263D]/[0.76] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFD400] text-[#061A2B] shadow-[0_8px_28px_rgba(255,212,0,0.18)]">
              <BatteryCharging className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-extrabold text-[#F8FAFC]">
                Mobile Service
              </p>

              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#A8BBC8]">
                Battery assistance
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-white/[0.08] pt-3">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#FFD400]" />

            <span className="text-[10px] font-medium text-[#A8BBC8]">
              Melbourne West
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================
          SMALL BRAND ACCENT
          ========================================================= */}
   {/* =========================================================
    SMALL BRAND ACCENT
    ========================================================= */}
<div
  className="
    absolute
    bottom-[14%]
    left-5
    h-[3px]
    w-12
    rounded-full
    bg-[#FFD400]
    shadow-[0_0_18px_rgba(255,212,0,0.42)]
    sm:left-8
    lg:bottom-[18%]
    lg:left-12
    xl:left-16
  "
/>

    </div>
  );
}