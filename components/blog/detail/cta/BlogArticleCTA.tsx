import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  Phone,
} from "lucide-react";

interface BlogArticleCTAProps {
  businessName: string;
  phone: string;
  whatsapp: string;
  primaryServiceRegion: string;
}

function getWhatsAppHref(
  phone: string,
  businessName: string,
  region: string,
) {
  const cleanNumber = phone.replace(/\D/g, "");

  if (!cleanNumber) {
    return "";
  }

  const message = encodeURIComponent(
    `Hi ${businessName}, I need mobile car battery assistance${
      region ? ` in ${region}` : ""
    }.`,
  );

  return `https://wa.me/${cleanNumber}?text=${message}`;
}

export default function BlogArticleCTA({
  businessName,
  phone,
  whatsapp,
  primaryServiceRegion,
}: BlogArticleCTAProps) {
  const whatsappHref = getWhatsAppHref(
    whatsapp,
    businessName,
    primaryServiceRegion,
  );

  return (
    <section className="relative overflow-hidden bg-[#061A2B] px-5 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#0D6E91]/20 blur-[110px]" />

        <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#FFD400]/10 blur-[120px]" />
      </div>

      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            {/* Content */}
            <div>
              <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFD400]">
                <span className="h-px w-7 bg-[#FFD400]" />
                Need Battery Help?
              </div>

              <h2 className="max-w-3xl text-3xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                Read what you need. Then get the help your vehicle needs.
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
                If you need mobile car battery assistance, explore the
                available services or contact {businessName}
                {primaryServiceRegion
                  ? ` in ${primaryServiceRegion}`
                  : ""}
                .
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFD400] px-6 py-3.5 text-sm font-bold text-[#061A2B] transition hover:bg-[#F5B800]"
                >
                  <Phone size={16} />
                  Call Now
                </a>
              )}

              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.10]"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
              )}

              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3.5 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:text-white"
              >
                View Services
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}