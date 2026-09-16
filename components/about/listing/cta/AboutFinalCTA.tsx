import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
} from "lucide-react";

interface AboutFinalCTAProps {
  businessName: string;
  region: string;
}

export default function AboutFinalCTA({
  businessName,
  region,
}: AboutFinalCTAProps) {
  return (
    <section className="relative overflow-hidden bg-[#061A2B] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 top-[-8rem] h-[30rem] w-[30rem] rounded-full bg-[#0D6E91]/20 blur-[110px]" />

        <div className="absolute -right-40 bottom-[-10rem] h-[32rem] w-[32rem] rounded-full bg-[#FFD400]/[0.08] blur-[120px]" />

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
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-2xl backdrop-blur-xl">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            {/* Main CTA */}
            <div className="p-7 sm:p-10 lg:p-14">
              <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#FFD400] text-[#061A2B]">
                <BatteryCharging size={24} />
              </div>

              <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#FFD400]">
                Ready When You Are
              </p>

              <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#F8FAFC] sm:text-4xl lg:text-5xl">
                Need battery assistance?
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#A8BBC8] sm:text-base">
                Use the dedicated booking page to provide the
                details for your service request.
              </p>

              {region ? (
                <p className="mt-4 text-sm font-medium text-[#F8FAFC]/75">
                  Mobile battery assistance in{" "}
                  <span className="font-semibold text-[#F8FAFC]">
                    {region}
                  </span>
                </p>
              ) : null}

              <Link
                href="/book-service"
                className="group mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#FFD400] px-7 text-sm font-bold text-[#061A2B] shadow-[0_12px_35px_rgba(255,212,0,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#F5B800]"
              >
                Book a Battery Service

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Supporting panel */}
            <div className="border-t border-white/10 bg-black/10 p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-14">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A8BBC8]">
                {businessName}
              </p>

              <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#F8FAFC]">
                One dedicated booking path.
              </h3>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#FFD400]"
                  />

                  <p className="text-sm leading-6 text-[#A8BBC8]">
                    Choose the service you need.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#FFD400]"
                  />

                  <p className="text-sm leading-6 text-[#A8BBC8]">
                    Provide the relevant service details.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#FFD400]"
                  />

                  <p className="text-sm leading-6 text-[#A8BBC8]">
                    Submit your booking request.
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-2 text-sm font-bold text-[#F8FAFC] transition hover:text-[#FFD400]"
                >
                  Explore services

                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}