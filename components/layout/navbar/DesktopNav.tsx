"use client";

import Link from "next/link";
import { ChevronDown, Phone } from "lucide-react";
import ServicesDropdown from "./ServicesDropdown";
import {
  NAVBAR_LINKS,
  NAVBAR_PHONE,
  NAVBAR_PHONE_HREF,
} from "./navbarData";

interface DesktopNavProps {
  onServicesOpenChange?: (open: boolean) => void;
}

export default function DesktopNav({
  onServicesOpenChange,
}: DesktopNavProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center rounded-2xl border border-white/[0.06] bg-white/[0.025] p-1">
        {NAVBAR_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group relative rounded-xl px-4 py-2.5 text-[13px] font-semibold text-[#A8BBC8] transition-all duration-200 hover:bg-white/[0.06] hover:text-[#F8FAFC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/50"
          >
            <span className="relative z-10">{link.label}</span>
          </Link>
        ))}

        <ServicesDropdown
          onOpenChange={onServicesOpenChange}
        />
      </div>

      <a
        href={NAVBAR_PHONE_HREF}
        aria-label={`Call Car Battery Service at ${NAVBAR_PHONE}`}
        className="group ml-2 inline-flex h-11 items-center gap-2.5 rounded-xl bg-[#FFD400] px-5 text-[13px] font-extrabold text-[#061A2B] shadow-[0_8px_30px_rgba(255,212,0,0.14)] transition-all duration-200 hover:bg-[#F5B800] hover:shadow-[0_10px_35px_rgba(255,212,0,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08263D] active:scale-[0.98]"
      >
        <Phone
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-200 group-hover:rotate-[-8deg]"
        />

        <span>Call Now</span>
      </a>
    </div>
  );
}