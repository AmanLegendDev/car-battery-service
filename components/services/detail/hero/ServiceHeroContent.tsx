
import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";

import {
  SERVICE_HERO_DEFAULT_CTA,
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
  description,
  ctaText,
  phone,
}: ServiceHeroContentProps) {
  const hasDescription = Boolean(description?.trim());

  return (
    <div className="relative z-10 w-full min-w-0">
      {hasDescription && (
        <article className="w-full min-w-0">
          {/* Section label */}
          <div className="mb-6 flex items-center gap-3 sm:mb-8">
            <span className="h-px w-9 bg-[#FFD400]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#A8BBC8] sm:text-xs">
              Service Overview
            </span>
          </div>

          {/* Full-width rich content */}
          <div
            className="
              service-rich-content w-full min-w-0
              text-[15px] leading-7 text-[#C1CDD5]
              sm:text-base sm:leading-8
              lg:text-[17px] lg:leading-[1.9]

              [&>*:first-child]:!mt-0
              [&>*:last-child]:!mb-0

              [&_p]:mb-5
              [&_p]:[overflow-wrap:anywhere]
              sm:[&_p]:mb-6

              [&_h2]:mb-4
              [&_h2]:mt-10
              [&_h2]:text-2xl
              [&_h2]:font-bold
              [&_h2]:leading-tight
              [&_h2]:tracking-tight
              [&_h2]:text-[#F8FAFC]
              sm:[&_h2]:mt-14
              sm:[&_h2]:text-3xl
              lg:[&_h2]:text-4xl

              [&_h3]:mb-3
              [&_h3]:mt-8
              [&_h3]:text-xl
              [&_h3]:font-bold
              [&_h3]:leading-snug
              [&_h3]:text-[#F8FAFC]
              sm:[&_h3]:mt-10
              sm:[&_h3]:text-2xl

              [&_h4]:mb-2
              [&_h4]:mt-6
              [&_h4]:text-lg
              [&_h4]:font-semibold
              [&_h4]:text-[#F8FAFC]

              [&_strong]:font-bold
              [&_strong]:text-[#F8FAFC]

              [&_em]:italic

              [&_ul]:mb-7
              [&_ul]:list-disc
              [&_ul]:space-y-2
              [&_ul]:pl-6

              [&_ol]:mb-7
              [&_ol]:list-decimal
              [&_ol]:space-y-2
              [&_ol]:pl-6

              [&_li]:pl-1
              [&_li::marker]:text-[#FFD400]

              [&_a]:font-semibold
              [&_a]:text-[#FFD400]
              [&_a]:underline
              [&_a]:decoration-[#FFD400]/40
              [&_a]:underline-offset-4
              [&_a:hover]:decoration-[#FFD400]

              [&_blockquote]:my-8
              [&_blockquote]:border-l-2
              [&_blockquote]:border-[#FFD400]
              [&_blockquote]:bg-white/[0.035]
              [&_blockquote]:px-5
              [&_blockquote]:py-4
              [&_blockquote]:italic
              [&_blockquote]:text-[#D5DEE4]
              sm:[&_blockquote]:px-7
              sm:[&_blockquote]:py-6

              [&_hr]:my-9
              [&_hr]:border-white/10

              [&_table]:w-full
              [&_table]:min-w-[520px]
              [&_table]:border-collapse
              [&_table]:text-left
              [&_table]:text-sm

              [&_th]:border
              [&_th]:border-white/10
              [&_th]:bg-[#0D6E91]/20
              [&_th]:px-4
              [&_th]:py-3
              [&_th]:font-bold
              [&_th]:text-[#F8FAFC]

              [&_td]:border
              [&_td]:border-white/10
              [&_td]:px-4
              [&_td]:py-3
              [&_td]:align-top

              [&_img]:my-6
              [&_img]:h-auto
              [&_img]:max-w-full
              [&_img]:rounded-2xl
            "
          >
            <div className="w-full min-w-0 overflow-x-auto">
              {/* Only render HTML that has been sanitised server-side. */}
              <div
                dangerouslySetInnerHTML={{
                  __html: description!.trim(),
                }}
              />
            </div>
          </div>

          {/* Booking actions below the full-width content */}
          <div className="mt-9 flex flex-col gap-3 border-t border-white/10 pt-7 sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center sm:pt-8">
            <Link
              href="/book-service"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#FFD400] px-6 text-sm font-bold text-[#061A2B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F5B800] hover:shadow-[0_14px_35px_rgba(255,212,0,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061A2B]"
            >
              <span>
                {ctaText?.trim() || SERVICE_HERO_DEFAULT_CTA}
              </span>

              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#061A2B] text-[#FFD400] transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight
                  className="h-4 w-4"
                  strokeWidth={2.2}
                />
              </span>
            </Link>

            {phone && (
              <a
                href={phoneHref(phone)}
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.035] px-6 text-sm font-semibold text-[#F8FAFC] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.2] hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/60"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
                  <Phone className="h-4 w-4" strokeWidth={2.2} />
                </span>

                <span>{SERVICE_HERO_SECONDARY_CTA}</span>
              </a>
            )}
          </div>
        </article>
      )}

      {/* Fallback when the service has no description */}
      {!hasDescription && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/book-service"
            className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#FFD400] px-6 text-sm font-bold text-[#061A2B] transition hover:-translate-y-0.5 hover:bg-[#F5B800]"
          >
            <span>
              {ctaText?.trim() || SERVICE_HERO_DEFAULT_CTA}
            </span>

            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
          </Link>

          {phone && (
            <a
              href={phoneHref(phone)}
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-6 text-sm font-semibold text-[#F8FAFC] transition hover:bg-white/[0.08]"
            >
              <Phone className="h-4 w-4 text-[#FFD400]" />
              {SERVICE_HERO_SECONDARY_CTA}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
