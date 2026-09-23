"use client";

import { Menu } from "lucide-react";

interface AdminMobileHeaderProps {
  onOpen: () => void;
  businessName: string;
}

export default function AdminMobileHeader({
  onOpen,
  businessName,
}: AdminMobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-[70px] items-center border-b border-white/[0.08] bg-[#061A2B]/90 px-4 backdrop-blur-xl lg:hidden">
      <button
        type="button"
        onClick={onOpen}
        aria-label="Open admin navigation"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.1] bg-[#08263D] text-[#F8FAFC] transition hover:border-white/[0.18] hover:bg-[#0A2D47] focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
      >
        <Menu
          aria-hidden="true"
          className="h-5 w-5"
        />
      </button>

      <div className="ml-3 min-w-0">
        <p className="truncate text-sm font-bold text-[#F8FAFC]">
          {businessName}
        </p>

        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#718895]">
          Admin Console
        </p>
      </div>
    </header>
  );
}