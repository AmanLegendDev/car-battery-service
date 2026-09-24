"use client";

import { useState } from "react";

import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import AdminMobileHeader from "./AdminMobileHeader";

interface AdminShellProps {
  children: React.ReactNode;
  businessName: string;
  logoUrl?: string;
}

export default function AdminShell({
  children,
  businessName,
  logoUrl,
}: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#061A2B] text-[#F8FAFC]">

      {/* =================================================
          SIDEBAR
      ================================================= */}
      <AdminSidebar
        businessName={businessName}
        logoUrl={logoUrl}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* =================================================
          MAIN APPLICATION AREA
      ================================================= */}
      <div className="min-h-screen lg:pl-[280px]">

        {/* Mobile top bar */}
        <AdminMobileHeader
          businessName={businessName}
          onOpen={() => setSidebarOpen(true)}
        />

        {/* Desktop top navbar */}
        <div className="hidden lg:block">
          <AdminNavbar
            businessName={businessName}
          />
        </div>

        {/* Page content */}
        <main className="min-h-[calc(100vh-70px)] lg:min-h-[calc(100vh-76px)]">
          {children}
        </main>
      </div>
    </div>
  );
}