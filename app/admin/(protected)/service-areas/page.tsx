"use client";

import {
  Edit3,
  ExternalLink,
  Eye,
  Globe2,
  MapPin,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface ServiceAreaMedia {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: "image";
  alt: string;
}

interface ServiceAreaItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  suburbs: string[];
  postcodes: string[];
  heroImage: ServiceAreaMedia | null;
  mapUrl: string;
  serviceAvailability: string;
  featured: boolean;
  displayOrder: number;
  status: "active" | "draft";
  seoTitle: string;
  seoDescription: string;
  createdAt: string | null;
  updatedAt: string | null;
}

interface ServiceAreasResponse {
  success: boolean;
  data: ServiceAreaItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

interface ServiceAreaResponse {
  success: boolean;
  data?: ServiceAreaItem;
  message?: string;
}

export default function ServiceAreasAdminPage() {
  const [areas, setAreas] = useState<ServiceAreaItem[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [featured, setFeatured] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [viewArea, setViewArea] = useState<ServiceAreaItem | null>(null);
  const [deleteArea, setDeleteArea] =
    useState<ServiceAreaItem | null>(null);

  const loadAreas = useCallback(async () => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", "20");

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (status) {
        params.set("status", status);
      }

      if (featured) {
        params.set("featured", featured);
      }

      const response = await fetch(
        `/api/admin/service-areas?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result: ServiceAreasResponse =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load service areas."
        );
      }

      setAreas(Array.isArray(result.data) ? result.data : []);

      setTotal(result.pagination?.total ?? result.data.length);

      setTotalPages(
        Math.max(1, result.pagination?.totalPages ?? 1)
      );
    } catch (error) {
      console.error("Load service areas error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load service areas."
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, search, status, featured]);

  useEffect(() => {
    loadAreas();
  }, [loadAreas]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(value: string) {
    setStatus(value);
    setPage(1);
  }

  function handleFeaturedChange(value: string) {
    setFeatured(value);
    setPage(1);
  }

  async function handleDelete() {
    if (!deleteArea) {
      return;
    }

    try {
      setDeletingId(deleteArea.id);

      const response = await fetch(
        `/api/admin/service-areas/${deleteArea.id}`,
        {
          method: "DELETE",
        }
      );

      const result: ServiceAreaResponse =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to delete service area."
        );
      }

      toast.success(
        `"${deleteArea.name}" deleted successfully.`
      );

      setDeleteArea(null);

      await loadAreas();
    } catch (error) {
      console.error("Delete service area error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete service area."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <main className="min-h-screen bg-[#061A2B] text-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* =====================================================
              HEADER
          ===================================================== */}

          <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#FFD400]/20 bg-[#FFD400]/10 text-[#FFD400] shadow-[0_10px_30px_rgba(255,212,0,0.08)]">
                <MapPin className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFD400]">
                  Location CMS
                </p>

                <h1 className="mt-1 text-2xl font-black tracking-tight text-[#F8FAFC] sm:text-3xl">
                  Service Areas
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A8BBC8]">
                  Manage genuine supported service areas, suburbs,
                  postcodes, publishing status and local SEO information.
                </p>
              </div>
            </div>

            <Link
              href="/admin/service-areas/new"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-5 text-sm font-bold text-[#061A2B] shadow-[0_10px_30px_rgba(255,212,0,0.14)] transition hover:bg-[#F5B800]"
            >
              <Plus className="h-4 w-4" />
              Create Service Area
            </Link>
          </div>

          {/* =====================================================
              FILTERS
          ===================================================== */}

          <section className="mb-6 rounded-2xl border border-white/[0.08] bg-[#08263D] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.18)] sm:p-5">
            <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
              {/* SEARCH */}

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718895]" />

                <input
                  value={search}
                  onChange={(event) =>
                    handleSearchChange(event.target.value)
                  }
                  placeholder="Search service areas..."
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#061A2B] pl-10 pr-4 text-sm text-[#F8FAFC] outline-none transition placeholder:text-[#718895] focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/15"
                />
              </div>

              {/* STATUS */}

              <select
                value={status}
                onChange={(event) =>
                  handleStatusChange(event.target.value)
                }
                className="h-11 rounded-xl border border-white/[0.08] bg-[#061A2B] px-3 text-sm font-medium text-[#A8BBC8] outline-none transition focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/15"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>

              {/* FEATURED */}

              <select
                value={featured}
                onChange={(event) =>
                  handleFeaturedChange(event.target.value)
                }
                className="h-11 rounded-xl border border-white/[0.08] bg-[#061A2B] px-3 text-sm font-medium text-[#A8BBC8] outline-none transition focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/15"
              >
                <option value="">All Areas</option>
                <option value="true">Featured</option>
                <option value="false">Not Featured</option>
              </select>
            </div>
          </section>

          {/* =====================================================
              SUMMARY
          ===================================================== */}

          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-[#A8BBC8]">
              {isLoading
                ? "Loading service areas..."
                : `${total} area${total === 1 ? "" : "s"}`}
            </p>

            <p className="text-xs text-[#718895]">
              Page {page} of {totalPages}
            </p>
          </div>

          {/* =====================================================
              LOADING
          ===================================================== */}

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08263D]"
                >
                  <div className="aspect-[16/9] animate-pulse bg-[#061A2B]" />

                  <div className="space-y-3 p-5">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-[#061A2B]" />
                    <div className="h-4 w-full animate-pulse rounded bg-[#061A2B]" />
                    <div className="h-4 w-4/5 animate-pulse rounded bg-[#061A2B]" />

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="h-9 animate-pulse rounded-xl bg-[#061A2B]" />
                      <div className="h-9 animate-pulse rounded-xl bg-[#061A2B]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : areas.length === 0 ? (
            /* ===================================================
               EMPTY STATE
            =================================================== */

            <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#08263D] px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#061A2B] text-[#718895]">
                <MapPin className="h-6 w-6" />
              </div>

              <h2 className="mt-4 text-lg font-black text-[#F8FAFC]">
                No service areas found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#A8BBC8]">
                Try changing your search or filters, or create
                your first genuine service area.
              </p>

              <Link
                href="/admin/service-areas/new"
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#FFD400] px-4 text-sm font-bold text-[#061A2B] transition hover:bg-[#F5B800]"
              >
                <Plus className="h-4 w-4" />
                Create Service Area
              </Link>
            </div>
          ) : (
            /* ===================================================
               SERVICE AREA GRID
            =================================================== */

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {areas.map((area) => (
                <article
                  key={area.id}
                  className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08263D] shadow-[0_15px_40px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:border-white/[0.14] hover:shadow-[0_25px_60px_rgba(0,0,0,0.24)]"
                >
                  {/* =================================================
                      IMAGE
                  ================================================= */}

                  <div className="relative aspect-[16/9] overflow-hidden bg-[#061A2B]">
                    {area.heroImage?.secureUrl ? (
                      <img
                        src={area.heroImage.secureUrl}
                        alt={
                          area.heroImage.alt ||
                          area.name
                        }
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <MapPin className="h-10 w-10 text-[#FFD400]" />
                      </div>
                    )}

                    {/* IMAGE OVERLAY */}

                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#061A2B]/90 to-transparent" />

                    {/* STATUS */}

                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                          area.status === "active"
                            ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                            : "border border-white/[0.08] bg-[#061A2B]/90 text-[#A8BBC8]"
                        }`}
                      >
                        {area.status}
                      </span>

                      {area.featured && (
                        <span className="rounded-full bg-[#FFD400] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#061A2B]">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* ORDER */}

                    <div className="absolute bottom-3 right-3 rounded-lg border border-white/[0.08] bg-[#061A2B]/90 px-2.5 py-1.5 text-[10px] font-bold text-[#F8FAFC] backdrop-blur">
                      Order #{area.displayOrder}
                    </div>

                    {/* AREA NAME */}

                    <div className="absolute bottom-3 left-3 right-24">
                      <p className="truncate text-base font-black text-white">
                        {area.name}
                      </p>
                    </div>
                  </div>

                  {/* =================================================
                      BODY
                  ================================================= */}

                  <div className="p-5">
                    <div className="min-h-[118px]">
                      <h2 className="text-lg font-black tracking-tight text-[#F8FAFC]">
                        {area.name}
                      </h2>

                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#A8BBC8]">
                        {area.shortDescription ||
                          "No short description added."}
                      </p>
                    </div>

                    {/* META */}

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-white/[0.06] bg-[#061A2B]/70 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#718895]">
                          Suburbs
                        </p>

                        <p className="mt-1 text-sm font-bold text-[#F8FAFC]">
                          {area.suburbs?.length ?? 0}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/[0.06] bg-[#061A2B]/70 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#718895]">
                          Postcodes
                        </p>

                        <p className="mt-1 text-sm font-bold text-[#F8FAFC]">
                          {area.postcodes?.length ?? 0}
                        </p>
                      </div>
                    </div>

                    {/* SLUG */}

                    <div className="mt-4 border-t border-white/[0.08] pt-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#718895]">
                        Public URL
                      </p>

                      <p className="mt-1 truncate text-xs font-semibold text-[#A8BBC8]">
                        /service-areas/{area.slug}
                      </p>
                    </div>

                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {/* EDIT */}

                      <Link
                        href={`/admin/service-areas/${area.id}/edit`}
                        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#061A2B] text-xs font-bold text-[#A8BBC8] transition hover:border-[#0D6E91] hover:bg-[#0D6E91]/10 hover:text-[#F8FAFC]"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit
                      </Link>

                      {/* VIEW */}

                      <button
                        type="button"
                        onClick={() => setViewArea(area)}
                        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#061A2B] text-xs font-bold text-[#A8BBC8] transition hover:border-[#0D6E91] hover:bg-[#0D6E91]/10 hover:text-[#F8FAFC]"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        disabled={deletingId === area.id}
                        onClick={() => setDeleteArea(area)}
                        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-red-400/20 bg-[#061A2B] text-xs font-bold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />

                        {deletingId === area.id
                          ? "..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* =====================================================
              PAGINATION
          ===================================================== */}

          {!isLoading && totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#08263D] p-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage((current) =>
                    Math.max(1, current - 1)
                  )
                }
                className="h-10 rounded-xl border border-white/[0.08] bg-[#061A2B] px-4 text-sm font-bold text-[#A8BBC8] transition hover:border-[#0D6E91] hover:bg-[#0D6E91]/10 hover:text-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-xs font-semibold text-[#A8BBC8]">
                {page} / {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) =>
                    Math.min(
                      totalPages,
                      current + 1
                    )
                  )
                }
                className="h-10 rounded-xl border border-white/[0.08] bg-[#061A2B] px-4 text-sm font-bold text-[#A8BBC8] transition hover:border-[#0D6E91] hover:bg-[#0D6E91]/10 hover:text-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      {/* =========================================================
          VIEW MODAL
      ========================================================= */}

      {viewArea && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setViewArea(null);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-white/[0.1] bg-[#08263D] shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FFD400]/20 bg-[#FFD400]/10 text-[#FFD400]">
                  <MapPin className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFD400]">
                    Service Area
                  </p>

                  <h2 className="truncate text-lg font-black text-[#F8FAFC]">
                    {viewArea.name}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewArea(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#061A2B] text-[#A8BBC8] transition hover:border-white/[0.16] hover:text-[#F8FAFC]"
                aria-label="Close service area preview"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="max-h-[calc(90vh-73px)] overflow-y-auto p-5 sm:p-6">
              {/* IMAGE */}

              {viewArea.heroImage?.secureUrl && (
                <div className="mb-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#061A2B]">
                  <img
                    src={viewArea.heroImage.secureUrl}
                    alt={
                      viewArea.heroImage.alt ||
                      viewArea.name
                    }
                    className="aspect-[16/7] w-full object-cover"
                  />
                </div>
              )}

              {/* STATUS */}

              <div className="mb-6 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${
                    viewArea.status === "active"
                      ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                      : "border border-white/[0.08] bg-[#061A2B] text-[#A8BBC8]"
                  }`}
                >
                  {viewArea.status}
                </span>

                {viewArea.featured && (
                  <span className="rounded-full bg-[#FFD400] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#061A2B]">
                    Featured
                  </span>
                )}
              </div>

              {/* DESCRIPTION */}

              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#718895]">
                    Short Description
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#F8FAFC]">
                    {viewArea.shortDescription ||
                      "No short description added."}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#718895]">
                    Description
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#A8BBC8]">
                    {viewArea.description ||
                      "No description added."}
                  </p>
                </div>

                {/* LOCATION DATA */}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/[0.07] bg-[#061A2B]/70 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#718895]">
                      Suburbs
                    </p>

                    {viewArea.suburbs?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {viewArea.suburbs.map(
                          (suburb) => (
                            <span
                              key={suburb}
                              className="rounded-lg border border-white/[0.08] bg-[#08263D] px-2.5 py-1.5 text-xs font-semibold text-[#A8BBC8]"
                            >
                              {suburb}
                            </span>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-[#718895]">
                        No suburbs added.
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-[#061A2B]/70 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#718895]">
                      Postcodes
                    </p>

                    {viewArea.postcodes?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {viewArea.postcodes.map(
                          (postcode) => (
                            <span
                              key={postcode}
                              className="rounded-lg border border-white/[0.08] bg-[#08263D] px-2.5 py-1.5 text-xs font-semibold text-[#A8BBC8]"
                            >
                              {postcode}
                            </span>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-[#718895]">
                        No postcodes added.
                      </p>
                    )}
                  </div>
                </div>

                {/* AVAILABILITY */}

                <div className="rounded-2xl border border-[#0D6E91]/20 bg-[#0D6E91]/5 p-4">
                  <div className="flex items-start gap-3">
                    <Globe2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0D6E91]" />

                    <div>
                      <p className="text-sm font-bold text-[#F8FAFC]">
                        Service Availability
                      </p>

                      <p className="mt-1 text-sm leading-6 text-[#A8BBC8]">
                        {viewArea.serviceAvailability ||
                          "No availability information added."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* URL / ORDER */}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.07] bg-[#061A2B]/70 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#718895]">
                      Slug
                    </p>

                    <p className="mt-1 break-all text-sm font-semibold text-[#F8FAFC]">
                      {viewArea.slug}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.07] bg-[#061A2B]/70 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#718895]">
                      Display Order
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#F8FAFC]">
                      #{viewArea.displayOrder}
                    </p>
                  </div>
                </div>

                {/* MAP */}

                {viewArea.mapUrl && (
                  <a
                    href={viewArea.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#0D6E91]/30 bg-[#0D6E91]/10 px-4 py-3 text-sm font-bold text-[#F8FAFC] transition hover:border-[#0D6E91] hover:bg-[#0D6E91]/20"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Map
                  </a>
                )}

                {/* SEO */}

                {(viewArea.seoTitle ||
                  viewArea.seoDescription) && (
                  <div className="rounded-2xl border border-white/[0.07] bg-[#061A2B]/70 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#718895]">
                      SEO Preview
                    </p>

                    {viewArea.seoTitle && (
                      <p className="mt-3 text-sm font-bold text-[#F8FAFC]">
                        {viewArea.seoTitle}
                      </p>
                    )}

                    {viewArea.seoDescription && (
                      <p className="mt-1 text-xs leading-5 text-[#A8BBC8]">
                        {viewArea.seoDescription}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* MODAL ACTIONS */}

              <div className="mt-7 flex flex-col-reverse gap-2 border-t border-white/[0.08] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setViewArea(null)}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-white/[0.08] bg-[#061A2B] px-4 text-sm font-bold text-[#A8BBC8] transition hover:bg-[#08263D] hover:text-[#F8FAFC]"
                >
                  Close
                </button>

                <Link
                  href={`/admin/service-areas/${viewArea.id}/edit`}
                  onClick={() => setViewArea(null)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-5 text-sm font-bold text-[#061A2B] transition hover:bg-[#F5B800]"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Service Area
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          DELETE CONFIRMATION MODAL
      ========================================================= */}

      {deleteArea && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDeleteArea(null);
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-red-400/20 bg-[#08263D] shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
            {/* MODAL TOP */}

            <div className="border-b border-white/[0.08] px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-400">
                  <Trash2 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-black text-[#F8FAFC]">
                    Delete Service Area?
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[#A8BBC8]">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* MODAL CONTENT */}

            <div className="px-6 py-5">
              <div className="rounded-2xl border border-red-400/15 bg-red-500/5 p-4">
                <p className="text-sm text-[#A8BBC8]">
                  You are about to permanently delete:
                </p>

                <p className="mt-2 text-base font-black text-[#F8FAFC]">
                  {deleteArea.name}
                </p>

                <p className="mt-1 text-xs text-[#718895]">
                  /service-areas/{deleteArea.slug}
                </p>
              </div>

              <p className="mt-4 text-xs leading-5 text-[#718895]">
                The service area and its stored CMS data will be
                removed. Make sure you really want to continue.
              </p>
            </div>

            {/* MODAL ACTIONS */}

            <div className="flex flex-col-reverse gap-2 border-t border-white/[0.08] bg-[#061A2B]/40 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deletingId !== null}
                onClick={() => setDeleteArea(null)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-[#08263D] px-4 text-sm font-bold text-[#A8BBC8] transition hover:bg-[#0A2D47] hover:text-[#F8FAFC] disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>

              <button
                type="button"
                disabled={deletingId !== null}
                onClick={handleDelete}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-500 px-5 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />

                {deletingId !== null
                  ? "Deleting..."
                  : "Yes, Delete Area"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}