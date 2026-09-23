import { ArrowLeft, Edit3 } from "lucide-react";
import Link from "next/link";

import ServiceForm from "@/components/admin/services/ServiceForm";

export const metadata = {
  title: "Edit Service | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

interface EditServicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditServicePage({
  params,
}: EditServicePageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#061A2B] text-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* PAGE HEADER */}

        <div className="mb-7">
          <Link
            href="/admin/services"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#A8BBC8] transition hover:text-[#FFD400]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            {/* TITLE */}

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#FFD400]/20 bg-[#FFD400]/10 text-[#FFD400] shadow-[0_10px_30px_rgba(255,212,0,0.08)]">
                <Edit3 className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFD400]">
                  Service CMS
                </p>

                <h1 className="mt-1 text-2xl font-black tracking-tight text-[#F8FAFC] sm:text-3xl">
                  Edit Service
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A8BBC8]">
                  Update service content, media, customer actions,
                  publishing controls and SEO.
                </p>
              </div>
            </div>

            {/* STATUS CARD */}

            <div className="hidden rounded-xl border border-white/[0.08] bg-[#08263D] px-4 py-3 shadow-[0_12px_35px_rgba(0,0,0,0.18)] sm:block">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0D6E91] shadow-[0_0_10px_rgba(13,110,145,0.45)]" />

                <span className="text-xs font-semibold text-[#F8FAFC]">
                  Edit mode
                </span>
              </div>

              <p className="mt-1 text-[11px] text-[#718895]">
                Review changes before saving
              </p>
            </div>
          </div>
        </div>

        {/* SERVICE FORM */}

        <ServiceForm
          mode="edit"
          serviceId={id}
        />
      </div>
    </main>
  );
}