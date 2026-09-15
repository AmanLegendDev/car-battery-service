"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
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
    <div className="flex items-center gap-3">
      {/* Navigation pill */}
      <div className="flex items-center rounded-[18px] border border-white/[0.07] bg-[#061A2B]/[0.22] p-1">
        {NAVBAR_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group relative flex h-10 items-center rounded-[13px] px-3.5 text-[12px] font-semibold tracking-[-0.01em] text-[#A8BBC8] transition-all duration-200 hover:bg-white/[0.055] hover:text-[#F8FAFC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/50 xl:px-4 xl:text-[13px]"
          >
            <span className="relative z-10">
              {link.label}
            </span>
          </Link>
        ))}

        <ServicesDropdown
          onOpenChange={onServicesOpenChange}
        />
      </div>

      {/* Call CTA */}
      <a
        href={NAVBAR_PHONE_HREF}
        aria-label={`Call Car Battery Service at ${NAVBAR_PHONE}`}
        className="group inline-flex h-12 shrink-0 items-center gap-2.5 rounded-[15px] bg-[#FFD400] px-5 text-[13px] font-extrabold text-[#061A2B] shadow-[0_10px_34px_rgba(255,212,0,0.15)] transition-all duration-200 hover:bg-[#F5B800] hover:shadow-[0_14px_42px_rgba(255,212,0,0.23)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08263D] active:scale-[0.98]"
      >
        <Phone
          aria-hidden="true"
          className="h-[17px] w-[17px] transition-transform duration-200 group-hover:rotate-[-8deg]"
        />

        <span>Call Now</span>
      </a>
    </div>
  );
}