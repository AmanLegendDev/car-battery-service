
"use client";

import {
  useEffect,
  useRef,
} from "react";

import Link from "next/link";
import { X } from "lucide-react";

import MobileMenuHeader from "./MobileMenuHeader";
import MobileMenuNav from "./MobileMenuNav";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  services: React.ComponentProps<
    typeof MobileMenuNav
  >["services"];
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function MobileMenu({
  isOpen,
  onClose,
  services,
  triggerRef,
  
}: MobileMenuProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    function getFocusableElements() {
      if (!dialogRef.current) return [];

      return Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (element) =>
          !element.hasAttribute("hidden") &&
          element.getAttribute("aria-hidden") !== "true"
      );
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement =
        focusableElements[focusableElements.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === firstElement
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

  return () => {
  document.body.style.overflow = previousOverflow;

  document.removeEventListener(
    "keydown",
    handleKeyDown
  );

  triggerRef?.current?.focus();
};
  }, [isOpen, onClose, triggerRef]);

  return (
    <div
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={`fixed inset-0 z-[100] lg:hidden ${
        isOpen
          ? "pointer-events-auto"
          : "pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close navigation menu"
        tabIndex={isOpen ? 0 : -1}
        onClick={onClose}
        className={`absolute inset-0 bg-[#061A2B]/80 backdrop-blur-[3px] transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
        className={`absolute right-0 top-0 flex h-dvh w-[min(92vw,420px)] flex-col border-l border-white/[0.08] bg-[#061A2B] shadow-[-24px_0_80px_rgba(0,0,0,0.42)] transition-transform duration-200 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-5 py-4">
          <MobileMenuHeader onClick={onClose} />

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-white/[0.09] bg-white/[0.035] text-[#A8BBC8] transition-all duration-150 hover:border-white/[0.17] hover:bg-white/[0.07] hover:text-[#F8FAFC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/50 active:scale-95"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable navigation */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 [scrollbar-width:thin] [scrollbar-color:rgba(168,187,200,0.2)_transparent]">
          <MobileMenuNav
            onNavigate={onClose}
            services={services}
          />
        </div>

        {/* Bottom CTA */}
        <div className="shrink-0 border-t border-white/[0.07] bg-[#061A2B]/95 p-5 backdrop-blur-xl">
          <Link
            href="/book-service"
            onClick={onClose}
            className="flex h-[52px] w-full items-center justify-center rounded-[15px] bg-[#FFD400] px-5 text-sm font-extrabold text-[#061A2B] shadow-[0_10px_32px_rgba(255,212,0,0.13)] transition-all duration-150 hover:bg-[#F5B800] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/60 active:scale-[0.985]"
          >
            Book Now
          </Link>

          <p className="mt-3 text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-[#718895]">
            Automotive Care &amp; Repairs
          </p>
        </div>
      </aside>
    </div>
  );
}
