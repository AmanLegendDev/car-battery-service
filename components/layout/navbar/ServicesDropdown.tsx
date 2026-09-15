"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BatteryCharging,
  ChevronDown,
} from "lucide-react";
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
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
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
      {/* Trigger */}
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={toggleDropdown}
        className="group flex h-10 items-center gap-1.5 rounded-[13px] px-3.5 text-[12px] font-semibold tracking-[-0.01em] text-[#A8BBC8] transition-all duration-200 hover:bg-white/[0.055] hover:text-[#F8FAFC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/50 xl:px-4 xl:text-[13px]"
      >
        <span>Services</span>

        <ChevronDown
          aria-hidden="true"
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            isOpen
              ? "rotate-180 text-[#FFD400]"
              : "text-[#718895]"
          }`}
        />
      </button>

      {/* Dropdown */}
      <div
        role="menu"
        aria-hidden={!isOpen}
        className={`absolute right-0 top-[calc(100%+12px)] w-[285px] origin-top-right transition-[opacity,transform] duration-200 ${
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-[0.97] opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-[22px] border border-white/[0.1] bg-[#08263D]/[0.97] p-2 shadow-[0_28px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
          {/* Header */}
          <div className="px-3 pb-2.5 pt-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFD400]/[0.1] text-[#FFD400]">
                <BatteryCharging
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                />
              </span>

              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#F8FAFC]">
                  Our Services
                </p>

                <p className="mt-0.5 text-[9px] text-[#718895]">
                  Mobile battery assistance
                </p>
              </div>
            </div>
          </div>

          {/* Service links */}
          <div className="space-y-1">
            {SERVICE_LINKS.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                role="menuitem"
                tabIndex={isOpen ? 0 : -1}
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-between rounded-[15px] px-3 py-3 transition-all duration-150 hover:bg-white/[0.055] focus:bg-white/[0.055] focus:outline-none"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="text-[13px] font-bold text-[#F8FAFC] transition-colors duration-150 group-hover:text-[#FFD400]">
                    {service.label}
                  </span>

                  <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-[#718895]">
                    Mobile service
                  </span>
                </div>

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] transition-all duration-150 group-hover:border-[#FFD400]/20 group-hover:bg-[#FFD400]/[0.08]">
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-[#718895] transition-all duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#FFD400]"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}