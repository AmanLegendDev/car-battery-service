"use client";

import {
  Edit3,
  ExternalLink,
  Plus,
  Search,
  Trash2,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  heroImage: {
    secureUrl: string;
    alt: string;
  } | null;
  featured: boolean;
  displayOrder: number;
  status: "active" | "inactive";
  createdAt: string | null;
  updatedAt: string | null;
}

interface ServicesResponse {
  success: boolean;
  data: ServiceItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<ServiceItem[]>(
    []
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [featured, setFeatured] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );

  const loadServices = useCallback(async () => {
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
        `/api/admin/services?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result: ServicesResponse =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load services."
        );
      }

      setServices(result.data);
      setTotal(result.pagination.total);
      setTotalPages(
        Math.max(1, result.pagination.totalPages)
      );
    } catch (error) {
      console.error("Load services error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load services."
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, search, status, featured]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

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

  async function handleDelete(service: ServiceItem) {
    const confirmed = window.confirm(
      `Delete "${service.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(service.id);

      const response = await fetch(
        `/api/admin/services/${service.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to delete service."
        );
      }

      toast.success("Service deleted successfully.");

      await loadServices();
    } catch (error) {
      console.error("Delete service error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete service."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#061A2B] text-[#FFD400] shadow-sm">
              <Wrench className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0D6E91]">
                Service CMS
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Services
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage your service pages, media,
                publishing status and customer-facing
                information.
              </p>
            </div>
          </div>

          <Link
            href="/admin/services/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#061A2B] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#08263D]"
          >
            <Plus className="h-4 w-4" />
            Create Service
          </Link>
        </div>

        {/* FILTERS */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
            {/* SEARCH */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  handleSearchChange(event.target.value)
                }
                placeholder="Search services..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10"
              />
            </div>

            {/* STATUS */}
            <select
              value={status}
              onChange={(event) =>
                handleStatusChange(event.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* FEATURED */}
            <select
              value={featured}
              onChange={(event) =>
                handleFeaturedChange(event.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10"
            >
              <option value="">All Services</option>
              <option value="true">Featured</option>
              <option value="false">Not Featured</option>
            </select>
          </div>
        </section>

        {/* SUMMARY */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">
            {isLoading
              ? "Loading services..."
              : `${total} service${
                  total === 1 ? "" : "s"
                }`}
          </p>

          <p className="text-xs text-slate-400">
            Page {page} of {totalPages}
          </p>
        </div>

        {/* CONTENT */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="aspect-[16/9] animate-pulse bg-slate-100" />

                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Wrench className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-lg font-black text-slate-900">
              No services found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try changing your search or filters, or
              create your first service.
            </p>

            <Link
              href="/admin/services/new"
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#061A2B] px-4 text-sm font-bold text-white transition hover:bg-[#08263D]"
            >
              <Plus className="h-4 w-4" />
              Create Service
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* IMAGE */}
                <div className="relative aspect-[16/9] overflow-hidden bg-[#061A2B]">
                  {service.heroImage?.secureUrl ? (
                    <img
                      src={service.heroImage.secureUrl}
                      alt={
                        service.heroImage.alt ||
                        service.title
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Wrench className="h-10 w-10 text-[#FFD400]" />
                    </div>
                  )}

                  <div className="absolute left-3 top-3 flex gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        service.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {service.status}
                    </span>

                    {service.featured && (
                      <span className="rounded-full bg-[#FFD400] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#061A2B]">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 rounded-lg bg-[#061A2B]/90 px-2.5 py-1.5 text-[10px] font-bold text-white backdrop-blur">
                    Order #{service.displayOrder}
                  </div>
                </div>

                {/* BODY */}
                <div className="p-5">
                  <div className="min-h-[96px]">
                    <h2 className="text-lg font-black tracking-tight text-slate-950">
                      {service.title}
                    </h2>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                      {service.shortDescription ||
                        "No short description added."}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Slug
                      </p>

                      <p className="mt-0.5 max-w-[180px] truncate text-xs font-semibold text-slate-600">
                        /services/{service.slug}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Link
                      href={`/admin/services/${service.id}/edit`}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 transition hover:border-[#0D6E91] hover:text-[#0D6E91]"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit
                    </Link>

                    <a
                      href={`/services/${service.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 transition hover:border-[#0D6E91] hover:text-[#0D6E91]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View
                    </a>

                    <button
                      type="button"
                      disabled={deletingId === service.id}
                      onClick={() =>
                        handleDelete(service)
                      }
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-red-100 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {deletingId === service.id
                        ? "..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                setPage((current) =>
                  Math.max(1, current - 1)
                )
              }
              className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-[#0D6E91] hover:text-[#0D6E91] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-xs font-semibold text-slate-500">
              {page} / {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((current) =>
                  Math.min(totalPages, current + 1)
                )
              }
              className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-[#0D6E91] hover:text-[#0D6E91] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}