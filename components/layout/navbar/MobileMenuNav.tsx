"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  BookOpen,
  ChevronDown,
  HelpCircle,
  Home,
  Info,
  Mail,
  MapPin,
  Star,
} from "lucide-react";

import { NAVBAR_LINKS } from "./navbarData";
import type { NavbarService } from "./ServicesDropdown";

interface MobileMenuNavProps {
  onNavigate: () => void;
  services: NavbarService[];
}

const NAV_ICONS = {
  Home,
  About: Info,
  "Service Areas": MapPin,
  Testimonials: Star,
  FAQs: HelpCircle,
  Blog: BookOpen,
  Contact: Mail,
} as const;

export default function MobileMenuNav({
  onNavigate,
  services,
}: MobileMenuNavProps) {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(
    pathname.startsWith("/services")
  );

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className="flex flex-col"
    >
      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <div>
        <div className="mb-4 flex items-center justify-between px-1">
          <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#718895]">
            Navigation
          </p>

          <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/[0.18]">
            Explore
          </span>
        </div>

        <div className="space-y-1.5">
          {/* Regular navigation */}
          {NAVBAR_LINKS.map((link) => {
            const active = isActive(link.href);
            const Icon =
              NAV_ICONS[
                link.label as keyof typeof NAV_ICONS
              ];

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onNavigate}
                aria-current={
                  active ? "page" : undefined
                }
                className={`group relative flex min-h-[54px] items-center gap-3.5 overflow-hidden rounded-[16px] border px-3.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/50 ${
                  active
                    ? "border-[#FFD400]/20 bg-[#FFD400]/[0.07]"
                    : "border-transparent bg-white/[0.018] hover:border-white/[0.07] hover:bg-white/[0.045]"
                }`}
              >
                {/* Active indicator */}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-r-full bg-[#FFD400] transition-opacity duration-200 ${
                    active
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />

                {/* Icon */}
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border transition-all duration-200 ${
                    active
                      ? "border-[#FFD400]/20 bg-[#FFD400]/[0.09]"
                      : "border-white/[0.06] bg-white/[0.025] group-hover:border-white/[0.1] group-hover:bg-white/[0.045]"
                  }`}
                >
                  <Icon
                    aria-hidden="true"
                    className={`h-4 w-4 transition-colors duration-200 ${
                      active
                        ? "text-[#FFD400]"
                        : "text-[#718895] group-hover:text-[#A8BBC8]"
                    }`}
                    strokeWidth={1.8}
                  />
                </span>

                {/* Label */}
                <span
                  className={`min-w-0 flex-1 text-[13px] font-semibold transition-colors duration-200 ${
                    active
                      ? "text-[#F8FAFC]"
                      : "text-[#A8BBC8] group-hover:text-[#F8FAFC]"
                  }`}
                >
                  {link.label}
                </span>

                {/* Arrow */}
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 ${
                    active
                      ? "border-[#FFD400]/15 bg-[#FFD400]/[0.05]"
                      : "border-white/[0.05] bg-white/[0.02]"
                  }`}
                >
                  <ArrowUpRight
                    aria-hidden="true"
                    className={`h-3.5 w-3.5 transition-all duration-200 ${
                      active
                        ? "text-[#FFD400]"
                        : "text-[#718895] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#FFD400]"
                    }`}
                  />
                </span>
              </Link>
            );
          })}

          {/* =================================================
              SERVICES ACCORDION
          ================================================== */}

          <div
            className={`overflow-hidden rounded-[18px] border transition-all duration-200 ${
              servicesOpen
                ? "border-[#FFD400]/15 bg-white/[0.025]"
                : "border-transparent bg-white/[0.018] hover:border-white/[0.07]"
            }`}
          >
            {/* Services header */}
            <div className="flex min-h-[60px] items-center">
              {/* Services page link */}
              <Link
                href="/services"
                onClick={onNavigate}
                className="group flex min-w-0 flex-1 items-center gap-3.5 px-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/50"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border transition-all duration-200 ${
                    servicesOpen
                      ? "border-[#FFD400]/20 bg-[#FFD400]/[0.09]"
                      : "border-white/[0.06] bg-white/[0.025] group-hover:border-[#FFD400]/15 group-hover:bg-[#FFD400]/[0.06]"
                  }`}
                >
                  <BatteryCharging
                    aria-hidden="true"
                    className={`h-4 w-4 transition-colors duration-200 ${
                      servicesOpen
                        ? "text-[#FFD400]"
                        : "text-[#718895] group-hover:text-[#FFD400]"
                    }`}
                    strokeWidth={1.9}
                  />
                </span>

                <div className="min-w-0">
                  <p
                    className={`text-[13px] font-semibold transition-colors duration-200 ${
                      servicesOpen
                        ? "text-[#F8FAFC]"
                        : "text-[#A8BBC8] group-hover:text-[#F8FAFC]"
                    }`}
                  >
                    Services
                  </p>

                  <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-[#718895]">
                    Mobile battery assistance
                  </p>
                </div>
              </Link>

              {/* Accordion toggle */}
              <button
                type="button"
                aria-label={
                  servicesOpen
                    ? "Collapse services"
                    : "Expand services"
                }
                aria-expanded={servicesOpen}
                aria-controls="mobile-services-menu"
                onClick={() =>
                  setServicesOpen(
                    (current) => !current
                  )
                }
                className="mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-white/[0.07] bg-white/[0.025] text-[#718895] transition-all duration-200 hover:border-[#FFD400]/20 hover:bg-[#FFD400]/[0.06] hover:text-[#FFD400] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/50 active:scale-95"
              >
                <ChevronDown
                  aria-hidden="true"
                  className={`h-4 w-4 transition-transform duration-250 ${
                    servicesOpen
                      ? "rotate-180 text-[#FFD400]"
                      : ""
                  }`}
                />
              </button>
            </div>

            {/* Services content */}
            <div
              id="mobile-services-menu"
              className={`grid transition-[grid-template-rows,opacity] duration-250 ease-out ${
                servicesOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="px-2.5 pb-2.5">
                  {/* Divider */}
                  <div className="mb-2 border-t border-white/[0.06]" />

                  {services.length > 0 ? (
                    <div className="space-y-1">
                      {services.map(
                        (service, index) => {
                          const serviceHref =
                            `/services/${service.slug}`;

                          const active =
                            isActive(
                              serviceHref
                            );

                          return (
                            <Link
                              key={service.id}
                              href={serviceHref}
                              onClick={onNavigate}
                              aria-current={
                                active
                                  ? "page"
                                  : undefined
                              }
                              className={`group flex min-h-[64px] items-center gap-3 rounded-[14px] border px-3 transition-all duration-200 ${
                                active
                                  ? "border-[#FFD400]/15 bg-[#FFD400]/[0.055]"
                                  : "border-transparent bg-[#061A2B]/[0.28] hover:border-white/[0.07] hover:bg-white/[0.04]"
                              }`}
                            >
                              {/* Number */}
                              <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-[9px] font-bold ${
                                  active
                                    ? "bg-[#FFD400] text-[#061A2B]"
                                    : "border border-white/[0.07] bg-white/[0.025] text-[#718895]"
                                }`}
                              >
                                {String(
                                  index + 1
                                ).padStart(
                                  2,
                                  "0"
                                )}
                              </span>

                              {/* Battery icon */}
                              <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] ${
                                  active
                                    ? "bg-[#FFD400]/[0.08]"
                                    : "bg-[#0D6E91]/[0.12]"
                                }`}
                              >
                                <BatteryCharging
                                  aria-hidden="true"
                                  className={`h-4 w-4 ${
                                    active
                                      ? "text-[#FFD400]"
                                      : "text-[#0D6E91]"
                                  }`}
                                  strokeWidth={
                                    1.8
                                  }
                                />
                              </span>

                              {/* Service info */}
                              <div className="min-w-0 flex-1">
                                <p
                                  className={`truncate text-[12px] font-semibold transition-colors duration-200 ${
                                    active
                                      ? "text-[#F8FAFC]"
                                      : "text-[#A8BBC8] group-hover:text-[#F8FAFC]"
                                  }`}
                                >
                                  {service.title}
                                </p>

                                <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#718895]">
                                  Mobile service
                                </p>
                              </div>

                              {/* Arrow */}
                              <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] transition-all duration-200 ${
                                  active
                                    ? "bg-[#FFD400] text-[#061A2B]"
                                    : "border border-white/[0.06] bg-white/[0.02] text-[#718895] group-hover:border-[#FFD400]/15 group-hover:bg-[#FFD400]/[0.06] group-hover:text-[#FFD400]"
                                }`}
                              >
                                <ArrowUpRight
                                  aria-hidden="true"
                                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                    active
                                      ? ""
                                      : "group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                  }`}
                                />
                              </span>
                            </Link>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <div className="rounded-[14px] border border-white/[0.06] bg-white/[0.02] px-4 py-5 text-center">
                      <BatteryCharging
                        aria-hidden="true"
                        className="mx-auto h-5 w-5 text-[#718895]"
                      />

                      <p className="mt-2 text-[11px] font-semibold text-[#A8BBC8]">
                        No services available
                      </p>
                    </div>
                  )}

                  {/* View all */}
                  {services.length > 0 ? (
                    <Link
                      href="/services"
                      onClick={onNavigate}
                      className="group mt-2 flex min-h-11 items-center justify-between rounded-[13px] border border-[#FFD400]/10 bg-[#FFD400]/[0.035] px-3.5 transition-all duration-200 hover:border-[#FFD400]/20 hover:bg-[#FFD400]/[0.06]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFD400] text-[#061A2B]">
                          <ArrowRight
                            aria-hidden="true"
                            className="h-3.5 w-3.5"
                          />
                        </span>

                        <span className="text-[11px] font-bold text-[#F8FAFC]">
                          View all services
                        </span>
                      </div>

                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-3.5 w-3.5 text-[#FFD400] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          ASSISTANCE CARD
      ====================================================== */}

      <div className=" p-4 mt-8 overflow-hidden rounded-[14px] border border-white/[0.08] bg-gradient-to-br from-white/[0.045] to-white/[0.018] shadow-[0_20px_50px_rgba(0,0,0,0.16)]">
        <div className="relative p-4.5">
          {/* Ambient glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#FFD400]/[0.045] blur-3xl"
          />

          <div className="relative flex items-center gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-[#FFD400] text-[#061A2B] shadow-[0_8px_25px_rgba(255,212,0,0.12)]">
              <BatteryCharging
                aria-hidden="true"
                className="h-5 w-5"
                strokeWidth={2}
              />
            </span>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#718895]">
                Need assistance?
              </p>

              <p className="mt-1 text-[12px] font-bold text-[#F8FAFC]">
                Need help with your battery?
              </p>
            </div>
          </div>

          <p className="relative mt-3 text-[10px] leading-5 text-[#718895]">
            Explore our mobile battery services or
            get in touch with the team.
          </p>
        
        </div>
        
      </div>
       <p className="mt-6 text-center">+61 467 037 886</p>
    </nav>
  );
}