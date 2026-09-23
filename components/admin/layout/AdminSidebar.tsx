"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ExternalLink,
  LogOut,
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

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col",
          "border-r border-white/[0.08] bg-[#061A2B]",
          "shadow-[20px_0_60px_rgba(0,0,0,0.22)]",
          "transition-transform duration-300 ease-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex h-[82px] shrink-0 items-center border-b border-white/[0.08] px-5">
          <Link
            href="/admin"
            onClick={onClose}
            className="group flex min-w-0 items-center gap-3"
          >
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.1] bg-[#08263D]">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={businessName}
                  fill
                  sizes="44px"
                  className="object-contain p-1.5"
                />
              ) : (
                <div className="text-sm font-black text-[#FFD400]">
                  CB
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold tracking-[-0.01em] text-[#F8FAFC]">
                {businessName}
              </p>

              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#718895]">
                Admin Console
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] text-[#A8BBC8] transition hover:border-white/[0.16] hover:bg-white/[0.05] hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Admin navigation"
          className="flex-1 overflow-y-auto px-3 py-5"
        >
          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#5F7685]">
            Management
          </p>

          <div className="space-y-1">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={[
                    "group relative flex items-center gap-3 rounded-xl px-3 py-3",
                    "text-sm font-semibold transition-all duration-200",
                    active
                      ? "bg-[#FFD400] text-[#061A2B] shadow-[0_8px_25px_rgba(255,212,0,0.12)]"
                      : "text-[#A8BBC8] hover:bg-white/[0.05] hover:text-[#F8FAFC]",
                  ].join(" ")}
                >
                  {active && (
                    <span className="absolute left-0 h-6 w-1 rounded-r-full bg-[#061A2B]" />
                  )}

                  <span
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition",
                      active
                        ? "bg-[#061A2B]/10"
                        : "bg-[#08263D] group-hover:bg-[#0D334E]",
                    ].join(" ")}
                  >
                    <Icon className="h-[17px] w-[17px]" />
                  </span>

                  <span className="truncate">
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom actions */}
        <div className="shrink-0 border-t border-white/[0.08] p-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="group mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#A8BBC8] transition hover:bg-white/[0.05] hover:text-[#F8FAFC]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#08263D]">
              <ExternalLink className="h-[17px] w-[17px]" />
            </span>

            <span>View Website</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#A8BBC8] transition hover:bg-red-500/[0.08] hover:text-red-300"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#08263D]">
              <LogOut className="h-[17px] w-[17px]" />
            </span>

            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}