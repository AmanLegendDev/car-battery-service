import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit3,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import ServiceArea from "@/models/ServiceArea";

import ServiceAreaForm, {
  type ServiceAreaFormData,
} from "@/components/admin/service-areas/ServiceAreaForm";

export const metadata: Metadata = {
  title: "Edit Service Area | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

interface EditServiceAreaPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditServiceAreaPage({
  params,
}: EditServiceAreaPageProps) {
  const { id } = await params;

  await connectDB();

  const serviceArea = await ServiceArea.findById(id)
    .select(
      [
        "name",
        "slug",
        "shortDescription",
        "description",
        "suburbs",
        "postcodes",
        "heroImage",
        "mapUrl",
        "serviceAvailability",
        "featured",
        "displayOrder",
        "status",
        "seoTitle",
        "seoDescription",
      ].join(" ")
    )
    .lean();

  if (!serviceArea) {
    notFound();
  }

  const initialData: ServiceAreaFormData = {
    name: serviceArea.name ?? "",

    slug: serviceArea.slug ?? "",

    shortDescription:
      serviceArea.shortDescription ?? "",

    description:
      serviceArea.description ?? "",

    suburbs: Array.isArray(serviceArea.suburbs)
      ? serviceArea.suburbs.map(String)
      : [],

    postcodes: Array.isArray(serviceArea.postcodes)
      ? serviceArea.postcodes.map(String)
      : [],

    heroImage: serviceArea.heroImage
      ? {
          publicId:
            serviceArea.heroImage.publicId,

          secureUrl:
            serviceArea.heroImage.secureUrl,

          width:
            serviceArea.heroImage.width,

          height:
            serviceArea.heroImage.height,

          format:
            serviceArea.heroImage.format,

          bytes:
            serviceArea.heroImage.bytes,

          resourceType: "image",

          alt:
            serviceArea.heroImage.alt ?? "",
        }
      : null,

    mapUrl:
      serviceArea.mapUrl ?? "",

    serviceAvailability:
      serviceArea.serviceAvailability ?? "",

    featured:
      Boolean(serviceArea.featured),

    displayOrder:
      Number.isFinite(
        serviceArea.displayOrder
      )
        ? serviceArea.displayOrder
        : 0,

    status:
      serviceArea.status === "active"
        ? "active"
        : "draft",

    seoTitle:
      serviceArea.seoTitle ?? "",

    seoDescription:
      serviceArea.seoDescription ?? "",
  };

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* =====================================================
            BACK
        ===================================================== */}

        <Link
          href="/admin/service-areas"
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#A8BBC8] transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Service Areas
        </Link>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-7 overflow-hidden rounded-3xl border border-[#0D6E91]/30 bg-[#08263D] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <div className="relative p-5 sm:p-7 lg:p-8">
            {/* Ambient glow */}

            <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-[#0D6E91]/10 blur-3xl" />

            <div className="pointer-events-none absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-[#FFD400]/5 blur-3xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              {/* LEFT */}

              <div className="flex min-w-0 gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#061A2B] ring-1 ring-white/5">
                  <Edit3 className="h-6 w-6 text-[#FFD400]" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-[#FFD400]">
                      Service Area CMS
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0D6E91]/30 bg-[#0D6E91]/10 px-2.5 py-1 text-[10px] font-bold text-[#6FB9FF]">
                      <MapPin className="h-3 w-3" />
                      Edit Mode
                    </span>
                  </div>

                  <h1 className="mt-2 truncate text-2xl font-black tracking-tight text-white sm:text-3xl">
                    Edit {serviceArea.name}
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A8BBC8]">
                    Update the service area coverage,
                    customer information, media, SEO and
                    publishing settings.
                  </p>
                </div>
              </div>

              {/* RIGHT */}

              <div className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-[#FFD400]/20 bg-[#FFD400]/5 px-3 py-2 text-xs font-bold text-[#FFD400] sm:self-center">
                <ShieldCheck className="h-4 w-4" />
                Review changes before saving
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            REUSABLE FORM
        ===================================================== */}

        <ServiceAreaForm
          mode="edit"
          serviceAreaId={id}
          initialData={initialData}
        />
      </div>
    </main>
  );
}