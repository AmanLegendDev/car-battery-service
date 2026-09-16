import Link from "next/link";
import {
  ArrowRight,
  FileText,
  MapPin,
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 top-[-12rem] h-[30rem] w-[30rem] rounded-full bg-[#0D6E91]/18 blur-[110px]" />

        <div className="absolute -right-40 bottom-[-12rem] h-[30rem] w-[30rem] rounded-full bg-[#FFD400]/[0.07] blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(248,250,252,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(248,250,252,0.8) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.6fr] lg:gap-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 backdrop-blur-md">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
                <FileText size={14} />
              </span>

              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A8BBC8]">
                {TERMS_HERO.eyebrow}
              </span>
            </div>

            <h1 className="mt-7 text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-[#F8FAFC] sm:text-5xl lg:text-7xl">
              Terms{" "}
              <span className="text-[#FFD400]">
                & Conditions
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-[#A8BBC8] sm:text-lg">
              {TERMS_HERO.description}
            </p>

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

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={TERMS_HERO.primaryHref}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FFD400] px-6 text-sm font-bold text-[#061A2B] transition hover:bg-[#F5B800]"
              >
                {TERMS_HERO.primaryCta}

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href={TERMS_HERO.secondaryHref}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.045] px-6 text-sm font-semibold text-[#F8FAFC] transition hover:border-white/25 hover:bg-white/[0.08]"
              >
                {TERMS_HERO.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="relative lg:justify-self-end lg:w-full lg:max-w-sm">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 backdrop-blur-xl">
              <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#FFD400] text-[#061A2B]">
                <FileText size={24} />
              </div>

              <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A8BBC8]">
                Please Read
              </p>

              <h2 className="mt-3 text-2xl font-semibold leading-tight text-[#F8FAFC]">
                Your rights matter.
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#A8BBC8]">
                Nothing in these terms is intended to remove
                rights that cannot legally be excluded under
                applicable Australian law.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}