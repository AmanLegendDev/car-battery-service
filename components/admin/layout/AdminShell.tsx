"use client";

import { useState } from "react";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#061A2B] text-[#F8FAFC]">
      <AdminSidebar
        businessName={businessName}
        logoUrl={logoUrl}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-[280px]">
        <AdminMobileHeader
          businessName={businessName}
          onOpen={() => setSidebarOpen(true)}
        />

        <main className="min-h-[calc(100vh-70px)] lg:min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}