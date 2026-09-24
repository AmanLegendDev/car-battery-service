"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronRight,
  ExternalLink,
  LogOut,
  PanelLeftClose,
  ShieldCheck,
  X,
} from "lucide-react";

import { ADMIN_NAV_ITEMS } from "./adminNav";

interface AdminSidebarProps {
  businessName: string;
  logoUrl?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({
  businessName,
  logoUrl,
  isOpen,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/signout", {
      method: "POST",
    });

    router.push("/admin/login");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  return (
    <>
      {/* =====================================================
          MOBILE BACKDROP
      ===================================================== */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col",
          "border-r border-white/[0.07]",
          "bg-[#061A2B]",
          "shadow-[25px_0_80px_rgba(0,0,0,0.28)]",
          "transition-transform duration-300 ease-out",
          "lg:translate-x-0",
          isOpen
            ? "translate-x-0"
            : "-translate-x-full",
        ].join(" ")}
      >
        {/* =================================================
            TOP BRAND AREA
        ================================================= */}
        <div className="relative shrink-0 border-b border-white/[0.07]">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute -left-10 -top-16 h-40 w-40 rounded-full bg-[#0D6E91]/10 blur-3xl" />

          <div className="relative flex h-[96px] items-center px-5">
            <Link
              href="/admin"
              onClick={onClose}
              className="group flex min-w-0 items-center gap-3.5"
            >
              {/* Logo */}
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.10] bg-[#08263D] shadow-[0_8px_30px_rgba(0,0,0,0.18)]">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={businessName}
                    fill
                    sizes="48px"
                    className="object-contain p-1.5 transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-sm font-black text-[#FFD400]">
                    CB
                  </span>
                )}
              </div>

              {/* Brand text */}
              <div className="min-w-0">
                <p className="truncate text-[15px] font-extrabold tracking-[-0.02em] text-[#F8FAFC]">
                  {businessName}
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#67E8A5] shadow-[0_0_8px_rgba(103,232,165,0.5)]" />

                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718895]">
                    Admin Console
                  </p>
                </div>
              </div>
            </Link>

            {/* Mobile close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#08263D] text-[#A8BBC8] transition hover:border-white/[0.15] hover:bg-[#0A2D47] hover:text-[#F8FAFC] lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}
        <nav
          aria-label="Admin navigation"
          className="min-h-0 flex-1 overflow-y-auto px-4 py-6"
        >
          {/* Section heading */}
          <div className="mb-3 flex items-center justify-between px-2">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#5F7685]">
              Management
            </p>

            <span className="h-px w-12 bg-white/[0.06]" />
          </div>

          <div className="space-y-1.5">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={[
                    "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5",
                    "transition-all duration-200",
                    active
                      ? "bg-[#FFD400] text-[#061A2B] shadow-[0_10px_30px_rgba(255,212,0,0.10)]"
                      : "text-[#A8BBC8] hover:bg-white/[0.045] hover:text-[#F8FAFC]",
                  ].join(" ")}
                >
                  {/* Active indicator */}
                  {active && (
                    <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-[#061A2B]" />
                  )}

                  {/* Icon box */}
                  <span
                    className={[
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      "transition-all duration-200",
                      active
                        ? "bg-[#061A2B]/10"
                        : "bg-[#08263D] group-hover:bg-[#0A2D47]",
                    ].join(" ")}
                  >
                    <Icon className="h-[17px] w-[17px]" />
                  </span>

                  {/* Label */}
                  <span className="min-w-0 flex-1 truncate text-[13px] font-bold">
                    {item.title}
                  </span>

                  {/* Arrow */}
                  <ChevronRight
                    className={[
                      "h-4 w-4 shrink-0 transition-all duration-200",
                      active
                        ? "opacity-70"
                        : "text-[#4E6675] opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100",
                    ].join(" ")}
                  />
                </Link>
              );
            })}
          </div>
        </nav>

        {/* =================================================
            BOTTOM AREA
        ================================================= */}
        <div className="shrink-0 border-t border-white/[0.07] bg-[#061A2B] p-4">
          {/* Admin status */}
          <div className="mb-3 rounded-2xl border border-white/[0.06] bg-[#08263D] p-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#67E8A5]/10 text-[#67E8A5]">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#F8FAFC]">
                  Secure Admin
                </p>

                <p className="mt-0.5 truncate text-[9px] font-medium text-[#718895]">
                  Protected dashboard
                </p>
              </div>

              <span className="ml-auto h-2 w-2 rounded-full bg-[#67E8A5] shadow-[0_0_8px_rgba(103,232,165,0.5)]" />
            </div>
          </div>

          {/* View website */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="group mb-1.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold text-[#A8BBC8] transition hover:bg-white/[0.045] hover:text-[#F8FAFC]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#08263D] transition group-hover:bg-[#0A2D47]">
              <ExternalLink className="h-4 w-4" />
            </span>

            <span className="flex-1">
              View Website
            </span>

            <ChevronRight className="h-4 w-4 text-[#4E6675] transition group-hover:translate-x-0.5 group-hover:text-[#A8BBC8]" />
          </Link>

          {/* Sign out */}
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-bold text-[#A8BBC8] transition hover:bg-red-500/[0.07] hover:text-red-300"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#08263D] transition group-hover:bg-red-500/10">
              <LogOut className="h-4 w-4" />
            </span>

            <Link className="flex-1" href="/admin/login">
              Sign Out
            </Link>

            <ChevronRight className="h-4 w-4 text-[#4E6675] transition group-hover:translate-x-0.5 group-hover:text-red-300" />
          </button>
        </div>
      </aside>
    </>
  );
}