
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Wrench,
} from "lucide-react";

interface AboutFinalCTAProps {
  businessName: string;
  region: string;
}

export default function AboutFinalCTA({
  businessName,
  region,
}: AboutFinalCTAProps) {
  const name = businessName || "Mobile Car Services";

  return (
    <section className="relative overflow-hidden bg-[#061A2B] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      {/* Background effects */}
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
                <Wrench size={24} aria-hidden="true" />
              </div>

              <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#FFD400]">
                Let's Get You Moving
              </p>

              <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#F8FAFC] sm:text-4xl lg:text-5xl">
                Need help with your vehicle?
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#A8BBC8] sm:text-base">
                From vehicle maintenance and battery services
                to other automotive needs, we're here to help
                you explore the right service for your vehicle.
                Submit a request and our team can confirm
                availability and the next steps.
              </p>

              {region ? (
                <p className="mt-4 text-sm font-medium text-[#F8FAFC]/75">
                  Mobile automotive assistance in{" "}
                  <span className="font-semibold text-[#F8FAFC]">
                    {region}
                  </span>
                </p>
              ) : null}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/book-service"
                  className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#FFD400] px-7 text-sm font-bold text-[#061A2B] shadow-[0_12px_35px_rgba(255,212,0,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#F5B800]"
                >
                  Book a Service

                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>

                <Link
                  href="/services"
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-white/15 px-7 text-sm font-bold text-[#F8FAFC] transition duration-300 hover:border-white/30 hover:bg-white/[0.06]"
                >
                  View All Services
                </Link>
              </div>
            </div>

            {/* Supporting panel */}
            <div className="border-t border-white/10 bg-black/10 p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-14">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A8BBC8]">
                {name}
              </p>

              <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-[#FFD400]">
                <ClipboardCheck size={22} aria-hidden="true" />
              </div>

              <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#F8FAFC]">
                Getting started is straightforward.
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#A8BBC8]">
                Tell us what your vehicle needs and provide
                the details required for your service request.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#FFD400]"
                    aria-hidden="true"
                  />

                  <p className="text-sm leading-6 text-[#A8BBC8]">
                    Explore the available automotive services.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#FFD400]"
                    aria-hidden="true"
                  />

                  <p className="text-sm leading-6 text-[#A8BBC8]">
                    Share your vehicle and service details.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#FFD400]"
                    aria-hidden="true"
                  />

                  <p className="text-sm leading-6 text-[#A8BBC8]">
                    Submit your request to discuss the next steps.
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 text-sm font-bold text-[#F8FAFC] transition hover:text-[#FFD400]"
                >
                  Have a question? Contact us

                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
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
