"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import {
  NAVBAR_LINKS,
  SERVICE_LINKS,
} from "./navbarData";

interface MobileMenuNavProps {
  onNavigate: () => void;
}

export default function MobileMenuNav({
  onNavigate,
}: MobileMenuNavProps) {
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <nav
      aria-label="Mobile navigation"
      className="flex flex-col"
    >
      {/* Navigation label */}
      <div className="mb-6">
        <p className="mb-3 px-1 text-[9px] font-bold uppercase tracking-[0.22em] text-[#718895]">
          Navigation
        </p>

        <div className="space-y-1">
          {NAVBAR_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className="group flex min-h-12 items-center justify-between rounded-[14px] px-3.5 text-[14px] font-semibold text-[#F8FAFC] transition-all duration-150 hover:bg-white/[0.05] hover:text-[#FFD400] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/50 active:bg-white/[0.07]"
            >
              <span>{link.label}</span>

              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] transition-all duration-150 group-hover:border-[#FFD400]/20 group-hover:bg-[#FFD400]/[0.06]">
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-[#718895] transition-all duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#FFD400]"
                />
              </span>
            </Link>
          ))}

          {/* Services */}
          <div>
            <button
              type="button"
              aria-expanded={servicesOpen}
              aria-controls="mobile-services-menu"
              onClick={() =>
                setServicesOpen(
                  (current) => !current
                )
              }
              className="group flex min-h-12 w-full items-center justify-between rounded-[14px] px-3.5 text-left text-[14px] font-semibold text-[#F8FAFC] transition-all duration-150 hover:bg-white/[0.05] hover:text-[#FFD400] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/50 active:bg-white/[0.07]"
            >
              <span>Services</span>

              <span
                className={`flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] transition-all duration-200 ${
                  servicesOpen
                    ? "border-[#FFD400]/20 bg-[#FFD400]/[0.06]"
                    : ""
                }`}
              >
                <ChevronDown
                  aria-hidden="true"
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    servicesOpen
                      ? "rotate-180 text-[#FFD400]"
                      : "text-[#718895]"
                  }`}
                />
              </span>
            </button>

            {/* Services submenu */}
            <div
              id="mobile-services-menu"
              className={`grid transition-[grid-template-rows,opacity] duration-200 ${
                servicesOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="ml-4 mt-1.5 space-y-1 border-l border-white/[0.08] pl-3">
                  {SERVICE_LINKS.map(
                    (service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        onClick={onNavigate}
                        className="group flex min-h-11 items-center justify-between rounded-xl px-3 text-[13px] font-medium text-[#A8BBC8] transition-all duration-150 hover:bg-white/[0.04] hover:text-[#F8FAFC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/50"
                      >
                        <span>
                          {service.label}
                        </span>

                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-3.5 w-3.5 text-[#718895] transition-all duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#FFD400]"
                        />
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assistance card */}
      <div className="mt-1 rounded-[18px] border border-white/[0.07] bg-white/[0.025] p-4">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#FFD400] shadow-[0_0_12px_rgba(255,212,0,0.55)]"
          />

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#718895]">
              Need assistance?
            </p>

            <p className="mt-1 text-[13px] font-bold text-[#F8FAFC]">
              Call our mobile service
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}