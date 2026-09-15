"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import MobileMenuHeader from "./MobileMenuHeader";
import MobileMenuNav from "./MobileMenuNav";
import { NAVBAR_PHONE, NAVBAR_PHONE_HREF } from "./navbarData";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
}: MobileMenuProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[100] lg:hidden ${
        isOpen
          ? "pointer-events-auto"
          : "pointer-events-none"
      }`}
    >
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={onClose}
        className={`absolute inset-0 bg-[#061A2B]/75 backdrop-blur-sm transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`absolute right-0 top-0 flex h-dvh w-[min(92vw,410px)] flex-col border-l border-white/[0.08] bg-[#061A2B] shadow-[-20px_0_70px_rgba(0,0,0,0.35)] transition-transform duration-200 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-5">
            <MobileMenuHeader />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-[#A8BBC8] transition-all duration-150 hover:border-white/[0.15] hover:bg-white/[0.07] hover:text-[#F8FAFC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/50 active:scale-95"
            >
              <X
                aria-hidden="true"
                className="h-5 w-5"
              />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6">
            <MobileMenuNav onNavigate={onClose} />
          </div>

          <div className="shrink-0 border-t border-white/[0.07] bg-[#061A2B]/95 p-5 backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-3">
              <a
                href={NAVBAR_PHONE_HREF}
                onClick={onClose}
                className="flex h-12 items-center justify-center rounded-xl bg-[#FFD400] px-4 text-xs font-extrabold text-[#061A2B] transition-all duration-150 hover:bg-[#F5B800] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/60 active:scale-[0.98]"
              >
                Call Now
              </a>

              <a
                href={`sms:${NAVBAR_PHONE.replace(/\s/g, "")}`}
                onClick={onClose}
                className="flex h-12 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 text-xs font-bold text-[#F8FAFC] transition-all duration-150 hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/50 active:scale-[0.98]"
              >
                Get Help
              </a>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}