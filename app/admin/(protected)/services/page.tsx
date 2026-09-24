"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Plus,
  Search,
  Star,
  Trash2,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

interface ServiceMedia {
  publicId?: string;
  secureUrl?: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  resourceType?: "image";
  alt?: string;
}

interface ProcessStep {
  title: string;
  description: string;
}

interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description?: string;
  icon?: string;
  heroImage: ServiceMedia | null;
  gallery?: ServiceMedia[];
  benefits?: string[];
  included?: string[];
  processSteps?: ProcessStep[];
  suitableFor?: string[];
  estimatedTime?: string;
  emergencyService?: boolean;
  onSiteService?: boolean;
  ctaText?: string;
  ctaLink?: string;
  featured: boolean;
  displayOrder: number;
  status: "active" | "inactive";
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: ServiceMedia | null;
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

interface ServiceDetailResponse {
  success: boolean;
  data: ServiceItem;
  message?: string;
}

type ModalType = "view" | "delete" | null;

export default function ServicesAdminPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [featured, setFeatured] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const [modal, setModal] = useState<ModalType>(null);
  const [selectedService, setSelectedService] =
    useState<ServiceItem | null>(null);

  const [viewService, setViewService] =
    useState<ServiceItem | null>(null);

  const [isViewLoading, setIsViewLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      if (!isViewLoading && modal) {
        closeModal();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [modal, isViewLoading]);

  useEffect(() => {
    if (!modal) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [modal]);

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

  async function handleView(service: ServiceItem) {
    setSelectedService(service);
    setModal("view");
    setIsViewLoading(true);

    try {
      const response = await fetch(
        `/api/admin/services/${service.id}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result: ServiceDetailResponse =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load service details."
        );
      }

      setViewService(result.data);
    } catch (error) {
      console.error("View service error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load service details."
      );

      closeModal();
    } finally {
      setIsViewLoading(false);
    }
  }

  function openDeleteModal(service: ServiceItem) {
    setSelectedService(service);
    setModal("delete");
  }

  function closeModal() {
    if (isDeleting || isViewLoading) return;

    setModal(null);
    setSelectedService(null);
    setViewService(null);
  }

  async function handleDelete() {
    if (!selectedService) return;

    try {
      setIsDeleting(true);

      const response = await fetch(
        `/api/admin/services/${selectedService.id}`,
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

      toast.success(
        `"${selectedService.title}" deleted successfully.`
      );

      setModal(null);
      setSelectedService(null);
      setViewService(null);

      await loadServices();
    } catch (error) {
      console.error("Delete service error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete service."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#061A2B] text-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#FFD400]/20 bg-[#FFD400]/10 text-[#FFD400] shadow-[0_10px_30px_rgba(255,212,0,0.08)]">
              <Wrench className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFD400]">
                Service CMS
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight text-[#F8FAFC] sm:text-3xl">
                Services
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A8BBC8]">
                Manage your service pages, media,
                publishing status and customer-facing
                information.
              </p>
            </div>
          </div>

          <Link
            href="/admin/services/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-5 text-sm font-bold text-[#061A2B] shadow-[0_10px_30px_rgba(255,212,0,0.14)] transition hover:bg-[#F5B800]"
          >
            <Plus className="h-4 w-4" />
            Create Service
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
                placeholder="Search services..."
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#061A2B] pl-10 pr-4 text-sm text-[#F8FAFC] outline-none transition placeholder:text-[#718895] focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10"
              />
            </div>

            {/* STATUS */}
            <select
              value={status}
              onChange={(event) =>
                handleStatusChange(event.target.value)
              }
              className="h-11 rounded-xl border border-white/[0.08] bg-[#061A2B] px-3 text-sm font-medium text-[#F8FAFC] outline-none transition focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10"
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
              className="h-11 rounded-xl border border-white/[0.08] bg-[#061A2B] px-3 text-sm font-medium text-[#F8FAFC] outline-none transition focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10"
            >
              <option value="">All Services</option>
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
              ? "Loading services..."
              : `${total} service${
                  total === 1 ? "" : "s"
                }`}
          </p>

          <p className="text-xs text-[#718895]">
            Page {page} of {totalPages}
          </p>
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08263D]"
                >
                  <div className="aspect-[16/9] animate-pulse bg-[#061A2B]" />

                  <div className="space-y-3 p-5">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-[#061A2B]" />
                    <div className="h-4 w-full animate-pulse rounded bg-[#061A2B]" />
                    <div className="h-4 w-4/5 animate-pulse rounded bg-[#061A2B]" />
                  </div>
                </div>
              )
            )}
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#08263D] px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#061A2B] text-[#718895]">
              <Wrench className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-lg font-black text-[#F8FAFC]">
              No services found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#A8BBC8]">
              Try changing your search or filters, or
              create your first service.
            </p>

            <Link
              href="/admin/services/new"
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#FFD400] px-4 text-sm font-bold text-[#061A2B] transition hover:bg-[#F5B800]"
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
                className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08263D] shadow-[0_10px_35px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:border-white/[0.14] hover:shadow-[0_18px_45px_rgba(0,0,0,0.16)]"
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
                      className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
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
                          ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                          : "border border-white/[0.08] bg-[#061A2B]/90 text-[#A8BBC8]"
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

                  <div className="absolute bottom-3 right-3 rounded-lg border border-white/[0.08] bg-[#061A2B]/90 px-2.5 py-1.5 text-[10px] font-bold text-[#F8FAFC] backdrop-blur">
                    Order #{service.displayOrder}
                  </div>
                </div>

                {/* BODY */}
                <div className="p-5">
                  <div className="min-h-[96px]">
                    <h2 className="text-lg font-black tracking-tight text-[#F8FAFC]">
                      {service.title}
                    </h2>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#A8BBC8]">
                      {service.shortDescription ||
                        "No short description added."}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#718895]">
                        Slug
                      </p>

                      <p className="mt-0.5 max-w-[180px] truncate text-xs font-semibold text-[#A8BBC8]">
                        /services/{service.slug}
                      </p>
                    </div>

                    {service.onSiteService && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#0D6E91]/20 bg-[#0D6E91]/10 px-2.5 py-1.5 text-[10px] font-bold text-[#5EC8FF]">
                        <MapPin className="h-3 w-3" />
                        On-site
                      </span>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-4 grid grid-cols-3 gap-2">

                    {/* EDIT */}
                    <Link
                      href={`/admin/services/${service.id}/edit`}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#061A2B] text-xs font-bold text-[#A8BBC8] transition hover:border-[#0D6E91] hover:bg-[#0D6E91]/10 hover:text-[#F8FAFC]"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit
                    </Link>

                    {/* VIEW MODAL */}
                    <button
                      type="button"
                      onClick={() =>
                        handleView(service)
                      }
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#061A2B] text-xs font-bold text-[#A8BBC8] transition hover:border-[#FFD400]/40 hover:bg-[#FFD400]/10 hover:text-[#FFD400]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>

                    {/* DELETE MODAL */}
                    <button
                      type="button"
                      onClick={() =>
                        openDeleteModal(service)
                      }
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-red-400/20 bg-[#061A2B] text-xs font-bold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
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
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-[#061A2B] px-4 text-sm font-bold text-[#A8BBC8] transition hover:border-[#0D6E91] hover:text-[#FFD400] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
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
                  Math.min(totalPages, current + 1)
                )
              }
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-[#061A2B] px-4 text-sm font-bold text-[#A8BBC8] transition hover:border-[#0D6E91] hover:text-[#FFD400] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* =====================================================
          VIEW SERVICE MODAL
      ===================================================== */}
      {modal === "view" && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/[0.10] bg-[#08263D] shadow-[0_30px_100px_rgba(0,0,0,0.5)]">

            {/* MODAL HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/[0.08] px-5 py-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFD400]/10 text-[#FFD400]">
                  <Eye className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FFD400]">
                    Service Preview
                  </p>

                  <h2 className="truncate text-base font-bold text-[#F8FAFC] sm:text-lg">
                    {viewService?.title ||
                      selectedService?.title ||
                      "Service"}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isViewLoading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#061A2B] text-[#A8BBC8] transition hover:border-white/[0.16] hover:text-[#F8FAFC] disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
              {isViewLoading ? (
                <div className="flex min-h-[420px] items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#FFD400]" />

                    <p className="mt-3 text-sm font-semibold text-[#F8FAFC]">
                      Loading service details...
                    </p>

                    <p className="mt-1 text-xs text-[#718895]">
                      Please wait
                    </p>
                  </div>
                </div>
              ) : viewService ? (
                <div className="space-y-6">

                  {/* HERO */}
                  <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#061A2B]">
                    <div className="relative aspect-[21/8] min-h-[180px] overflow-hidden">
                      {viewService.heroImage?.secureUrl ? (
                        <img
                          src={
                            viewService.heroImage.secureUrl
                          }
                          alt={
                            viewService.heroImage.alt ||
                            viewService.title
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Wrench className="h-12 w-12 text-[#FFD400]" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#061A2B] via-transparent to-transparent" />

                      <div className="absolute bottom-4 left-5 right-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                              viewService.status === "active"
                                ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                : "border border-white/[0.08] bg-[#061A2B]/90 text-[#A8BBC8]"
                            }`}
                          >
                            {viewService.status}
                          </span>

                          {viewService.featured && (
                            <span className="rounded-full bg-[#FFD400] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#061A2B]">
                              Featured
                            </span>
                          )}
                        </div>

                        <h3 className="mt-2 text-2xl font-black tracking-tight text-[#F8FAFC]">
                          {viewService.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* BASIC INFO */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoBox
                      label="Slug"
                      value={`/services/${viewService.slug}`}
                    />

                    <InfoBox
                      label="Display Order"
                      value={`#${viewService.displayOrder}`}
                    />

                    <InfoBox
                      label="Estimated Time"
                      value={
                        viewService.estimatedTime
                          ? `${viewService.estimatedTime} minutes`
                          : "Not specified"
                      }
                    />

                    <InfoBox
                      label="On-site Service"
                      value={
                        viewService.onSiteService
                          ? "Available"
                          : "Not specified"
                      }
                    />
                  </div>

                  {/* DESCRIPTION */}
                  <DetailSection
                    icon={FileText}
                    title="Description"
                  >
                    <p className="whitespace-pre-line text-sm leading-7 text-[#A8BBC8]">
                      {viewService.description ||
                        viewService.shortDescription ||
                        "No description available."}
                    </p>
                  </DetailSection>

                  {/* BENEFITS */}
                  {viewService.benefits &&
                    viewService.benefits.length > 0 && (
                      <DetailSection
                        icon={CheckCircle2}
                        title="Benefits"
                      >
                        <div className="grid gap-2 sm:grid-cols-2">
                          {viewService.benefits.map(
                            (item, index) => (
                              <ListItem
                                key={`${item}-${index}`}
                                text={item}
                              />
                            )
                          )}
                        </div>
                      </DetailSection>
                    )}

                  {/* INCLUDED */}
                  {viewService.included &&
                    viewService.included.length > 0 && (
                      <DetailSection
                        icon={Zap}
                        title="What's Included"
                      >
                        <div className="grid gap-2 sm:grid-cols-2">
                          {viewService.included.map(
                            (item, index) => (
                              <ListItem
                                key={`${item}-${index}`}
                                text={item}
                              />
                            )
                          )}
                        </div>
                      </DetailSection>
                    )}

                  {/* SUITABLE FOR */}
                  {viewService.suitableFor &&
                    viewService.suitableFor.length > 0 && (
                      <DetailSection
                        icon={MapPin}
                        title="Suitable For"
                      >
                        <div className="flex flex-wrap gap-2">
                          {viewService.suitableFor.map(
                            (item, index) => (
                              <span
                                key={`${item}-${index}`}
                                className="rounded-lg border border-white/[0.08] bg-[#061A2B] px-3 py-2 text-xs font-semibold text-[#A8BBC8]"
                              >
                                {item}
                              </span>
                            )
                          )}
                        </div>
                      </DetailSection>
                    )}

                  {/* PROCESS */}
                  {viewService.processSteps &&
                    viewService.processSteps.length > 0 && (
                      <DetailSection
                        icon={Wrench}
                        title="Process"
                      >
                        <div className="space-y-3">
                          {viewService.processSteps.map(
                            (step, index) => (
                              <div
                                key={`${step.title}-${index}`}
                                className="flex gap-3 rounded-xl border border-white/[0.06] bg-[#061A2B] p-4"
                              >
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FFD400]/10 text-xs font-black text-[#FFD400]">
                                  {index + 1}
                                </div>

                                <div>
                                  <h4 className="text-sm font-bold text-[#F8FAFC]">
                                    {step.title}
                                  </h4>

                                  <p className="mt-1 text-xs leading-5 text-[#A8BBC8]">
                                    {step.description}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </DetailSection>
                    )}

                  {/* GALLERY */}
                  {viewService.gallery &&
                    viewService.gallery.length > 0 && (
                      <DetailSection
                        icon={ImageIcon}
                        title={`Gallery (${viewService.gallery.length})`}
                      >
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {viewService.gallery.map(
                            (image, index) => (
                              <div
                                key={
                                  image.publicId ||
                                  `${image.secureUrl}-${index}`
                                }
                                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/[0.08] bg-[#061A2B]"
                              >
                                {image.secureUrl ? (
                                  <img
                                    src={image.secureUrl}
                                    alt={
                                      image.alt ||
                                      viewService.title
                                    }
                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-[#718895]">
                                    <ImageIcon className="h-6 w-6" />
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </DetailSection>
                    )}

                  {/* CTA */}
                  {(viewService.ctaText ||
                    viewService.ctaLink) && (
                    <DetailSection
                      icon={ExternalLink}
                      title="Call To Action"
                    >
                      <div className="rounded-xl border border-white/[0.06] bg-[#061A2B] p-4">
                        <p className="text-sm font-semibold text-[#F8FAFC]">
                          {viewService.ctaText ||
                            "No CTA text"}
                        </p>

                        {viewService.ctaLink && (
                          <p className="mt-1 break-all text-xs text-[#A8BBC8]">
                            {viewService.ctaLink}
                          </p>
                        )}
                      </div>
                    </DetailSection>
                  )}
                </div>
              ) : null}
            </div>

            {/* MODAL FOOTER */}
            {!isViewLoading && viewService && (
              <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-white/[0.08] bg-[#061A2B]/60 p-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-10 rounded-xl border border-white/[0.08] px-4 text-sm font-bold text-[#A8BBC8] transition hover:border-white/[0.16] hover:text-[#F8FAFC]"
                >
                  Close
                </button>

                <Link
                  href={`/admin/services/${viewService.id}/edit`}
                  onClick={closeModal}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-4 text-sm font-bold text-[#061A2B] transition hover:bg-[#F5B800]"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Service
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}
      {modal === "delete" && selectedService && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-red-400/15 bg-[#08263D] shadow-[0_30px_100px_rgba(0,0,0,0.55)]">

            {/* HEADER */}
            <div className="flex items-start gap-4 border-b border-white/[0.08] p-5 sm:p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <Trash2 className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-black text-[#F8FAFC]">
                  Delete Service?
                </h2>

                <p className="mt-1 text-sm leading-6 text-[#A8BBC8]">
                  This action cannot be undone.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isDeleting}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#718895] transition hover:bg-[#061A2B] hover:text-[#F8FAFC] disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* BODY */}
            <div className="p-5 sm:p-6">
              <div className="rounded-2xl border border-red-400/10 bg-red-500/[0.05] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-400">
                  Service to delete
                </p>

                <p className="mt-2 text-base font-bold text-[#F8FAFC]">
                  {selectedService.title}
                </p>

                <p className="mt-1 text-xs text-[#A8BBC8]">
                  /services/{selectedService.slug}
                </p>
              </div>

              <p className="mt-4 text-sm leading-6 text-[#A8BBC8]">
                Deleting this service will permanently remove
                it from the service CMS.
              </p>
            </div>

            {/* FOOTER */}
            <div className="flex flex-col-reverse gap-2 border-t border-white/[0.08] bg-[#061A2B]/50 p-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                disabled={isDeleting}
                className="h-10 rounded-xl border border-white/[0.08] px-4 text-sm font-bold text-[#A8BBC8] transition hover:border-white/[0.16] hover:text-[#F8FAFC] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Service
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ============================================================
   SMALL MODAL COMPONENTS
============================================================ */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#061A2B] p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#718895]">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-[#F8FAFC]">
        {value}
      </p>
    </div>
  );
}

function DetailSection({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof FileText;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD400]/10 text-[#FFD400]">
          <Icon className="h-4 w-4" />
        </div>

        <h3 className="text-sm font-bold text-[#F8FAFC]">
          {title}
        </h3>
      </div>

      {children}
    </section>
  );
}

function ListItem({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-white/[0.06] bg-[#061A2B] p-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FFD400]" />

      <span className="text-xs leading-5 text-[#A8BBC8]">
        {text}
      </span>
    </div>
  );
}