import Link from "next/link";
import {
  ArrowRight,
  FileText,
  MapPin,
  Phone,
} from "lucide-react";

import { TERMS_HERO } from "./termsHeroData";

interface TermsHeroProps {
  business: {
    businessName: string;
    tagline: string;
    description: string;
    phone: string;
    primaryCallNumber: string;
    whatsapp: string;
    email: string;
    primaryServiceRegion: string;
  };
}

export default function TermsHero({
  business,
}: TermsHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#061A2B]">
      {/* Ambient atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 top-[-12rem] h-[30rem] w-[30rem] rounded-full bg-[#0D6E91]/18 blur-[110px]" />

        <div className="absolute -right-40 bottom-[-12rem] h-[30rem] w-[30rem] rounded-full bg-[#FFD400]/[0.07] blur-[120px]" />

        {/* Technical grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(248,250,252,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(248,250,252,0.8) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div className="relative mx-auto mt-8 max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.6fr] lg:gap-20">
          {/* =========================================================
              CONTENT
          ========================================================= */}
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 backdrop-blur-md">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
                <FileText size={14} />
              </span>

              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A8BBC8]">
                {TERMS_HERO.eyebrow}
              </span>
            </div>

            {/* Heading */}
            <h1 className="mt-7 text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-[#F8FAFC] sm:text-5xl lg:text-7xl">
              Terms{" "}
              <span className="text-[#FFD400]">
                &amp; Conditions
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#A8BBC8] sm:text-lg">
              {TERMS_HERO.description}
            </p>

            {/* Business / Service region */}
            {business.primaryServiceRegion ? (
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#F8FAFC]/70">
                <MapPin
                  size={16}
                  className="text-[#FFD400]"
                />

                <span>
                  {business.businessName} ·{" "}
                  {business.primaryServiceRegion}
                </span>
              </div>
            ) : null}

            {/* =========================================================
                CTA AREA
            ========================================================= */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Primary CTA */}
              <Link
                href={TERMS_HERO.primaryHref}
                className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#FFD400] px-7 text-sm font-bold text-[#061A2B] shadow-[0_12px_35px_rgba(255,212,0,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFE04D] hover:shadow-[0_16px_40px_rgba(255,212,0,0.22)] sm:w-auto"
              >
                {TERMS_HERO.primaryCta}

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              {/* Call Us CTA */}
              <a
                href={`tel:${TERMS_HERO.phoneNumber.replace(/\s/g, "")}`}
                className="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.045] px-7 text-sm font-bold text-[#F8FAFC] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FFD400]/30 hover:bg-white/[0.08] hover:text-[#FFD400] sm:w-auto"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B] transition-transform duration-300 group-hover:scale-105">
                  <Phone className="h-4 w-4" />
                </span>

                <span className="whitespace-nowrap">
                  Call Us Now
                </span>

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </div>

            {/* Phone number */}
            <a
              href={`tel:${TERMS_HERO.phoneNumber.replace(/\s/g, "")}`}
              className="mt-3 inline-flex text-xs font-medium text-[#A8BBC8] transition-colors duration-300 hover:text-[#FFD400]"
            >
              {TERMS_HERO.phoneNumber}
            </a>
          </div>

          {/* =========================================================
              VISUAL CARD
          ========================================================= */}
          <div className="relative lg:justify-self-end lg:w-full lg:max-w-sm">
            {/* Glow */}
            <div
              aria-hidden="true"
              className="absolute -inset-5 rounded-[2.5rem] bg-[#0D6E91]/10 blur-2xl"
            />

            {/* Card */}
            <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 shadow-2xl shadow-black/20 backdrop-blur-xl">
              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFD400] text-[#061A2B] shadow-lg shadow-[#FFD400]/10">
                <FileText size={24} />
              </div>

              {/* Label */}
              <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A8BBC8]">
                Please Read
              </p>

              {/* Title */}
              <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#F8FAFC]">
                Your rights matter.
              </h2>

              {/* Description */}
              <p className="mt-4 text-sm leading-7 text-[#A8BBC8]">
                Nothing in these terms is intended to remove
                rights that cannot legally be excluded under
                applicable Australian law.
              </p>

              {/* Bottom indicator */}
              <div className="mt-7 border-t border-white/10 pt-5">
                <div className="flex items-center gap-2 text-xs font-medium text-[#A8BBC8]/80">
                  <span className="h-2 w-2 rounded-full bg-[#FFD400]" />
                  Clear and transparent service terms
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}