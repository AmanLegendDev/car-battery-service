import type { Metadata } from "next";

import SiteSettingsForm from "@/components/admin/settings/SiteSettingsForm";

export const metadata: Metadata = {
  title: "Site Settings | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SiteSettingsPage() {
  return (
    <main className="min-h-screen bg-[#061A2B] text-[#F8FAFC]">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        <div className="mb-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFD400]">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#F8FAFC] sm:text-3xl">
            Site Settings
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#A8BBC8]">
            Manage the global business information used
            across the website.
          </p>
        </div>

        <SiteSettingsForm />
      </div>
    </main>
  );
}