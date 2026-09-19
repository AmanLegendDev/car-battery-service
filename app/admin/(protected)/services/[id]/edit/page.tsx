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
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* PAGE HEADER */}
        <div className="mb-6">
          <Link
            href="/admin/services"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#0D6E91]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#061A2B] text-[#FFD400] shadow-sm">
                <Edit3 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0D6E91]">
                  Service CMS
                </p>

                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Edit Service
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Update service content, media, customer
                  actions, publishing controls and SEO.
                </p>
              </div>
            </div>

            <div className="hidden rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-sm sm:block">
              <span className="font-semibold text-slate-800">
                Edit mode
              </span>{" "}
              · Review changes before saving
            </div>
          </div>
        </div>

        {/* SAME SERVICE FORM */}
        <ServiceForm
          mode="edit"
          serviceId={id}
        />
      </div>
    </main>
  );
}