import Link from "next/link";
import {
  ArrowRight,
  MapPin,
} from "lucide-react";

interface AboutServiceAreaProps {
  region: string;
}

export default function AboutServiceArea({
  region,
}: AboutServiceAreaProps) {
  if (!region) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#08263D] p-7 sm:p-10 lg:p-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#0D6E91]/20 blur-[100px]" />

            <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#FFD400]/[0.07] blur-[100px]" />

            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(248,250,252,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(248,250,252,0.8) 1px, transparent 1px)",
                backgroundSize: "64px 64px",
              }}
            />
          </div>

          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFD400] text-[#061A2B]">
                <MapPin size={22} />
              </div>

              <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#A8BBC8]">
                Primary Service Region
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#F8FAFC] sm:text-4xl lg:text-5xl">
                Mobile battery assistance in{" "}
                <span className="text-[#FFD400]">
                  {region}.
                </span>
              </h2>

              <p className="mt-5 text-sm leading-7 text-[#A8BBC8] sm:text-base">
                View the available service areas to learn
                more about local coverage and services.
              </p>
            </div>

            <Link
              href="/service-areas"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-6 text-sm font-semibold text-[#F8FAFC] transition duration-300 hover:border-white/25 hover:bg-white/[0.09]"
            >
              View Service Areas

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}