import HeroContent from "./HeroContent";
import HeroVisual from "./HeroVisual";

interface HeroSettings {
  businessName: string;
  tagline: string;
  description: string;
  phone: string;
  serviceRegion: string;
  bookingCta: string;
}

interface HeroProps {
  settings: HeroSettings | null;
}

export default function Hero({
  settings,
}: HeroProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#061A2B] text-[#F8FAFC]"
    >
      {/* Cinematic background */}
      <HeroVisual />

      {/* Very subtle technical grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.022]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "76px 76px",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 58%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 58%, transparent 100%)",
        }}
      />

      {/* Main hero content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1600px] items-center px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-36 lg:px-12 lg:pb-24 lg:pt-32 xl:px-16">
        <div className="w-full">
          <HeroContent settings={settings} />
        </div>
      </div>

      {/* Bottom cinematic fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-36 bg-gradient-to-t from-[#061A2B] via-[#061A2B]/70 to-transparent sm:h-44"
      />

      {/* Subtle bottom horizon glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 z-[5] h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#0D6E91]/35 to-transparent"
      />
    </section>
  );
}