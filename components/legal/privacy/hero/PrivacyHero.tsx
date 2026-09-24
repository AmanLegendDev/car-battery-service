import {
  ArrowDown,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import {
  PRIVACY_HERO_DESCRIPTION,
  PRIVACY_HERO_LABEL,
  PRIVACY_HERO_TITLE,
} from "./privacyHeroData";

interface PrivacyHeroProps {
  businessName: string;
}

export default function PrivacyHero({
  businessName,
}: PrivacyHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#061A2B]">
      {/* Ambient atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(13,110,145,0.24),transparent_32%),radial-gradient(circle_at_88%_78%,rgba(255,212,0,0.08),transparent_27%)]" />

      {/* Technical grid */}
      <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(248,250,252,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(248,250,252,0.8)_1px,transparent_1px)] [background-size:48px_48px]" />

      {/* Decorative glow */}
      <div className="absolute -right-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#0D6E91]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28 mt-6">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-20">
          {/* Content */}
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F8FAFC]/10 bg-[#F8FAFC]/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#A8BBC8] backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-[#FFD400]" />
              {PRIVACY_HERO_LABEL}
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[#F8FAFC] sm:text-5xl lg:text-6xl">
              {PRIVACY_HERO_TITLE}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#A8BBC8] sm:text-lg">
              {PRIVACY_HERO_DESCRIPTION}
            </p>

            <div className="mt-8 flex items-center gap-3">
              <div className="h-px w-10 bg-[#FFD400]" />

              <p className="text-sm font-medium text-[#A8BBC8]/80">
                {businessName}
              </p>
            </div>

            <a
              href="#introduction"
              className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[#F8FAFC] transition hover:text-[#FFD400]"
            >
              Read the policy
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>

          {/* Visual card */}
          <div className="relative">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-[#0D6E91]/10 blur-2xl" />

            <div className="relative rounded-[2rem] border border-[#F8FAFC]/10 bg-[#08263D]/75 p-7 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-8">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFD400] text-[#061A2B]">
                  <LockKeyhole className="h-7 w-7" />
                </div>

                <span className="rounded-full border border-[#F8FAFC]/10 bg-[#F8FAFC]/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A8BBC8]">
                  Privacy
                </span>
              </div>

              <h2 className="mt-7 text-xl font-semibold text-[#F8FAFC]">
                Clear information. Thoughtful handling.
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#A8BBC8]">
                This policy outlines the types of information that may be
                handled when you interact with the website or request
                battery-related assistance.
              </p>

              <div className="mt-7 border-t border-[#F8FAFC]/10 pt-5">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#FFD400]" />

                  <p className="text-xs leading-6 text-[#A8BBC8]/80">
                    Information practices can depend on the website features
                    and services actually in use.
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