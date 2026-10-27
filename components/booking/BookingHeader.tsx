
import Link from "next/link";
import { ArrowLeft, Phone, Wrench } from "lucide-react";

const PHONE = "+61 467 037 886";
const PHONE_HREF = "tel:+61467037886";

export default function BookingHeader() {
  return (
    <header className="border-b border-white/10 bg-[#061A2B]/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          aria-label="Rapid Auto Services home"
          className="group flex min-w-0 items-center gap-3"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFD400] text-[#061A2B] transition-transform duration-300 group-hover:scale-105">
            <Wrench size={20} strokeWidth={2.5} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">
              Rapid Auto Services
            </p>

            <p className="text-xs text-[#A8BBC8]">
              Automotive Care & Assistance
            </p>
          </div>
        </Link>

        {/* Navigation & Contact */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/"
            className="hidden items-center gap-2 rounded-xl px-4 py-2 text-sm text-[#A8BBC8] transition hover:bg-white/5 hover:text-white sm:flex"
          >
            <ArrowLeft size={15} />
            Back to website
          </Link>

          <a
            href={PHONE_HREF}
            aria-label={`Call Rapid Auto Services at ${PHONE}`}
            className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
          >
            <Phone size={15} className="shrink-0 text-[#FFD400]" />

            <span className="hidden sm:inline">{PHONE}</span>
            <span className="sm:hidden">Call Us</span>
          </a>
        </div>
      </div>
    </header>
  );
}
