import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";

import {
  SERVICE_HERO_DEFAULT_CTA,
  SERVICE_HERO_LABEL,
  SERVICE_HERO_SECONDARY_CTA,
} from "./serviceHeroData";

interface ServiceHeroContentProps {
  title: string;
  description?: string;
  ctaText?: string;
  phone?: string;
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export default function ServiceHeroContent({
  title,
  description,
  ctaText,
  phone,
}: ServiceHeroContentProps) {
  return (
    <div className="relative z-10 max-w-3xl">
      <div className="mb-7 inline-flex items-center gap-3">
        <span className="h-px w-8 bg-[#FFD400]" />

        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#A8BBC8] sm:text-xs">
          {SERVICE_HERO_LABEL}
        </span>
      </div>

      <h1 className="max-w-4xl text-[clamp(3.4rem,8vw,7.5rem)] font-semibold leading-[0.88] tracking-[-0.065em] text-[#F8FAFC]">
        {title}
      </h1>

      {description ? (
        <p className="mt-8 max-w-2xl text-base leading-7 text-[#A8BBC8] sm:text-lg sm:leading-8">
          {description}
        </p>
      ) : null}

      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/book-service"
          className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#FFD400] px-6 text-sm font-bold text-[#061A2B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F5B800] hover:shadow-[0_14px_35px_rgba(255,212,0,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061A2B]"
        >
          <span>{ctaText?.trim() || SERVICE_HERO_DEFAULT_CTA}</span>

          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#061A2B] text-[#FFD400] transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
          </span>
        </Link>

        {phone ? (
          <a
            href={phoneHref(phone)}
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.035] px-6 text-sm font-semibold text-[#F8FAFC] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.2] hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/60"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
              <Phone className="h-4 w-4" strokeWidth={2.2} />
            </span>

            <span>{SERVICE_HERO_SECONDARY_CTA}</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}