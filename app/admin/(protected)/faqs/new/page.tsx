import type { Metadata } from "next";

import FAQForm from "@/components/admin/faqs/FAQForm";

export const metadata: Metadata = {
  title: "Add FAQ | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewFAQPage() {
  return (
    <main className="min-h-full bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Page Header */}

        <div className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0D6E91]">
                <span>FAQ Management</span>
                <span className="text-slate-300">
                  /
                </span>
                <span className="text-slate-400">
                  New FAQ
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-[#061A2B] sm:text-4xl">
                Add New FAQ
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Create a useful customer question and
                answer, connect it to relevant services
                and service areas, and control where it
                appears across the website.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm sm:flex">
              <span className="h-2 w-2 rounded-full bg-[#0D6E91]" />
              Central FAQ Content
            </div>
          </div>
        </div>

        <FAQForm />
      </div>
    </main>
  );
}