
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck } from "lucide-react";

import ServicesDropdown, {
  type NavbarService,
} from "./ServicesDropdown";

import { NAVBAR_LINKS } from "./navbarData";

interface DesktopNavProps {
  services: NavbarService[];
  onServicesOpenChange?: (open: boolean) => void;
}

export default function DesktopNav({
  services,
  onServicesOpenChange,
}: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-3">
      {/* Navigation pill */}
      <nav
        aria-label="Main navigation"
        className="flex items-center rounded-[18px] border border-white/[0.07] bg-[#061A2B]/[0.22] p-1"
      >
        {NAVBAR_LINKS.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/" && pathname.startsWith(`${link.href}/`));

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`group relative flex h-10 items-center rounded-[13px] px-3.5 text-[12px] font-semibold tracking-[-0.01em] transition-all duration-200 xl:px-4 xl:text-[13px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/50 ${
                isActive
                  ? "bg-white/[0.07] text-[#F8FAFC]"
                  : "text-[#A8BBC8] hover:bg-white/[0.055] hover:text-[#F8FAFC]"
              }`}
            >
              <span className="relative z-10">
                {link.label}
              </span>
            </Link>
          );
        })}

        <ServicesDropdown
          services={services}
          onOpenChange={onServicesOpenChange}
        />
      </nav>

      {/* Booking CTA */}
      <Link
        href="/book-service"
        aria-label="Book a service with Mobile Car Services"
        className="group inline-flex h-12 shrink-0 items-center gap-2.5 rounded-[15px] bg-[#FFD400] px-5 text-[13px] font-extrabold text-[#061A2B] shadow-[0_10px_34px_rgba(255,212,0,0.15)] transition-all duration-200 hover:bg-[#F5B800] hover:shadow-[0_14px_42px_rgba(255,212,0,0.23)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08263D] active:scale-[0.98]"
      >
        <CalendarCheck
          aria-hidden="true"
          className="h-[17px] w-[17px] transition-transform duration-200 group-hover:rotate-[-8deg]"
        />

        <span>Book Now</span>
      </Link>
    </div>
  );
}
