import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
} from "lucide-react";

interface ContactBookingCTAProps {
  businessName: string;
}

export default function ContactBookingCTA({
  businessName,
}: ContactBookingCTAProps) {
  return (
    <section className="relative overflow-hidden bg-[#061A2B] px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
      {/* Atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#0D6E91]/20 blur-[100px]" />

        <div className="absolute -right-32 top-0 h-72 w-72 rounded-full bg-[#FFD400]/10 blur-[100px]" />

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
          <div className="grid lg:grid-cols-[1fr_0.72fr]">
            {/* Main */}
            <div className="p-7 sm:p-10 lg:p-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFD400] text-[#061A2B]">
                <CalendarCheck2 size={23} />
              </div>

              <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#FFD400]">
                Online Booking
              </p>

              <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#F8FAFC] sm:text-4xl lg:text-5xl">
                Ready to arrange your battery service?
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#A8BBC8] sm:text-base">
                Use the dedicated booking page to provide the
                service details needed for your request.
              </p>

              <Link
                href="/book-service"
                className="group mt-8 inline-flex min-h-13 items-center gap-2 rounded-full bg-[#FFD400] px-7 text-sm font-bold text-[#061A2B] transition duration-300 hover:-translate-y-0.5 hover:bg-[#F5B800]"
              >
                Book a Battery Service

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Side */}
            <div className="border-t border-white/10 bg-black/10 p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A8BBC8]">
                One simple booking path
              </p>

              <p className="mt-4 text-xl font-semibold leading-snug text-[#F8FAFC]">
                {businessName}
              </p>

              <div className="mt-7 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#FFD400]"
                  />

                  <p className="text-sm leading-6 text-[#A8BBC8]">
                    Select the service you need.
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}