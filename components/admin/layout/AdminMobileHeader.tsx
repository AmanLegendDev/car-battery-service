"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  Menu,
  ShieldCheck,
} from "lucide-react";

interface AdminMobileHeaderProps {
  onOpen: () => void;
  businessName: string;
}

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/services": "Services",
  "/admin/service-areas": "Service Areas",
  "/admin/faqs": "FAQs",
  "/admin/blog": "Blog",
  "/admin/reviews": "Reviews",
  "/admin/testimonials": "Reviews",
  "/admin/bookings": "Bookings",
  "/admin/enquiries": "Enquiries",
  "/admin/availability": "Availability",
  "/admin/settings": "Site Settings",
};

function getPageTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) {
    return PAGE_TITLES[pathname];
  }

  if (pathname.startsWith("/admin/services/")) {
    return "Service";
  }

  if (pathname.startsWith("/admin/service-areas/")) {
    return "Service Area";
  }

  if (pathname.startsWith("/admin/faqs/")) {
    return "FAQ";
  }

  if (pathname.startsWith("/admin/blog/")) {
    return "Blog";
  }

  if (
    pathname.startsWith("/admin/reviews/") ||
    pathname.startsWith("/admin/testimonials/")
  ) {
    return "Review";
  }

  if (pathname.startsWith("/admin/bookings/")) {
    return "Bookings";
  }

  return "Admin";
}

export default function AdminMobileHeader({
  onOpen,
  businessName,
}: AdminMobileHeaderProps) {
  const pathname = usePathname();

  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#061A2B]/90 backdrop-blur-2xl lg:hidden">
      <div className="flex h-[70px] items-center gap-3 px-4">

        {/* Hamburger */}
        <button
          type="button"
          onClick={onOpen}
          aria-label="Open admin navigation"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.09] bg-[#08263D] text-[#F8FAFC] transition hover:border-[#FFD400]/30 hover:bg-[#0A2D47] hover:text-[#FFD400] focus:outline-none focus:ring-2 focus:ring-[#FFD400]/50"
        >
          <Menu
            aria-hidden="true"
            className="h-5 w-5"
          />
        </button>

        {/* Page context */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#F8FAFC]">
            {pageTitle}
          </p>

          <p className="mt-0.5 truncate text-[9px] font-bold uppercase tracking-[0.16em] text-[#718895]">
            {businessName}
          </p>
        </div>

        {/* Mobile status */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#08263D] text-[#67E8A5]">
          <ShieldCheck className="h-4 w-4" />
        </div>

        {/* Website */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View website"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#08263D] text-[#A8BBC8] transition hover:border-white/[0.15] hover:text-[#F8FAFC]"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}