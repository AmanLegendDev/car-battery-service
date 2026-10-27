
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  MessageCircle,
  Phone,
  Wrench,
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
  return cleanNumber ? `tel:${cleanNumber}` : "";
}

function getWhatsAppHref(
  phone: string,
  businessName: string,
  areaName: string,
) {
  const cleanNumber = phone.replace(/\D/g, "");

  if (!cleanNumber) {
    return "";
  }

  const message = encodeURIComponent(
    `Hi ${businessName}, I'd like to enquire about automotive services in ${areaName}. Could you please let me know the available options?`,
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
    <section
      aria-labelledby="service-area-cta-heading"
      className="relative isolate overflow-hidden bg-[#061A2B] px-4 py-16 text-[#F8FAFC] sm:px-6 sm:py-20 lg:px-8 lg:py-28"
    >
      {/* Background lighting and grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-[#0D6E91]/25 blur-[120px]" />

        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#FFD400]/[0.08] blur-[110px]" />

        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className="relative mx-auto max-w-[1420px]">
        <div className="relative overflow-hidden rounded-[28px] border border-white/[0.12] bg-gradient-to-br from-[#10354B] via-[#08263D] to-[#061A2B] shadow-[0_30px_100px_rgba(0,0,0,0.28)] sm:rounded-[36px]">
          <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.75fr)]">
            {/* Main CTA */}
            <div className="relative min-w-0 p-6 sm:p-9 lg:p-14">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFD400] text-[#061A2B] shadow-[0_10px_30px_rgba(255,212,0,0.12)]">
                  <Wrench
                    aria-hidden="true"
                    className="h-5 w-5"
                    strokeWidth={1.8}
                  />
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFD400]">
                    Local Service Enquiries
                  </p>

                  {primaryServiceRegion ? (
                    <p className="mt-1 text-sm text-[#B8C8D2]">
                      {primaryServiceRegion}
                    </p>
                  ) : null}
                </div>
              </div>

              <h2
                id="service-area-cta-heading"
                className="mt-8 max-w-3xl break-words text-[clamp(2.5rem,5.5vw,4.75rem)] font-semibold leading-[0.96] tracking-[-0.055em]"
              >
                Looking for vehicle care in{" "}
                <span className="text-[#FFD400]">{areaName}</span>?
              </h2>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-[#B8C8D2] sm:text-base sm:leading-8">
                Contact {businessName} to discuss your vehicle, ask about
                available services, and find out whether assistance is
                available in your area.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {telHref ? (
                  <a
                    href={telHref}
                    className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#FFD400] px-6 py-3.5 text-sm font-bold text-[#061A2B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F5B800] hover:shadow-[0_14px_34px_rgba(255,212,0,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-4 focus-visible:ring-offset-[#08263D]"
                  >
                    <Phone
                      aria-hidden="true"
                      className="h-4 w-4"
                      strokeWidth={2}
                    />

                    <span>Call Our Team</span>

                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </a>
                ) : null}

                {whatsappHref ? (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Contact ${businessName} on WhatsApp about services in ${areaName}`}
                    className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/[0.15] bg-white/[0.045] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-[#0D6E91] hover:bg-[#0D6E91]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-4 focus-visible:ring-offset-[#08263D]"
                  >
                    <MessageCircle
                      aria-hidden="true"
                      className="h-4 w-4 text-[#FFD400]"
                      strokeWidth={2}
                    />

                    <span>Chat on WhatsApp</span>

                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 text-white/60"
                    />
                  </a>
                ) : null}
              </div>

              {!telHref && !whatsappHref ? (
                <p className="mt-7 text-sm text-[#B8C8D2]">
                  Contact details are currently unavailable. Please explore
                  our services or visit our contact page.
                </p>
              ) : null}

              <div className="mt-9 flex items-start gap-3 border-t border-white/[0.1] pt-6">
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#FFD400]"
                />

                <p className="text-xs leading-6 text-[#B8C8D2]">
                  Service availability may vary by location. Contact our
                  team to confirm coverage for {areaName}.
                </p>
              </div>
            </div>

            {/* Navigation panel */}
            <aside className="relative border-t border-white/[0.1] bg-[#061A2B]/35 p-6 sm:p-9 lg:border-l lg:border-t-0 lg:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-[#0D6E91]/15 blur-[90px]"
              />

              <div className="relative">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#B8C8D2]/70">
                  Keep Exploring
                </p>

                <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.035em] text-white">
                  Find the right next step.
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#B8C8D2]">
                  Explore our services or check the other locations listed
                  on our website.
                </p>

                <div className="mt-7 space-y-3">
                  <Link
                    href="/services"
                    className="group flex min-h-[76px] items-center justify-between gap-4 rounded-2xl border border-white/[0.1] bg-white/[0.035] p-4 transition-all duration-300 hover:border-[#0D6E91]/70 hover:bg-[#0D6E91]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-white">
                        Explore Services
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-[#B8C8D2]">
                        Browse available vehicle services
                      </span>
                    </span>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#FFD400] transition-all duration-300 group-hover:rotate-45 group-hover:border-[#FFD400]/40 group-hover:bg-[#FFD400] group-hover:text-[#061A2B]">
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-4 w-4"
                      />
                    </span>
                  </Link>

                  <Link
                    href="/service-areas"
                    className="group flex min-h-[76px] items-center justify-between gap-4 rounded-2xl border border-white/[0.1] bg-white/[0.035] p-4 transition-all duration-300 hover:border-[#0D6E91]/70 hover:bg-[#0D6E91]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-white">
                        All Service Areas
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-[#B8C8D2]">
                        Browse listed service locations
                      </span>
                    </span>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#FFD400] transition-all duration-300 group-hover:rotate-45 group-hover:border-[#FFD400]/40 group-hover:bg-[#FFD400] group-hover:text-[#061A2B]">
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-4 w-4"
                      />
                    </span>
                  </Link>

                  <Link
                    href="/contact"
                    className="group flex min-h-[76px] items-center justify-between gap-4 rounded-2xl border border-white/[0.1] bg-white/[0.035] p-4 transition-all duration-300 hover:border-[#0D6E91]/70 hover:bg-[#0D6E91]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-white">
                        Contact Us
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-[#B8C8D2]">
                        Ask a question about your vehicle
                      </span>
                    </span>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#FFD400] transition-all duration-300 group-hover:rotate-45 group-hover:border-[#FFD400]/40 group-hover:bg-[#FFD400] group-hover:text-[#061A2B]">
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-4 w-4"
                      />
                    </span>
                  </Link>
                </div>

                <div className="mt-7 flex items-center gap-2 border-t border-white/[0.1] pt-5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />

                  <span className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/45">
                    {businessName}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
