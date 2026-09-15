import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import ServiceAreaForm from "@/components/admin/service-areas/ServiceAreaForm";

export const metadata: Metadata = {
  title: "Create Service Area | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewServiceAreaPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* HEADER */}
        <div className="mb-7">
          <Link
            href="/admin/service-areas"
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#A8BBC8] transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Service Areas
          </Link>

          <div className="overflow-hidden rounded-3xl border border-[#0D6E91]/30 bg-[#08263D] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
            <div className="relative p-5 sm:p-7 lg:p-8">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#0D6E91]/10 blur-3xl" />

              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#061A2B] ring-1 ring-white/5">
                    <MapPin className="h-6 w-6 text-[#FFD400]" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-[#FFD400]">
                        Service Area CMS
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-[#A8BBC8]">
                        New Area
                      </span>
                    </div>

                    <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                      Create New Service Area
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A8BBC8]">
                      Add a genuine service location
                      with structured coverage,
                      customer information, media and
                      publishing controls.
                    </p>
                  </div>
                </div>

                <div className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-[#FFD400]/20 bg-[#FFD400]/5 px-3 py-2 text-xs font-bold text-[#FFD400] sm:self-center">
                  <ShieldCheck className="h-4 w-4" />
                  Review before publishing
                </div>
              </div>
            </div>
          </div>
        </div>

        <ServiceAreaForm />
      </div>
    </main>
  );
}