"use client";

import { useCallback, useState } from "react";

import NavbarLogo from "./NavbarLogo";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";
import MobileMenuNav from "./MobileMenuNav";

interface NavbarClientProps {
  services: React.ComponentProps<
    typeof MobileMenuNav
  >["services"];
}

export default function NavbarClient({
  services,
}: NavbarClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const openMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      {/* Sticky positioning layer */}
      <header className="sticky top-0 z-50 h-0">
        {/* Floating navbar */}
        <div className="absolute inset-x-0 top-0 px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8 lg:pt-6">
          <div className="mx-auto max-w-[1420px]">
            <nav
              aria-label="Main navigation"
              className="relative flex min-h-[72px] items-center rounded-[24px] border border-white/[0.09] bg-[#08263D]/[0.92] px-4 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:min-h-[76px] sm:px-5 lg:min-h-[82px] lg:rounded-[28px] lg:px-6"
            >
              {/* Brand */}
              <NavbarLogo />

              {/* Desktop navigation */}
              <div className="ml-auto hidden lg:flex">
                <DesktopNav services={services} />
              </div>

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={openMobileMenu}
                aria-label="Open navigation menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
                className="group ml-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] border border-white/[0.1] bg-white/[0.035] text-[#F8FAFC] shadow-[0_8px_25px_rgba(0,0,0,0.12)] transition-all duration-200 hover:border-white/[0.18] hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/50 active:scale-[0.95] lg:hidden"
              >
                <span className="sr-only">
                  Open navigation menu
                </span>

                <span
                  aria-hidden="true"
                  className="flex w-[21px] flex-col items-end gap-[5px]"
                >
                  <span className="h-[2px] w-full rounded-full bg-current transition-transform duration-200 group-hover:translate-x-0.5" />

                  <span className="h-[2px] w-[14px] rounded-full bg-current transition-all duration-200 group-hover:w-full" />

                  <span className="h-[2px] w-full rounded-full bg-current transition-transform duration-200 group-hover:-translate-x-0.5" />
                </span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <div id="mobile-navigation">
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          services={services}
        />
      </div>
    </>
  );
}