"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  Filter,
  MessageSquareQuote,
  Plus,
  Search,
  Star,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface TestimonialPhoto {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: "image";
  alt: string;
}

interface Review {
  id: string;
  name: string;
  businessName?: string;
  role?: string;
  photo?: TestimonialPhoto;
  testimonial: string;
  rating?: number;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ReviewsResponse {
  success: boolean;
  data: Review[];
  pagination: Pagination;
  message?: string;
}

type ViewReview = Review | null;

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return "?";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatDate(value: string) {
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

function RatingStars({
  rating,
  compact = false,
}: {
  rating?: number;
  compact?: boolean;
}) {
  if (!rating) {
    return (
      <span className="text-xs font-medium text-[#718895]">
        No rating
      </span>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < rating;

        return (
          <Star
            key={index}
            aria-hidden="true"
            className={
              compact
                ? `h-3.5 w-3.5 ${
                    filled
                      ? "fill-[#FFD400] text-[#FFD400]"
                      : "text-[#385267]"
                  }`
                : `h-4 w-4 ${
                    filled
                      ? "fill-[#FFD400] text-[#FFD400]"
                      : "text-[#385267]"
                  }`
            }
          />
        );
      })}

      <span className="ml-1 text-xs font-semibold text-[#A8BBC8]">
        {rating}/5
      </span>
    </div>
  );
}

function StatusBadge({
  published,
}: {
  published: boolean;
}) {
  return published ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-300">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
      Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-300">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
      Unpublished
    </span>
  );
}

function FeaturedBadge({
  featured,
}: {
  featured: boolean;
}) {
  if (!featured) return null;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFD400]/20 bg-[#FFD400]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#FFD400]">
      <Star
        aria-hidden="true"
        className="h-3 w-3 fill-current"
      />
      Featured
    </span>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] =
    useState<Pagination>({
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 1,
    });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [featured, setFeatured] = useState("");

  const [loading, setLoading] = useState(true);

  const [viewReview, setViewReview] =
    useState<ViewReview>(null);

  const [deleteReview, setDeleteReview] =
    useState<Review | null>(null);

  const [deleting, setDeleting] = useState(false);

  const [showFilters, setShowFilters] =
    useState(false);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("page", String(pagination.page));
    params.set("limit", String(pagination.limit));

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (status) {
      params.set("published", status);
    }

    if (featured) {
      params.set("featured", featured);
    }

    return params.toString();
  }, [
    pagination.page,
    pagination.limit,
    search,
    status,
    featured,
  ]);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/testimonials?${queryString}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result =
        (await response.json()) as ReviewsResponse;

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to load reviews."
        );
      }

      setReviews(result.data ?? []);

      setPagination(
        result.pagination ?? {
          page: 1,
          limit: 12,
          total: result.data?.length ?? 0,
          totalPages: 1,
        }
      );
    } catch (error) {
      console.error(
        "Fetch reviews error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load reviews."
      );
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews]);

  function resetFilters() {
    setSearch("");
    setStatus("");
    setFeatured("");

    setPagination((current) => ({
      ...current,
      page: 1,
    }));
  }

  function handleSearchChange(
    value: string
  ) {
    setSearch(value);

    setPagination((current) => ({
      ...current,
      page: 1,
    }));
  }

  async function confirmDelete() {
    if (!deleteReview) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/admin/testimonials/${deleteReview.id}`,
        {
          method: "DELETE",
        }
      );

      const result =
        (await response.json()) as {
          success?: boolean;
          message?: string;
        };

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to delete review."
        );
      }

      toast.success(
        "Review deleted successfully."
      );

      setDeleteReview(null);

      await fetchReviews();
    } catch (error) {
      console.error(
        "Delete review error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete review."
      );
    } finally {
      setDeleting(false);
    }
  }

  const hasFilters =
    Boolean(search || status || featured);

  return (
    <main className="min-h-screen bg-[#061A2B] text-[#F8FAFC]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">

        {/* HEADER */}
        <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFD400] text-[#061A2B] shadow-lg shadow-[#FFD400]/10">
                <MessageSquareQuote
                  size={20}
                />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFD400]">
                  Customer Feedback
                </p>

                <h1 className="text-2xl font-bold tracking-tight text-[#F8FAFC] sm:text-3xl">
                  Reviews
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-[#A8BBC8]">
              Manage genuine customer reviews,
              ratings, visibility and featured
              placement from one place.
            </p>
          </div>

          <Link
            href="/admin/reviews/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-5 text-sm font-bold text-[#061A2B] shadow-lg shadow-[#FFD400]/10 transition hover:bg-[#F5B800] focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:ring-offset-2 focus:ring-offset-[#061A2B]"
          >
            <Plus
              aria-hidden="true"
              size={17}
            />
            Add Review
          </Link>
        </div>

        {/* SUMMARY */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/[0.07] bg-[#08263D] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#718895]">
                  Total Reviews
                </p>
                <p className="mt-2 text-2xl font-bold text-[#F8FAFC]">
                  {loading
                    ? "—"
                    : pagination.total}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D6E91]/15 text-[#57C7EE]">
                <MessageSquareQuote
                  size={18}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#08263D] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#718895]">
                  Visible
                </p>
                <p className="mt-2 text-2xl font-bold text-emerald-300">
                  {loading
                    ? "—"
                    : reviews.filter(
                        (review) =>
                          review.published
                      ).length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                <Check size={18} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#08263D] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#718895]">
                  Featured
                </p>
                <p className="mt-2 text-2xl font-bold text-[#FFD400]">
                  {loading
                    ? "—"
                    : reviews.filter(
                        (review) =>
                          review.featured
                      ).length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD400]/10 text-[#FFD400]">
                <Star
                  size={18}
                  className="fill-current"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#08263D] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#718895]">
                  With Rating
                </p>
                <p className="mt-2 text-2xl font-bold text-[#57C7EE]">
                  {loading
                    ? "—"
                    : reviews.filter(
                        (review) =>
                          typeof review.rating ===
                          "number"
                      ).length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D6E91]/15 text-[#57C7EE]">
                <Star size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* FILTER BAR */}
        <section className="mb-6 rounded-2xl border border-white/[0.07] bg-[#08263D] p-3 sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

            <div className="relative min-w-0 flex-1">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718895]"
              />

              <input
                value={search}
                onChange={(event) =>
                  handleSearchChange(
                    event.target.value
                  )
                }
                placeholder="Search by customer, business or review..."
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#061A2B] pl-10 pr-4 text-sm text-[#F8FAFC] outline-none transition placeholder:text-[#607887] focus:border-[#0D6E91] focus:ring-2 focus:ring-[#0D6E91]/20"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (current) => !current
                )
              }
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${
                showFilters || hasFilters
                  ? "border-[#0D6E91] bg-[#0D6E91]/15 text-[#57C7EE]"
                  : "border-white/[0.08] bg-[#061A2B] text-[#A8BBC8] hover:border-white/[0.16] hover:text-[#F8FAFC]"
              }`}
            >
              <Filter size={16} />
              Filters
              {hasFilters && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FFD400] px-1 text-[10px] font-bold text-[#061A2B]">
                  !
                </span>
              )}
            </button>

            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-[#061A2B] px-4 text-sm font-semibold text-[#A8BBC8] transition hover:border-red-400/30 hover:text-red-300"
              >
                <X size={15} />
                Clear
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-3 grid gap-3 border-t border-white/[0.07] pt-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#718895]">
                  Visibility
                </label>

                <select
                  value={status}
                  onChange={(event) => {
                    setStatus(
                      event.target.value
                    );
                    setPagination(
                      (current) => ({
                        ...current,
                        page: 1,
                      })
                    );
                  }}
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#061A2B] px-3 text-sm text-[#F8FAFC] outline-none focus:border-[#0D6E91]"
                >
                  <option value="">
                    All reviews
                  </option>
                  <option value="true">
                    Published
                  </option>
                  <option value="false">
                    Unpublished
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#718895]">
                  Featured
                </label>

                <select
                  value={featured}
                  onChange={(event) => {
                    setFeatured(
                      event.target.value
                    );
                    setPagination(
                      (current) => ({
                        ...current,
                        page: 1,
                      })
                    );
                  }}
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#061A2B] px-3 text-sm text-[#F8FAFC] outline-none focus:border-[#0D6E91]"
                >
                  <option value="">
                    All reviews
                  </option>
                  <option value="true">
                    Featured
                  </option>
                  <option value="false">
                    Not featured
                  </option>
                </select>
              </div>
            </div>
          )}
        </section>

        {/* LIST */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-[300px] animate-pulse rounded-2xl border border-white/[0.06] bg-[#08263D]"
                />
              )
            )}
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#08263D] px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0D6E91]/10 text-[#57C7EE]">
              <MessageSquareQuote size={24} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-[#F8FAFC]">
              No reviews found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718895]">
              {hasFilters
                ? "No reviews match your current search or filters."
                : "No customer reviews have been added yet."}
            </p>

            {hasFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-[#061A2B] px-4 text-sm font-semibold text-[#A8BBC8] hover:text-[#F8FAFC]"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                href="/admin/reviews/new"
                className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-4 text-sm font-bold text-[#061A2B]"
              >
                <Plus size={16} />
                Add First Review
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-[#08263D] transition hover:border-white/[0.13] hover:shadow-2xl hover:shadow-black/10"
                >
                  {/* TOP */}
                  <div className="border-b border-white/[0.07] p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-center gap-3">
                        {review.photo?.secureUrl ? (
                          <img
                            src={review.photo.secureUrl}
                            alt={
                              review.photo.alt ||
                              `${review.name} testimonial photo`
                            }
                            className="h-12 w-12 shrink-0 rounded-2xl object-cover ring-1 ring-white/[0.1]"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0D6E91]/20 text-sm font-bold text-[#57C7EE] ring-1 ring-white/[0.06]">
                            {getInitials(
                              review.name
                            )}
                          </div>
                        )}

                        <div className="min-w-0">
                          <h2 className="truncate text-sm font-bold text-[#F8FAFC]">
                            {review.name}
                          </h2>

                          {(review.role ||
                            review.businessName) && (
                            <p className="mt-0.5 truncate text-xs text-[#718895]">
                              {[
                                review.role,
                                review.businessName,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="shrink-0 rounded-lg border border-white/[0.07] bg-[#061A2B] px-2 py-1 text-[10px] font-bold text-[#718895]">
                        #{review.displayOrder}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <StatusBadge
                        published={
                          review.published
                        }
                      />

                      <FeaturedBadge
                        featured={
                          review.featured
                        }
                      />
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="p-5">

                    <div className="mb-4">
                      <RatingStars
                        rating={review.rating}
                      />
                    </div>

                    <div className="relative">
                      <MessageSquareQuote
                        aria-hidden="true"
                        className="absolute -left-1 -top-1 h-5 w-5 text-[#0D6E91]/50"
                      />

                      <p className="line-clamp-5 pl-6 text-sm leading-6 text-[#A8BBC8]">
                        {review.testimonial}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center gap-2 text-xs text-[#607887]">
                      <CalendarDays
                        size={13}
                      />
                      Added{" "}
                      {formatDate(
                        review.createdAt
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="grid grid-cols-3 border-t border-white/[0.07]">
                    <button
                      type="button"
                      onClick={() =>
                        setViewReview(review)
                      }
                      className="inline-flex h-11 items-center justify-center gap-1.5 border-r border-white/[0.07] text-xs font-semibold text-[#A8BBC8] transition hover:bg-white/[0.03] hover:text-[#F8FAFC]"
                    >
                      <Eye size={14} />
                      View
                    </button>

                    <Link
                      href={`/admin/reviews/${review.id}/edit`}
                      className="inline-flex h-11 items-center justify-center gap-1.5 border-r border-white/[0.07] text-xs font-semibold text-[#A8BBC8] transition hover:bg-[#0D6E91]/10 hover:text-[#57C7EE]"
                    >
                      <Edit3 size={14} />
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        setDeleteReview(review)
                      }
                      className="inline-flex h-11 items-center justify-center gap-1.5 text-xs font-semibold text-[#A8BBC8] transition hover:bg-red-400/10 hover:text-red-300"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* PAGINATION */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#08263D] p-3 sm:flex-row sm:items-center sm:justify-between">

                <p className="px-2 text-xs text-[#718895]">
                  Showing{" "}
                  <span className="font-semibold text-[#A8BBC8]">
                    {Math.min(
                      (pagination.page - 1) *
                        pagination.limit +
                        1,
                      pagination.total
                    )}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-[#A8BBC8]">
                    {Math.min(
                      pagination.page *
                        pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#A8BBC8]">
                    {pagination.total}
                  </span>{" "}
                  reviews
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={
                      pagination.page <= 1
                    }
                    onClick={() =>
                      setPagination(
                        (current) => ({
                          ...current,
                          page:
                            current.page - 1,
                        })
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-[#061A2B] text-[#A8BBC8] transition hover:text-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <span className="min-w-[90px] text-center text-xs font-semibold text-[#A8BBC8]">
                    Page{" "}
                    {pagination.page} of{" "}
                    {pagination.totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={
                      pagination.page >=
                      pagination.totalPages
                    }
                    onClick={() =>
                      setPagination(
                        (current) => ({
                          ...current,
                          page:
                            current.page + 1,
                        })
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-[#061A2B] text-[#A8BBC8] transition hover:text-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* VIEW MODAL */}
      {viewReview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={() =>
            setViewReview(null)
          }
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-view-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-white/[0.1] bg-[#08263D] shadow-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#061A2B]/70 px-5 py-4 sm:px-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFD400]">
                  Review Details
                </p>

                <h2
                  id="review-view-title"
                  className="mt-1 text-lg font-bold text-[#F8FAFC]"
                >
                  Customer Review
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setViewReview(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-[#08263D] text-[#A8BBC8] transition hover:text-[#F8FAFC]"
                aria-label="Close review details"
              >
                <X size={17} />
              </button>
            </div>

            <div className="max-h-[calc(90vh-76px)] overflow-y-auto p-5 sm:p-6">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {viewReview.photo?.secureUrl ? (
                    <img
                      src={
                        viewReview.photo.secureUrl
                      }
                      alt={
                        viewReview.photo.alt ||
                        `${viewReview.name} testimonial photo`
                      }
                      className="h-16 w-16 rounded-2xl object-cover ring-1 ring-white/[0.1]"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D6E91]/20 text-lg font-bold text-[#57C7EE]">
                      {getInitials(
                        viewReview.name
                      )}
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-bold text-[#F8FAFC]">
                      {viewReview.name}
                    </h3>

                    {(viewReview.role ||
                      viewReview.businessName) && (
                      <p className="mt-1 text-sm text-[#718895]">
                        {[
                          viewReview.role,
                          viewReview.businessName,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge
                    published={
                      viewReview.published
                    }
                  />

                  <FeaturedBadge
                    featured={
                      viewReview.featured
                    }
                  />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/[0.07] bg-[#061A2B] p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#718895]">
                    Rating
                  </p>

                  <RatingStars
                    rating={
                      viewReview.rating
                    }
                  />
                </div>

                <div className="border-t border-white/[0.07] pt-4">
                  <p className="text-base leading-7 text-[#F8FAFC]">
                    “{viewReview.testimonial}”
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/[0.07] bg-[#061A2B] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#718895]">
                    Display Order
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#F8FAFC]">
                    #{viewReview.displayOrder}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-[#061A2B] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#718895]">
                    Customer Photo
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#F8FAFC]">
                    {viewReview.photo
                      ? "Uploaded"
                      : "Initials avatar"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-[#061A2B] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#718895]">
                    Created
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#F8FAFC]">
                    {formatDate(
                      viewReview.createdAt
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-[#061A2B] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#718895]">
                    Last Updated
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#F8FAFC]">
                    {formatDate(
                      viewReview.updatedAt
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Link
                  href={`/admin/reviews/${viewReview.id}/edit`}
                  onClick={() =>
                    setViewReview(null)
                  }
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-4 text-sm font-bold text-[#061A2B] transition hover:bg-[#F5B800]"
                >
                  <Edit3 size={15} />
                  Edit Review
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteReview && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={() =>
            !deleting &&
            setDeleteReview(null)
          }
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-review-title"
            className="w-full max-w-md rounded-3xl border border-red-400/20 bg-[#08263D] p-6 shadow-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-400/10 text-red-300">
              <AlertTriangle size={22} />
            </div>

            <h2
              id="delete-review-title"
              className="mt-5 text-lg font-bold text-[#F8FAFC]"
            >
              Delete this review?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#A8BBC8]">
              This will permanently remove the
              review from the database. This action
              cannot be undone.
            </p>

            <div className="mt-4 rounded-xl border border-white/[0.07] bg-[#061A2B] p-4">
              <p className="text-sm font-semibold text-[#F8FAFC]">
                {deleteReview.name}
              </p>

              <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#718895]">
                {deleteReview.testimonial}
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  setDeleteReview(null)
                }
                className="h-10 rounded-xl border border-white/[0.08] bg-[#061A2B] px-4 text-sm font-semibold text-[#A8BBC8] transition hover:text-[#F8FAFC] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  void confirmDelete()
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 text-sm font-bold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={15} />
                {deleting
                  ? "Deleting..."
                  : "Delete Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}