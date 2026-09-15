"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { SERVICE_LINKS } from "./navbarData";

interface ServicesDropdownProps {
  onOpenChange?: (open: boolean) => void;
}

export default function ServicesDropdown({
  onOpenChange,
}: ServicesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function toggleDropdown() {
    setIsOpen((current) => !current);
  }

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={toggleDropdown}
        className="group flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-[#A8BBC8] transition-all duration-200 hover:bg-white/[0.06] hover:text-[#F8FAFC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/50"
      >
        <span>Services</span>

        <ChevronDown
          aria-hidden="true"
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#FFD400]" : ""
          }`}
        />
      </button>

      <div
        role="menu"
        aria-hidden={!isOpen}
        className={`absolute right-0 top-[calc(100%+14px)] w-[270px] origin-top-right transition-all duration-200 ${
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#08263D]/95 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur-2xl">
          <div className="px-3 pb-2 pt-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#718895]">
              Our Services
            </p>
          </div>

          <div className="space-y-1">
            {SERVICE_LINKS.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                role="menuitem"
                tabIndex={isOpen ? 0 : -1}
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-between rounded-xl px-3 py-3 transition-colors duration-150 hover:bg-white/[0.06] focus:bg-white/[0.06] focus:outline-none"
              >
                <span className="text-sm font-semibold text-[#F8FAFC] transition-colors group-hover:text-[#FFD400]">
                  {service.label}
                </span>

                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 text-[#718895] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#FFD400]"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}