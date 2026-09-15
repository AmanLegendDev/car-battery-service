"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ArrowUpRight,
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
      <div className="mb-7">
        <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#718895]">
          Navigation
        </p>

        <div className="space-y-1">
          {NAVBAR_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className="group flex min-h-12 items-center justify-between rounded-xl px-3.5 text-[15px] font-semibold text-[#F8FAFC] transition-colors duration-150 hover:bg-white/[0.05] hover:text-[#FFD400] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/50"
            >
              <span>{link.label}</span>

              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 text-[#718895] transition-all duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#FFD400]"
              />
            </Link>
          ))}

          <div>
            <button
              type="button"
              aria-expanded={servicesOpen}
              onClick={() =>
                setServicesOpen((current) => !current)
              }
              className="flex min-h-12 w-full items-center justify-between rounded-xl px-3.5 text-left text-[15px] font-semibold text-[#F8FAFC] transition-colors duration-150 hover:bg-white/[0.05] hover:text-[#FFD400] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/50"
            >
              <span>Services</span>

              <ChevronDown
                aria-hidden="true"
                className={`h-4 w-4 text-[#718895] transition-transform duration-200 ${
                  servicesOpen ? "rotate-180 text-[#FFD400]" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-200 ${
                servicesOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="ml-3 mt-1 space-y-1 border-l border-white/[0.08] pl-3">
                  {SERVICE_LINKS.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      onClick={onNavigate}
                      className="group flex min-h-11 items-center justify-between rounded-lg px-3 text-sm font-medium text-[#A8BBC8] transition-colors duration-150 hover:bg-white/[0.04] hover:text-[#F8FAFC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/50"
                    >
                      <span>{service.label}</span>

                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-3.5 w-3.5 text-[#718895] transition-all duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#FFD400]"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
        <p className="text-[11px] font-medium leading-relaxed text-[#718895]">
          Need immediate battery assistance?
        </p>

        <p className="mt-1 text-sm font-bold text-[#F8FAFC]">
          Call our mobile service
        </p>
      </div>
    </nav>
  );
}