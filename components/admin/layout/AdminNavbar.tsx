"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  ExternalLink,
  Home,
  ShieldCheck,
} from "lucide-react";

interface AdminNavbarProps {
  businessName: string;
}

const PAGE_META: Record<
  string,
  {
    title: string;
    description: string;
  }
> = {
  "/admin": {
    title: "Dashboard",
    description: "Overview of your business operations",
  },

  "/admin/services": {
    title: "Services",
    description: "Manage your service offerings",
  },

  "/admin/service-areas": {
    title: "Service Areas",
    description: "Manage locations where you provide service",
  },

  "/admin/faqs": {
    title: "FAQs",
    description: "Manage frequently asked questions",
  },

  "/admin/blog": {
    title: "Blog",
    description: "Manage website articles and content",
  },

  "/admin/reviews": {
    title: "Reviews",
    description: "Manage genuine customer reviews",
  },

  "/admin/testimonials": {
    title: "Reviews",
    description: "Manage genuine customer reviews",
  },

  "/admin/bookings": {
    title: "Bookings",
    description: "Manage customer appointments",
  },

  "/admin/enquiries": {
    title: "Enquiries",
    description: "Manage customer enquiries",
  },

  "/admin/availability": {
    title: "Availability",
    description: "Manage booking availability",
  },

  "/admin/settings": {
    title: "Site Settings",
    description: "Manage global business settings",
  },
};

function getPageMeta(pathname: string) {
  if (pathname === "/admin") {
    return PAGE_META["/admin"];
  }

  const exactMatch = PAGE_META[pathname];

  if (exactMatch) {
    return exactMatch;
  }

  if (pathname.startsWith("/admin/services/")) {
    return {
      title: "Service",
      description: "Manage service information",
    };
  }

  if (pathname.startsWith("/admin/service-areas/")) {
    return {
      title: "Service Area",
      description: "Manage service area information",
    };
  }

  if (pathname.startsWith("/admin/faqs/")) {
    return {
      title: "FAQ",
      description: "Manage frequently asked questions",
    };
  }

  if (pathname.startsWith("/admin/blog/")) {
    return {
      title: "Blog",
      description: "Manage blog content",
    };
  }

  if (
    pathname.startsWith("/admin/reviews/") ||
    pathname.startsWith("/admin/testimonials/")
  ) {
    return {
      title: "Review",
      description: "Manage customer review",
    };
  }

  if (pathname.startsWith("/admin/bookings/")) {
    return {
      title: "Bookings",
      description: "Manage customer appointments",
    };
  }

  if (pathname.startsWith("/admin/enquiries/")) {
    return {
      title: "Enquiry",
      description: "Manage customer enquiry",
    };
  }

  return {
    title: "Admin Console",
    description: "Manage your business website",
  };
}

function formatBreadcrumb(pathname: string) {
  if (pathname === "/admin") {
    return [];
  }

  const segments = pathname
    .split("/")
    .filter(Boolean);

  return segments
    .slice(1)
    .filter(
      (segment) =>
        !/^[a-f0-9]{24}$/i.test(segment)
    )
    .map((segment) => {
      return segment
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (letter) =>
          letter.toUpperCase()
        );
    });
}

export default function AdminNavbar({
  businessName,
}: AdminNavbarProps) {
  const pathname = usePathname();

  const meta = getPageMeta(pathname);
  const breadcrumbs = formatBreadcrumb(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#061A2B]/85 backdrop-blur-2xl">
      <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 p-3.5">

        {/* =================================================
            LEFT — PAGE CONTEXT
        ================================================= */}
        <div className="min-w-0">
          {/* Breadcrumb */}
          <div className="mb-1.5 hidden items-center gap-1.5 md:flex">
            <Link
              href="/admin"
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#5F7685] transition hover:text-[#A8BBC8]"
            >
              <Home className="h-3 w-3" />
              Admin
            </Link>

            {breadcrumbs.map(
              (breadcrumb, index) => (
                <div
                  key={`${breadcrumb}-${index}`}
                  className="flex items-center gap-1.5"
                >
                  <ChevronRight className="h-3 w-3 text-[#415765]" />

                  <span className="max-w-[180px] truncate text-[10px] font-bold uppercase tracking-[0.14em] text-[#718895]">
                    {breadcrumb}
                  </span>
                </div>
              )
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold tracking-tight text-[#F8FAFC] sm:text-lg">
                {meta.title}
              </h1>

              <p className="mt-0.5 hidden truncate text-xs text-[#718895] sm:block">
                {meta.description}
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            RIGHT — ACTIONS
        ================================================= */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Website */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-[#08263D] px-3.5 text-xs font-bold text-[#A8BBC8] transition hover:border-white/[0.15] hover:bg-[#0A2D47] hover:text-[#F8FAFC] sm:inline-flex"
          >
            <ExternalLink className="h-3.5 w-3.5" />

            <span>Website</span>
          </Link>

          {/* Divider */}
          <div className="hidden h-7 w-px bg-white/[0.08] sm:block" />

          {/* Admin status */}
          <div className="flex h-10 items-center gap-2.5 rounded-xl border border-white/[0.08] bg-[#08263D] px-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#67E8A5]/10 text-[#67E8A5]">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>

            <div className="hidden min-w-0 lg:block">
              <p className="text-[10px] font-bold text-[#F8FAFC]">
                Admin
              </p>

              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#67E8A5]" />

                <span className="text-[9px] font-semibold text-[#718895]">
                  Secure
                </span>
              </div>
            </div>

            <span
              className="h-1.5 w-1.5 rounded-full bg-[#67E8A5] shadow-[0_0_8px_rgba(103,232,165,0.45)] lg:hidden"
              aria-label={`${businessName} admin session active`}
            />
          </div>
        </div>
      </div>
    </header>
  );
}