import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

import PrivacyHero from "./hero/PrivacyHero";
import PrivacyContents from "./navigation/PrivacyContents";

interface PrivacyBusiness {
  businessName: string;
  tagline: string;
  description: string;
  phone: string;
  primaryCallNumber: string;
  whatsapp: string;
  email: string;
  primaryServiceRegion: string;
}

interface PrivacyPolicyPageProps {
  business: PrivacyBusiness;
}

export default function PrivacyPolicyPage({
  business,
}: PrivacyPolicyPageProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#061A2B]">
      <PrivacyHero businessName={business.businessName} />

      {/* Policy meta bar */}
      <section className="border-b border-[#08263D]/10 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#061A2B]/60">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#0D6E91]" />
                <span>
                  Privacy policy information for{" "}
                  <span className="font-semibold text-[#061A2B]">
                    {business.businessName}
                  </span>
                </span>
              </div>

              {business.primaryServiceRegion && (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#0D6E91]" />
                  <span>{business.primaryServiceRegion}</span>
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="group inline-flex w-fit items-center gap-2 rounded-full border border-[#08263D]/10 px-5 py-2.5 text-sm font-semibold text-[#061A2B] transition hover:border-[#0D6E91]/30 hover:bg-[#F8FAFC]"
            >
              Privacy enquiry
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      <PrivacyContents business={business} />

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-[#061A2B]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(13,110,145,0.2),transparent_32%),radial-gradient(circle_at_85%_50%,rgba(255,212,0,0.08),transparent_28%)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FFD400]">
                Need clarification?
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-[#F8FAFC] sm:text-4xl">
                Have a question about your privacy?
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#A8BBC8] sm:text-base">
                If you have a question about this Privacy Policy or how your
                information is handled, you can contact us directly.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFD400] px-6 py-3.5 text-sm font-bold text-[#061A2B] transition hover:bg-[#F5B800]"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-[#F8FAFC]/15 px-6 py-3.5 text-sm font-semibold text-[#F8FAFC] transition hover:bg-[#F8FAFC]/5"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Legal disclaimer */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#08263D]/10 bg-[#F8FAFC] px-5 py-5 sm:px-6">
            <p className="text-xs leading-6 text-[#061A2B]/55">
              <span className="font-semibold text-[#061A2B]/75">
                Privacy policy review:
              </span>{" "}
              This page provides general information about privacy practices.
              The business should review this policy against its actual
              website configuration, booking process, third-party services and
              information-handling practices before publication. Where
              appropriate, obtain professional Australian privacy/legal advice.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}