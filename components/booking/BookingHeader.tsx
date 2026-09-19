import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";

const PHONE = "+61 467 037 886";
const PHONE_HREF = "tel:+61467037886";

export default function BookingHeader() {
  return (
    <header className="border-b border-white/10 bg-[#061A2B]/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD400] font-black text-[#061A2B]">
            CB
          </div>

          <div>
            <p className="text-sm font-bold text-white">
              Car Battery Service
            </p>

            <p className="text-xs text-[#A8BBC8]">
              Mobile Battery Service
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden items-center gap-2 rounded-xl px-4 py-2 text-sm text-[#A8BBC8] transition hover:bg-white/5 hover:text-white sm:flex"
          >
            <ArrowLeft size={15} />
            Back to website
          </Link>

          <a
            href={PHONE_HREF}
            className="flex h-10 items-center gap-2 rounded-xl bg-white/5 px-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <Phone size={15} />
            <span className="hidden sm:inline">
              {PHONE}
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}