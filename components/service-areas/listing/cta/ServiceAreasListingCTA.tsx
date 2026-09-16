import Link from "next/link";

import {
  ArrowUpRight,
  MessageCircle,
  Phone,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

interface ServiceAreasListingCTAProps {
  serviceAreaCount: number;
}

function createPhoneHref(phone: string) {
  const digits = phone.replace(/\D/g, "");

  return digits ? `tel:+${digits}` : "";
}

function createWhatsAppHref(phone: string) {
  const digits = phone.replace(/\D/g, "");

  return digits
    ? `https://wa.me/${digits}`
    : "";
}

export default async function ServiceAreasListingCTA({
  serviceAreaCount,
}: ServiceAreasListingCTAProps) {
  await connectDB();

  const settings = await SiteSettings.findOne()
    .select(
      [
        "businessName",
        "phone",
        "primaryCallNumber",
        "whatsapp",
        "primaryServiceRegion",
      ].join(" "),
    )
    .lean();

  const businessName =
    settings?.businessName || "Car Battery Service";

  const phone =
    settings?.primaryCallNumber ||
    settings?.phone ||
    "";

  const whatsapp =
    settings?.whatsapp ||
    phone;

  const region =
    settings?.primaryServiceRegion ||
    "";

  const phoneHref = createPhoneHref(phone);
  const whatsappHref = createWhatsAppHref(whatsapp);

  return (
    <section className="relative isolate overflow-hidden bg-[#061A2B] text-[#F8FAFC]">
      {/* Atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-[#0D6E91]/20 blur-[110px]" />

        <div className="absolute -bottom-40 left-1/4 h-[26rem] w-[26rem] rounded-full bg-[#FFD400]/[0.055] blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-[1420px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end lg:gap-24">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#FFD400]">
                Need assistance?
              </span>
            </div>

            <h2 className="mt-6 max-w-4xl text-4xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-5xl lg:text-7xl">
              Not sure which location
              <br />
              <span className="text-[#F8FAFC]/30">
                covers your situation?
              </span>
            </h2>

            <p className="mt-7 max-w-2xl text-sm leading-7 text-[#A8BBC8] sm:text-base">
              Contact {businessName} with your vehicle location and
              battery-related issue so the available service
              information can be discussed with you.
            </p>
          </div>

          <div>
            <div className="border-y border-[#F8FAFC]/10 py-6">
              <div className="text-3xl font-semibold tracking-[-0.05em]">
                {String(serviceAreaCount).padStart(2, "0")}
              </div>

              <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#F8FAFC]/35">
                Active locations listed
              </p>

              {region ? (
                <p className="mt-5 text-xs text-[#A8BBC8]">
                  Primary service region:{" "}
                  <span className="text-[#F8FAFC]">
                    {region}
                  </span>
                </p>
              ) : null}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {phoneHref ? (
                <a
                  href={phoneHref}
                  className="group flex min-h-14 items-center justify-between rounded-full bg-[#FFD400] px-3 pl-5 text-sm font-bold text-[#061A2B] transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span className="flex items-center gap-3">
                    <Phone
                      className="h-4 w-4"
                      strokeWidth={2}
                    />

                    Call now
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#061A2B] text-[#FFD400] transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight
                      className="h-4 w-4"
                      strokeWidth={2}
                    />
                  </span>
                </a>
              ) : null}

              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-14 items-center justify-between rounded-full border border-[#F8FAFC]/15 bg-[#F8FAFC]/[0.035] px-3 pl-5 text-sm font-semibold text-[#F8FAFC] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F8FAFC]/25 hover:bg-[#F8FAFC]/[0.07]"
                >
                  <span className="flex items-center gap-3">
                    <MessageCircle
                      className="h-4 w-4 text-[#FFD400]"
                      strokeWidth={1.8}
                    />

                    WhatsApp
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F8FAFC]/10 text-[#FFD400] transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight
                      className="h-4 w-4"
                      strokeWidth={2}
                    />
                  </span>
                </a>
              ) : null}

              <Link
                href="/services"
                className="group mt-1 flex min-h-12 items-center justify-center gap-2 text-xs font-semibold text-[#A8BBC8] transition-colors hover:text-[#F8FAFC]"
              >
                <span>View all services</span>

                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.8}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}