import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  MessageCircle,
  Phone,
} from "lucide-react";

interface ServiceAreaFinalCTAProps {
  businessName: string;
  areaName: string;
  phone: string;
  whatsapp: string;
  primaryServiceRegion: string;
}

function getTelHref(phone: string) {
  const cleanNumber = phone.replace(/[^\d+]/g, "");

  return `tel:${cleanNumber}`;
}

function getWhatsAppHref(
  phone: string,
  businessName: string,
  areaName: string,
) {
  const cleanNumber = phone.replace(/\D/g, "");

  const message = encodeURIComponent(
    `Hi ${businessName}, I need mobile car battery assistance in ${areaName}.`,
  );

  return `https://wa.me/${cleanNumber}?text=${message}`;
}

export default function ServiceAreaFinalCTA({
  businessName,
  areaName,
  phone,
  whatsapp,
  primaryServiceRegion,
}: ServiceAreaFinalCTAProps) {
  const telHref = getTelHref(phone);

  const whatsappHref = getWhatsAppHref(
    whatsapp,
    businessName,
    areaName,
  );

  return (
    <section className="relative overflow-hidden bg-[#061A2B] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      {/* Ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#0D6E91]/20 blur-[110px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#FFD400]/10 blur-[100px]"
      />

      {/* Technical grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(248,250,252,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(248,250,252,0.8) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#08263D]/80 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            {/* Main content */}
            <div className="relative p-7 sm:p-10 lg:p-14">
              <div className="mb-8 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#FFD400]/20 bg-[#FFD400]/10">
                  <BatteryCharging
                    className="h-5 w-5 text-[#FFD400]"
                    strokeWidth={1.8}
                  />
                </span>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FFD400]">
                    Mobile Assistance
                  </p>

                  <p className="mt-1 text-sm text-[#A8BBC8]">
                    {primaryServiceRegion}
                  </p>
                </div>
              </div>

              <h2 className="max-w-3xl text-3xl font-semibold leading-[1.05] tracking-[-0.035em] text-[#F8FAFC] sm:text-4xl lg:text-5xl">
                Need battery help in{" "}
                <span className="text-[#FFD400]">
                  {areaName}
                </span>
                ?
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[#A8BBC8] sm:text-lg">
                Contact {businessName} for mobile car battery
                assistance at your vehicle&apos;s location.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href={telHref}
                  className="group inline-flex min-h-13 items-center justify-center gap-3 rounded-2xl bg-[#FFD400] px-6 py-3.5 text-sm font-bold text-[#061A2B] transition hover:bg-[#F5B800] focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:ring-offset-2 focus:ring-offset-[#08263D]"
                >
                  <Phone
                    className="h-4 w-4"
                    strokeWidth={2.2}
                  />

                  Call for Assistance

                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={2.2}
                  />
                </a>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-13 items-center justify-center gap-3 rounded-2xl border border-white/12 bg-white/[0.045] px-6 py-3.5 text-sm font-semibold text-[#F8FAFC] transition hover:border-white/20 hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <MessageCircle
                    className="h-4 w-4 text-[#FFD400]"
                    strokeWidth={2}
                  />

                  WhatsApp
                </a>
              </div>
            </div>

            {/* Side navigation panel */}
            <div className="border-t border-white/10 bg-black/10 p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-14">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#A8BBC8]">
                Continue Exploring
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  href="/services"
                  className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 transition hover:border-white/20 hover:bg-white/[0.07]"
                >
                  <span>
                    <span className="block text-sm font-semibold text-[#F8FAFC]">
                      Explore Services
                    </span>

                    <span className="mt-1 block text-xs text-[#A8BBC8]">
                      View available battery services
                    </span>
                  </span>

                  <ArrowRight
                    className="h-4 w-4 text-[#FFD400] transition-transform group-hover:translate-x-1"
                    strokeWidth={2}
                  />
                </Link>

                <Link
                  href="/service-areas"
                  className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 transition hover:border-white/20 hover:bg-white/[0.07]"
                >
                  <span>
                    <span className="block text-sm font-semibold text-[#F8FAFC]">
                      View All Service Areas
                    </span>

                    <span className="mt-1 block text-xs text-[#A8BBC8]">
                      Explore other listed locations
                    </span>
                  </span>

                  <ArrowRight
                    className="h-4 w-4 text-[#FFD400] transition-transform group-hover:translate-x-1"
                    strokeWidth={2}
                  />
                </Link>
              </div>

              <div className="mt-7 border-t border-white/10 pt-6">
                <p className="text-xs leading-5 text-[#A8BBC8]">
                  Looking for assistance specifically around{" "}
                  {areaName}? Contact the team directly for
                  the quickest next step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}