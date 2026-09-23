"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Edit3,
  Eye,
  Filter,
  MessageCircleQuestion,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

/* =========================================================
   TYPES
========================================================= */

interface FAQRelation {
  id?: string;
  _id?: string;
  title?: string;
  name?: string;
  slug?: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;

  relatedServices: FAQRelation[];
  relatedServiceAreas: FAQRelation[];

  featured: boolean;
  displayOrder: number;
  status: "active" | "inactive";

  createdAt?: string;
  updatedAt?: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface FAQsResponse {
  success?: boolean;
  data?: FAQItem[];
  pagination?: PaginationData;
  message?: string;
}

interface DeleteState {
  id: string;
  question: string;
}

/* =========================================================
   HELPERS
========================================================= */

function relationId(item: FAQRelation): string {
  return String(item.id ?? item._id ?? "");
}

function relationLabel(item: FAQRelation): string {
  return (
    item.title ??
    item.name ??
    item.slug ??
    "Related item"
  );
}

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function truncate(value: string, length: number) {
  if (value.length <= length) return value;
  return `${value.slice(0, length).trim()}…`;
}

/* =========================================================
   PAGE
========================================================= */

export default function FAQsAdminPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [pagination, setPagination] =
    useState<PaginationData>({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | "active" | "inactive">("all");

  const [featuredFilter, setFeaturedFilter] =
    useState<"all" | "featured" | "standard">("all");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const [viewFAQ, setViewFAQ] =
    useState<FAQItem | null>(null);

  const [deleteFAQ, setDeleteFAQ] =
    useState<DeleteState | null>(null);

  /* =======================================================
     LOAD FAQS
  ======================================================= */

  const loadFAQs = useCallback(
    async (requestedPage = pagination.page) => {
      setIsLoading(true);

      try {
        const params = new URLSearchParams();

        params.set("page", String(requestedPage));
        params.set("limit", String(pagination.limit));

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (statusFilter !== "all") {
          params.set("status", statusFilter);
        }

        if (featuredFilter !== "all") {
          params.set(
            "featured",
            featuredFilter === "featured"
              ? "true"
              : "false"
          );
        }

        if (categoryFilter !== "all") {
          params.set(
            "category",
            categoryFilter
          );
        }

        const response = await fetch(
          `/api/admin/faqs?${params.toString()}`,
          {
            cache: "no-store",
          }
        );

        const result =
          (await response.json()) as FAQsResponse;

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Unable to load FAQs."
          );
        }

        setFaqs(
          Array.isArray(result.data)
            ? result.data
            : []
        );

        setPagination(
          result.pagination ?? {
            page: requestedPage,
            limit: pagination.limit,
            total: 0,
            totalPages: 1,
          }
        );
      } catch (error) {
        console.error(
          "FAQ listing error:",
          error
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load FAQs."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      pagination.limit,
      pagination.page,
      search,
      statusFilter,
      featuredFilter,
      categoryFilter,
    ]
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadFAQs(1);
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    search,
    statusFilter,
    featuredFilter,
    categoryFilter,
    loadFAQs,
  ]);

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {
    const values = faqs
      .map((faq) => faq.category?.trim())
      .filter(Boolean);

    return Array.from(
      new Set(values)
    ).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [faqs]);

  /* =======================================================
     DELETE
  ======================================================= */

  async function handleDelete() {
    if (!deleteFAQ || isDeleting) return;

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/admin/faqs/${deleteFAQ.id}`,
        {
          method: "DELETE",
        }
      );

      const result =
        (await response.json()) as {
          success?: boolean;
          message?: string;
        };

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Unable to delete FAQ."
        );
      }

      toast.success(
        "FAQ deleted successfully."
      );

      setDeleteFAQ(null);

      const shouldGoPreviousPage =
        faqs.length === 1 &&
        pagination.page > 1;

      await loadFAQs(
        shouldGoPreviousPage
          ? pagination.page - 1
          : pagination.page
      );
    } catch (error) {
      console.error(
        "FAQ delete error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete FAQ."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  /* =======================================================
     PAGE NAVIGATION
  ======================================================= */

  function goToPage(page: number) {
    if (
      page < 1 ||
      page > pagination.totalPages ||
      page === pagination.page
    ) {
      return;
    }

    loadFAQs(page);
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#061A2B]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="relative mb-6 overflow-hidden rounded-3xl border border-[#0D6E91]/30 bg-[#08263D] shadow-[0_20px_60px_rgba(0,0,0,0.22)]">

          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#0D6E91]/15 blur-3xl" />

          <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-[#FFD400]/5 blur-3xl" />

          <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:p-8">

            <div className="flex min-w-0 gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#061A2B] ring-1 ring-white/5">
                <MessageCircleQuestion className="h-6 w-6 text-[#FFD400]" />
              </div>

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2">

                  <span className="text-xs font-black uppercase tracking-[0.2em] text-[#FFD400]">
                    Content CMS
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0D6E91]/30 bg-[#0D6E91]/10 px-2.5 py-1 text-[10px] font-bold text-[#6FB9FF]">
                    <Zap className="h-3 w-3" />
                    FAQ Management
                  </span>

                </div>

                <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                  Frequently Asked Questions
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A8BBC8]">
                  Manage customer questions,
                  answers, categories, relationships
                  and publishing visibility from one
                  place.
                </p>

              </div>
            </div>

            <Link
              href="/admin/faqs/new"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-4 py-3 text-sm font-black text-[#061A2B] shadow-[0_10px_30px_rgba(255,212,0,0.14)] transition hover:bg-[#FFE04D] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Create FAQ
            </Link>

          </div>
        </section>

        {/* =================================================
            TOOLBAR
        ================================================= */}

        <section className="mb-6 rounded-3xl border border-white/[0.08] bg-[#08263D] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.16)] sm:p-5">

          <div className="flex flex-col gap-3 xl:flex-row">

            {/* SEARCH */}

            <div className="relative min-w-0 flex-1">

              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718895]" />

              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(
                    event.target.value
                  );
                }}
                placeholder="Search questions or categories..."
                className="h-11 w-full rounded-xl border border-white/[0.10] bg-[#061A2B] pl-10 pr-4 text-sm font-medium text-white outline-none transition placeholder:text-[#718895] focus:border-[#0D6E91] focus:ring-2 focus:ring-[#0D6E91]/20"
              />

            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:flex">

              {/* STATUS */}

              <div className="relative">

                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718895]" />

                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(
                      event.target.value as
                        | "all"
                        | "active"
                        | "inactive"
                    );
                  }}
                  className="h-11 w-full min-w-[150px] appearance-none rounded-xl border border-white/[0.10] bg-[#061A2B] pl-9 pr-8 text-sm font-bold text-white outline-none transition focus:border-[#0D6E91] focus:ring-2 focus:ring-[#0D6E91]/20"
                >
                  <option
                    className="bg-[#08263D] text-white"
                    value="all"
                  >
                    All Status
                  </option>

                  <option
                    className="bg-[#08263D] text-white"
                    value="active"
                  >
                    Active
                  </option>

                  <option
                    className="bg-[#08263D] text-white"
                    value="inactive"
                  >
                    Inactive
                  </option>
                </select>

              </div>

              {/* FEATURED */}

              <select
                value={featuredFilter}
                onChange={(event) => {
                  setFeaturedFilter(
                    event.target.value as
                      | "all"
                      | "featured"
                      | "standard"
                  );
                }}
                className="h-11 min-w-[150px] rounded-xl border border-white/[0.10] bg-[#061A2B] px-3 text-sm font-bold text-white outline-none transition focus:border-[#0D6E91] focus:ring-2 focus:ring-[#0D6E91]/20"
              >
                <option
                  className="bg-[#08263D] text-white"
                  value="all"
                >
                  All FAQs
                </option>

                <option
                  className="bg-[#08263D] text-white"
                  value="featured"
                >
                  Featured
                </option>

                <option
                  className="bg-[#08263D] text-white"
                  value="standard"
                >
                  Standard
                </option>
              </select>

              {/* CATEGORY */}

              <select
                value={categoryFilter}
                onChange={(event) => {
                  setCategoryFilter(
                    event.target.value
                  );
                }}
                className="h-11 min-w-[170px] rounded-xl border border-white/[0.10] bg-[#061A2B] px-3 text-sm font-bold text-white outline-none transition focus:border-[#0D6E91] focus:ring-2 focus:ring-[#0D6E91]/20"
              >
                <option
                  className="bg-[#08263D] text-white"
                  value="all"
                >
                  All Categories
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category}
                      className="bg-[#08263D] text-white"
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}
              </select>

            </div>

          </div>
        </section>

        {/* =================================================
            CONTENT
        ================================================= */}

        {isLoading ? (
          <LoadingState />
        ) : faqs.length === 0 ? (
          <EmptyState
            hasFilters={
              Boolean(search.trim()) ||
              statusFilter !== "all" ||
              featuredFilter !== "all" ||
              categoryFilter !== "all"
            }
            onClear={() => {
              setSearch("");
              setStatusFilter("all");
              setFeaturedFilter("all");
              setCategoryFilter("all");
            }}
          />
        ) : (
          <>

            {/* DESKTOP / TABLET CARDS */}

            <section className="grid gap-4 lg:grid-cols-2">

              {faqs.map((faq) => (
                <FAQCard
                  key={faq.id}
                  faq={faq}
                  onView={() =>
                    setViewFAQ(faq)
                  }
                  onDelete={() =>
                    setDeleteFAQ({
                      id: faq.id,
                      question:
                        faq.question,
                    })
                  }
                />
              ))}

            </section>

            {/* PAGINATION */}

            <Pagination
              pagination={pagination}
              onPrevious={() =>
                goToPage(
                  pagination.page - 1
                )
              }
              onNext={() =>
                goToPage(
                  pagination.page + 1
                )
              }
            />

          </>
        )}
      </div>

      {/* =====================================================
          VIEW MODAL
      ===================================================== */}

      {viewFAQ && (
        <FAQViewModal
          faq={viewFAQ}
          onClose={() =>
            setViewFAQ(null)
          }
          onEdit={() => {
            window.location.href =
              `/admin/faqs/${viewFAQ.id}/edit`;
          }}
        />
      )}

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {deleteFAQ && (
        <DeleteModal
          question={deleteFAQ.question}
          isDeleting={isDeleting}
          onCancel={() =>
            !isDeleting &&
            setDeleteFAQ(null)
          }
          onConfirm={handleDelete}
        />
      )}
    </main>
  );
}

/* =========================================================
   FAQ CARD
========================================================= */

function FAQCard({
  faq,
  onView,
  onDelete,
}: {
  faq: FAQItem;
  onView: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-white/[0.08] bg-[#08263D] shadow-[0_16px_50px_rgba(0,0,0,0.14)] transition duration-300 hover:-translate-y-0.5 hover:border-[#0D6E91]/40 hover:shadow-[0_22px_60px_rgba(0,0,0,0.2)]">

      {/* TOP ACCENT */}

      <div className="h-1 bg-gradient-to-r from-[#0D6E91] via-[#0D6E91] to-[#FFD400]" />

      <div className="p-5 sm:p-6">

        {/* META */}

        <div className="flex flex-wrap items-center justify-between gap-3">

          <div className="flex flex-wrap items-center gap-2">

            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0D6E91]/25 bg-[#0D6E91]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#6FB9FF]">
              <CircleHelp className="h-3 w-3" />
              {faq.category}
            </span>

            <StatusBadge status={faq.status} />

            {faq.featured && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFD400]/25 bg-[#FFD400]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#FFD400]">
                <Star className="h-3 w-3 fill-current" />
                Featured
              </span>
            )}

          </div>

          <span className="text-xs font-bold text-[#718895]">
            #{faq.displayOrder}
          </span>

        </div>

        {/* QUESTION */}

        <h2 className="mt-5 text-lg font-black leading-7 text-white sm:text-xl">
          {faq.question}
        </h2>

        {/* ANSWER */}

        <p className="mt-3 text-sm leading-6 text-[#A8BBC8]">
          {truncate(
            faq.answer,
            190
          )}
        </p>

        {/* RELATIONS */}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">

          <RelationCount
            label="Services"
            count={
              faq.relatedServices
                ?.length ?? 0
            }
          />

          <RelationCount
            label="Service Areas"
            count={
              faq.relatedServiceAreas
                ?.length ?? 0
            }
          />

        </div>

        {/* FOOTER */}

        <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.07] pt-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="text-xs font-medium text-[#718895]">
            Updated{" "}
            <span className="text-[#A8BBC8]">
              {formatDate(
                faq.updatedAt ??
                  faq.createdAt
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={onView}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.10] bg-[#061A2B] px-3 py-2 text-xs font-black text-[#F8FAFC] transition hover:border-[#0D6E91]/50 hover:bg-[#0A2D47]"
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </button>

            <Link
              href={`/admin/faqs/${faq.id}/edit`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#0D6E91]/30 bg-[#0D6E91]/10 px-3 py-2 text-xs font-black text-[#6FB9FF] transition hover:border-[#0D6E91]/60 hover:bg-[#0D6E91]/20"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </Link>

            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-black text-red-400 transition hover:border-red-500/40 hover:bg-red-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>

          </div>

        </div>

      </div>
    </article>
  );
}

/* =========================================================
   STATUS
========================================================= */

function StatusBadge({
  status,
}: {
  status: FAQItem["status"];
}) {
  const active = status === "active";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em]",
        active
          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
          : "border-white/10 bg-white/5 text-[#A8BBC8]",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          active
            ? "bg-emerald-400"
            : "bg-[#718895]",
        ].join(" ")}
      />

      {active ? "Active" : "Inactive"}
    </span>
  );
}

/* =========================================================
   RELATION COUNT
========================================================= */

function RelationCount({
  label,
  count,
}: {
  label: string;
  count: number;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#061A2B]/70 px-3 py-2.5">

      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#718895]">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-white">
        {count}{" "}
        <span className="font-medium text-[#718895]">
          linked
        </span>
      </p>

    </div>
  );
}

/* =========================================================
   VIEW MODAL
========================================================= */

function FAQViewModal({
  faq,
  onClose,
  onEdit,
}: {
  faq: FAQItem;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <ModalShell
      onClose={onClose}
      ariaLabel="View FAQ"
    >

      <div className="overflow-hidden rounded-3xl border border-[#0D6E91]/30 bg-[#08263D] shadow-[0_30px_100px_rgba(0,0,0,0.5)]">

        {/* HEADER */}

        <div className="relative border-b border-white/[0.08] p-5 sm:p-6">

          <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-[#0D6E91]/10 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">

            <div className="flex min-w-0 gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#061A2B]">
                <CircleHelp className="h-5 w-5 text-[#FFD400]" />
              </div>

              <div className="min-w-0">

                <div className="flex flex-wrap gap-2">
                  <StatusBadge
                    status={faq.status}
                  />

                  {faq.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#FFD400]/20 bg-[#FFD400]/10 px-2.5 py-1 text-[10px] font-black uppercase text-[#FFD400]">
                      <Star className="h-3 w-3 fill-current" />
                      Featured
                    </span>
                  )}
                </div>

                <h2 className="mt-3 text-xl font-black leading-7 text-white sm:text-2xl">
                  FAQ Details
                </h2>

              </div>

            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.10] bg-[#061A2B] text-[#A8BBC8] transition hover:border-white/[0.20] hover:text-white"
              aria-label="Close FAQ details"
            >
              <X className="h-4 w-4" />
            </button>

          </div>

        </div>

        {/* CONTENT */}

        <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-6">

          <div className="rounded-2xl border border-[#0D6E91]/20 bg-[#061A2B] p-4 sm:p-5">

            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#FFD400]">
              Question
            </p>

            <h3 className="mt-2 text-lg font-black leading-7 text-white">
              {faq.question}
            </h3>

          </div>

          <div className="mt-4 rounded-2xl border border-white/[0.08] bg-[#061A2B] p-4 sm:p-5">

            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6FB9FF]">
              Answer
            </p>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#A8BBC8]">
              {faq.answer}
            </p>

          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">

            <DetailBox
              label="Category"
              value={faq.category}
            />

            <DetailBox
              label="Display Order"
              value={String(
                faq.displayOrder
              )}
            />

          </div>

          {/* RELATED SERVICES */}

          <RelationSection
            title="Related Services"
            items={
              faq.relatedServices ?? []
            }
          />

          {/* RELATED AREAS */}

          <RelationSection
            title="Related Service Areas"
            items={
              faq.relatedServiceAreas ?? []
            }
          />

          {/* DATES */}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">

            <DetailBox
              label="Created"
              value={formatDate(
                faq.createdAt
              )}
            />

            <DetailBox
              label="Last Updated"
              value={formatDate(
                faq.updatedAt
              )}
            />

          </div>

        </div>

        {/* FOOTER */}

        <div className="flex flex-col gap-3 border-t border-white/[0.08] bg-[#061A2B]/70 p-4 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/[0.10] bg-[#08263D] px-4 py-3 text-sm font-black text-[#A8BBC8] transition hover:border-white/[0.18] hover:text-white"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-4 py-3 text-sm font-black text-[#061A2B] transition hover:bg-[#FFE04D]"
          >
            <Edit3 className="h-4 w-4" />
            Edit FAQ
          </button>

        </div>

      </div>

    </ModalShell>
  );
}

/* =========================================================
   DETAIL BOX
========================================================= */

function DetailBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#061A2B] p-4">

      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#718895]">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-bold text-white">
        {value || "—"}
      </p>

    </div>
  );
}

/* =========================================================
   RELATION SECTION
========================================================= */

function RelationSection({
  title,
  items,
}: {
  title: string;
  items: FAQRelation[];
}) {
  return (
    <div className="mt-4 rounded-2xl border border-white/[0.08] bg-[#061A2B] p-4">

      <div className="flex items-center justify-between gap-3">

        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#718895]">
          {title}
        </p>

        <span className="rounded-full border border-[#0D6E91]/20 bg-[#0D6E91]/10 px-2 py-1 text-[10px] font-black text-[#6FB9FF]">
          {items.length}
        </span>

      </div>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-[#718895]">
          No related items.
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">

          {items.map((item, index) => {
            const id =
              relationId(item);

            return (
              <span
                key={`${id}-${index}`}
                className="rounded-xl border border-white/[0.08] bg-[#08263D] px-3 py-2 text-xs font-bold text-[#A8BBC8]"
              >
                {relationLabel(item)}
              </span>
            );
          })}

        </div>
      )}

    </div>
  );
}

/* =========================================================
   DELETE MODAL
========================================================= */

function DeleteModal({
  question,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  question: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <ModalShell
      onClose={onCancel}
      ariaLabel="Delete FAQ confirmation"
    >

      <div className="overflow-hidden rounded-3xl border border-red-500/20 bg-[#08263D] shadow-[0_30px_100px_rgba(0,0,0,0.5)]">

        <div className="p-6 sm:p-7">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
            <AlertTriangle className="h-7 w-7 text-red-400" />
          </div>

          <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-red-400">
            Destructive Action
          </p>

          <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">
            Delete this FAQ?
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#A8BBC8]">
            This action will permanently remove
            this FAQ from the CMS. Make sure you
            really want to delete it before
            continuing.
          </p>

          <div className="mt-5 rounded-2xl border border-red-500/15 bg-red-500/5 p-4">

            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-red-400">
              FAQ to delete
            </p>

            <p className="mt-2 text-sm font-bold leading-6 text-white">
              {question}
            </p>

          </div>

        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] bg-[#061A2B]/70 p-4 sm:flex-row sm:justify-end">

          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="rounded-xl border border-white/[0.10] bg-[#08263D] px-4 py-3 text-sm font-black text-[#A8BBC8] transition hover:border-white/[0.18] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Keep FAQ
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-black text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete FAQ
              </>
            )}
          </button>

        </div>

      </div>

    </ModalShell>
  );
}

/* =========================================================
   MODAL SHELL
========================================================= */

function ModalShell({
  children,
  onClose,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClose: () => void;
  ariaLabel: string;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020B14]/80 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-2xl">
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   LOADING
========================================================= */

function LoadingState() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">

      {Array.from({
        length: 6,
      }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#08263D]"
        >
          <div className="h-1 animate-pulse bg-[#0D6E91]/40" />

          <div className="space-y-4 p-6">

            <div className="h-5 w-28 animate-pulse rounded-lg bg-[#061A2B]" />

            <div className="h-6 w-4/5 animate-pulse rounded-lg bg-[#061A2B]" />

            <div className="h-12 w-full animate-pulse rounded-xl bg-[#061A2B]" />

            <div className="grid grid-cols-2 gap-3">
              <div className="h-14 animate-pulse rounded-xl bg-[#061A2B]" />
              <div className="h-14 animate-pulse rounded-xl bg-[#061A2B]" />
            </div>

          </div>
        </div>
      ))}

    </section>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <section className="rounded-3xl border border-white/[0.08] bg-[#08263D] p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.16)] sm:p-12">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#061A2B]">
        <CircleHelp className="h-7 w-7 text-[#FFD400]" />
      </div>

      <h2 className="mt-5 text-xl font-black text-white">
        {hasFilters
          ? "No FAQs match your filters"
          : "No FAQs yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#A8BBC8]">
        {hasFilters
          ? "Try changing the search or filters to find another FAQ."
          : "Create your first FAQ to start building the customer help content."}
      </p>

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-xl border border-white/[0.10] bg-[#061A2B] px-4 py-3 text-sm font-black text-[#A8BBC8] transition hover:text-white"
          >
            Clear Filters
          </button>
        )}

        {!hasFilters && (
          <Link
            href="/admin/faqs/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-4 py-3 text-sm font-black text-[#061A2B] transition hover:bg-[#FFE04D]"
          >
            <Plus className="h-4 w-4" />
            Create FAQ
          </Link>
        )}

      </div>

    </section>
  );
}

/* =========================================================
   PAGINATION
========================================================= */

function Pagination({
  pagination,
  onPrevious,
  onNext,
}: {
  pagination: PaginationData;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#08263D] p-4 sm:flex-row sm:items-center sm:justify-between">

      <div className="text-xs font-medium text-[#718895]">
        Showing{" "}
        <span className="font-black text-[#A8BBC8]">
          {pagination.total === 0
            ? 0
            : (pagination.page - 1) *
                pagination.limit +
              1}
        </span>
        {" "}–{" "}
        <span className="font-black text-[#A8BBC8]">
          {Math.min(
            pagination.page *
              pagination.limit,
            pagination.total
          )}
        </span>
        {" "}of{" "}
        <span className="font-black text-[#A8BBC8]">
          {pagination.total}
        </span>
      </div>

      <div className="flex items-center gap-2">

        <button
          type="button"
          disabled={pagination.page <= 1}
          onClick={onPrevious}
          className="inline-flex h-10 items-center gap-1 rounded-xl border border-white/[0.10] bg-[#061A2B] px-3 text-xs font-black text-[#A8BBC8] transition hover:border-[#0D6E91]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <span className="flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#0D6E91]/25 bg-[#0D6E91]/10 px-3 text-xs font-black text-[#6FB9FF]">
          {pagination.page}
        </span>

        <button
          type="button"
          disabled={
            pagination.page >=
            pagination.totalPages
          }
          onClick={onNext}
          className="inline-flex h-10 items-center gap-1 rounded-xl border border-white/[0.10] bg-[#061A2B] px-3 text-xs font-black text-[#A8BBC8] transition hover:border-[#0D6E91]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>

      </div>

    </div>
  );
}