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
    <main className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Settings
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            Site Settings
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Manage the global business information
            used across the website.
          </p>
        </div>

        <SiteSettingsForm />
      </div>
    </main>
  );
}