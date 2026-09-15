"use client";

import { useCallback, useState } from "react";
import { Menu } from "lucide-react";
import NavbarLogo from "./NavbarLogo";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      <header className="relative z-50 px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8 lg:pt-6">
        <div className="mx-auto max-w-7xl">
          <nav
            aria-label="Main navigation"
            className="relative flex min-h-[72px] items-center rounded-[22px] border border-white/[0.08] bg-[#08263D]/90 px-4 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:min-h-[74px] sm:px-5 lg:min-h-[78px] lg:rounded-[26px] lg:px-6"
          >
            <NavbarLogo />

            <div className="ml-auto flex items-center">
              {/* Desktop navigation */}
              <div className="hidden lg:flex">
                <DesktopNav />
              </div>

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={openMobileMenu}
                aria-label="Open navigation menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
                className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.035] text-[#F8FAFC] transition-all duration-200 hover:border-white/[0.16] hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/50 active:scale-95 lg:hidden"
              >
                <span className="sr-only">
                  Open navigation menu
                </span>

                <span
                  aria-hidden="true"
                  className="flex w-[19px] flex-col items-end gap-[5px]"
                >
                  <span className="h-[2px] w-full rounded-full bg-current transition-transform duration-200 group-hover:translate-x-0.5" />
                  <span className="h-[2px] w-[13px] rounded-full bg-current transition-transform duration-200 group-hover:w-full" />
                  <span className="h-[2px] w-full rounded-full bg-current transition-transform duration-200 group-hover:-translate-x-0.5" />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      <div id="mobile-navigation">
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
        />
      </div>
    </>
  );
}