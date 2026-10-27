
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
  Phone,
} from "lucide-react";

interface BlogArticleCTAProps {
  businessName: string;
  phone: string;
  whatsapp: string;
  primaryServiceRegion: string;
}

function getPhoneHref(phone: string) {
  const cleanedPhone = phone.trim();

  if (!cleanedPhone) {
    return null;
  }

  const phoneNumber = cleanedPhone.replace(/[^\d+]/g, "");

  if (!phoneNumber || !/\d/.test(phoneNumber)) {
    return null;
  }

  return `tel:${phoneNumber}`;
}

function getWhatsAppHref(
  phone: string,
  businessName: string,
  region: string,
) {
  const cleanNumber = phone.replace(/\D/g, "");

  if (!cleanNumber) {
    return null;
  }

  const message = encodeURIComponent(
    `Hi ${businessName}, I'd like to enquire about your automotive services${
      region ? ` in ${region}` : ""
    }. Could you please share the available options?`,
  );

  return `https://wa.me/${cleanNumber}?text=${message}`;
}

export default function BlogArticleCTA({
  businessName,
  phone,
  whatsapp,
  primaryServiceRegion,
}: BlogArticleCTAProps) {
  const displayBusinessName =
    businessName.trim() || "Rapid Auto Services";

  const region = primaryServiceRegion.trim();

  const phoneHref = getPhoneHref(phone);

  const whatsappHref = getWhatsAppHref(
    whatsapp,
    displayBusinessName,
    region,
  );

  return (
    <section className="relative isolate overflow-hidden bg-[#061A2B] px-5 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#0D6E91]/20 blur-[110px]" />

        <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#FFD400]/[0.08] blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "54px 54px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            {/* Content */}
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFD400]">
                <span
                  aria-hidden="true"
                  className="h-px w-7 bg-[#FFD400]"
                />

                Need More Information?
              </div>

              <h2 className="text-3xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                Knowledge is useful.
                <span className="text-white/40">
                  {" "}
                  The right support makes the difference.
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                Have questions after reading this article? Contact{" "}
                <span className="font-semibold text-white/85">
                  {displayBusinessName}
                </span>
                {region ? ` in ${region}` : ""} to discuss your
                vehicle and enquire about the services available
                for your needs.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:min-w-[205px] lg:flex-col">
              {phoneHref ? (
                <a
                  href={phoneHref}
                  aria-label={`Call ${displayBusinessName}`}
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FFD400] px-6 py-3.5 text-sm font-bold text-[#061A2B] transition-colors hover:bg-[#F5B800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061A2B]"
                >
                  <Phone size={16} aria-hidden="true" />

                  Call Now

                  <ArrowRight
                    size={15}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </a>
              ) : null}

              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Message ${displayBusinessName} on WhatsApp`}
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/25 hover:bg-white/[0.10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <MessageCircle size={16} aria-hidden="true" />

                  WhatsApp

                  <ArrowUpRight
                    size={15}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              ) : null}

              <Link
                href="/services"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3.5 text-sm font-semibold text-white/75 transition-colors hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Explore Services

                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* Bottom note */}
          <div className="mt-10 border-t border-white/10 pt-5">
            <p className="text-xs leading-6 text-white/40">
              Service availability may vary by location and vehicle
              requirements. Contact the team to discuss your enquiry.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
