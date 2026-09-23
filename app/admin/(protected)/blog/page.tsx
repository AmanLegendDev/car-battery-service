"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Code2,
  Edit3,
  Eye,
  FileText,
  Filter,
  Globe2,
  Image as ImageIcon,
  Loader2,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
  UserRound,
  X,
  ExternalLink,
  Link2,
  Layers3,
  MapPin,
  CheckCircle2,
  CircleDashed,
  CalendarClock,
  Star,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type BlogStatus = "draft" | "published" | "scheduled";

interface BlogMedia {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: "image";
  alt: string;
}

interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;

  coverImage: BlogMedia | null;

  authorName: string;
  authorRole: string;
  authorImage: BlogMedia | null;

  category: string;
  tags: string[];

  status: BlogStatus;
  featured: boolean;

  publishedAt: string | null;
  scheduledAt: string | null;

  readingTime: number | null;

  displayOrder: number;

  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;

  noIndex: boolean;

  ogTitle: string;
  ogDescription: string;
  ogImage: BlogMedia | null;

  relatedServices: string[];
  relatedServiceAreas: string[];

  createdAt: string;
  updatedAt: string;
}

interface ServiceItem {
  _id?: string;
  id?: string;
  title: string;
  name?: string;
}

interface ServiceAreaItem {
  _id?: string;
  id?: string;
  name: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface BlogResponse {
  success: boolean;
  data: BlogItem[];
  pagination: Pagination;
  message?: string;
}

interface RelationResponse {
  success: boolean;
  data: ServiceItem[] | ServiceAreaItem[];
  message?: string;
}

const LIMIT = 9;

function formatDate(value: string | null | undefined) {
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

function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function stripHtml(html: string) {
  if (!html) return "";

  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function getStatusMeta(status: BlogStatus) {
  switch (status) {
    case "published":
      return {
        label: "Published",
        icon: CheckCircle2,
        className:
          "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      };

    case "scheduled":
      return {
        label: "Scheduled",
        icon: CalendarClock,
        className:
          "border-[#FFD400]/20 bg-[#FFD400]/10 text-[#FFD400]",
      };

    default:
      return {
        label: "Draft",
        icon: CircleDashed,
        className:
          "border-white/[0.10] bg-white/[0.05] text-[#A8BBC8]",
      };
  }
}

function getServiceName(
  id: string,
  services: ServiceItem[],
) {
  const item = services.find(
    (service) => String(service._id ?? service.id) === String(id),
  );

  return item?.title ?? item?.name ?? "Unknown service";
}

function getServiceAreaName(
  id: string,
  areas: ServiceAreaItem[],
) {
  const item = areas.find(
    (area) => String(area._id ?? area.id) === String(id),
  );

  return item?.name ?? "Unknown service area";
}

function LoadingCard() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#08263D]/60">
      <div className="aspect-[16/8.5] animate-pulse bg-white/[0.05]" />

      <div className="space-y-4 p-5">
        <div className="h-4 w-24 animate-pulse rounded-full bg-white/[0.07]" />
        <div className="h-6 w-4/5 animate-pulse rounded-lg bg-white/[0.07]" />
        <div className="h-4 w-full animate-pulse rounded-lg bg-white/[0.05]" />
        <div className="h-4 w-2/3 animate-pulse rounded-lg bg-white/[0.05]" />

        <div className="flex gap-3 pt-2">
          <div className="h-9 flex-1 animate-pulse rounded-xl bg-white/[0.05]" />
          <div className="h-9 w-12 animate-pulse rounded-xl bg-white/[0.05]" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  hasFilters,
  onReset,
}: {
  hasFilters: boolean;
  onReset: () => void;
}) {
  return (
    <div className="col-span-full flex min-h-[430px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/[0.12] bg-[#08263D]/40 px-6 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#FFD400]/15 bg-[#FFD400]/[0.06]">
        <FileText className="h-7 w-7 text-[#FFD400]" />
      </div>

      <h3 className="text-lg font-bold text-[#F8FAFC]">
        {hasFilters ? "No matching blog posts" : "No blog posts yet"}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-[#91A5B2]">
        {hasFilters
          ? "Try changing your search or filters to find the blog post you are looking for."
          : "Create your first blog post and manage your website content from this dashboard."}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-[#F8FAFC] transition hover:bg-white/[0.08]"
          >
            Clear Filters
          </button>
        )}

        {!hasFilters && (
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#FFD400] px-4 py-2.5 text-sm font-extrabold text-[#061A2B] transition hover:bg-[#F5B800]"
          >
            <Plus className="h-4 w-4" />
            Create Blog Post
          </Link>
        )}
      </div>
    </div>
  );
}

function StatPill({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2">
      <Icon className="h-4 w-4 text-[#FFD400]" />
      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#718895]">
          {label}
        </p>
        <p className="mt-0.5 truncate text-xs font-bold text-[#DCE7ED]">
          {value}
        </p>
      </div>
    </div>
  );
}

function BlogCard({
  blog,
  onView,
  onDelete,
}: {
  blog: BlogItem;
  onView: (blog: BlogItem) => void;
  onDelete: (blog: BlogItem) => void;
}) {
  const status = getStatusMeta(blog.status);
  const StatusIcon = status.icon;

  return (
    <article className="group overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#08263D]/70 shadow-[0_18px_55px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-[#08263D]">
      {/* Cover */}
      <div className="relative aspect-[16/8.5] overflow-hidden bg-[#061A2B]">
        {blog.coverImage?.secureUrl ? (
          <img
            src={blog.coverImage.secureUrl}
            alt={blog.coverImage.alt || blog.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(255,212,0,0.12),transparent_35%),linear-gradient(135deg,#08263D,#061A2B)]">
            <ImageIcon className="h-10 w-10 text-[#4C6574]" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#061A2B]/85 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] backdrop-blur-xl ${status.className}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {status.label}
          </span>

          {blog.featured && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFD400]/20 bg-[#061A2B]/75 px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#FFD400] backdrop-blur-xl">
              <Star className="h-3.5 w-3.5 fill-current" />
              Featured
            </span>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <span className="rounded-full border border-white/[0.12] bg-[#061A2B]/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#DCE7ED] backdrop-blur-xl">
            {blog.category}
          </span>

          <span className="rounded-full border border-white/[0.10] bg-[#061A2B]/75 px-3 py-1.5 text-[10px] font-bold text-[#A8BBC8] backdrop-blur-xl">
            #{blog.displayOrder}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-[#718895]">
          <UserRound className="h-3.5 w-3.5" />
          <span className="truncate">{blog.authorName}</span>

          {blog.readingTime && (
            <>
              <span className="text-white/20">•</span>
              <Clock3 className="h-3.5 w-3.5" />
              <span>{blog.readingTime} min</span>
            </>
          )}
        </div>

        <h2 className="mt-3 line-clamp-2 min-h-[56px] text-[18px] font-extrabold leading-7 tracking-[-0.02em] text-[#F8FAFC]">
          {blog.title}
        </h2>

        <p className="mt-2 line-clamp-3 min-h-[66px] text-sm leading-6 text-[#91A5B2]">
          {blog.excerpt}
        </p>

        {blog.tags.length > 0 && (
          <div className="mt-4 flex min-h-[26px] flex-wrap gap-1.5">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2 py-1 text-[10px] font-semibold text-[#8EA2AF]"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}

            {blog.tags.length > 3 && (
              <span className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-2 py-1 text-[10px] font-semibold text-[#718895]">
                +{blog.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2">
          <StatPill
            icon={CalendarDays}
            label={
              blog.status === "scheduled"
                ? "Scheduled"
                : blog.status === "published"
                  ? "Published"
                  : "Created"
            }
            value={
              blog.status === "scheduled"
                ? formatDate(blog.scheduledAt)
                : blog.status === "published"
                  ? formatDate(blog.publishedAt)
                  : formatDate(blog.createdAt)
            }
          />

          <StatPill
            icon={Layers3}
            label="Relations"
            value={
              blog.relatedServices.length +
              blog.relatedServiceAreas.length
            }
          />
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-white/[0.07] pt-4">
          <button
            type="button"
            onClick={() => onView(blog)}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.035] text-xs font-extrabold text-[#F8FAFC] transition hover:border-[#FFD400]/20 hover:bg-[#FFD400]/[0.07] hover:text-[#FFD400]"
          >
            <Eye className="h-4 w-4" />
            View
          </button>

          <Link
            href={`/admin/blog/${blog.id}/edit`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.035] text-[#A8BBC8] transition hover:border-[#0D6E91]/40 hover:bg-[#0D6E91]/10 hover:text-[#F8FAFC]"
            aria-label={`Edit ${blog.title}`}
          >
            <Edit3 className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => onDelete(blog)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/10 bg-red-400/[0.04] text-red-300 transition hover:border-red-400/25 hover:bg-red-400/10"
            aria-label={`Delete ${blog.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

function ViewModal({
  blog,
  services,
  serviceAreas,
  onClose,
}: {
  blog: BlogItem;
  services: ServiceItem[];
  serviceAreas: ServiceAreaItem[];
  onClose: () => void;
}) {
  const status = getStatusMeta(blog.status);
  const StatusIcon = status.icon;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#020B12]/80 p-0 backdrop-blur-md sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-t-[28px] border border-white/[0.10] bg-[#061A2B] shadow-[0_30px_100px_rgba(0,0,0,0.55)] sm:rounded-[28px]">
        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/[0.08] bg-[#08263D]/80 px-5 py-4 backdrop-blur-xl sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FFD400]/15 bg-[#FFD400]/[0.07]">
              <FileText className="h-5 w-5 text-[#FFD400]" />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#718895]">
                Blog Preview
              </p>
              <h2 className="truncate text-sm font-extrabold text-[#F8FAFC] sm:text-base">
                {blog.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.04] text-[#A8BBC8] transition hover:bg-white/[0.08] hover:text-white"
            aria-label="Close blog preview"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            {/* Main */}
            <div className="border-b border-white/[0.08] lg:border-b-0 lg:border-r">
              {blog.coverImage?.secureUrl && (
                <div className="relative aspect-[16/7] overflow-hidden bg-[#04131F]">
                  <img
                    src={blog.coverImage.secureUrl}
                    alt={blog.coverImage.alt || blog.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061A2B] via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2 sm:left-7 sm:right-7">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] backdrop-blur-xl ${status.className}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {status.label}
                    </span>

                    {blog.featured && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFD400]/20 bg-[#061A2B]/80 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#FFD400] backdrop-blur-xl">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="p-5 sm:p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#0D6E91]/25 bg-[#0D6E91]/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#79C4DD]">
                    {blog.category}
                  </span>

                  <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold text-[#718895]">
                    Order #{blog.displayOrder}
                  </span>
                </div>

                <h1 className="mt-5 text-2xl font-black leading-tight tracking-[-0.035em] text-[#F8FAFC] sm:text-3xl">
                  {blog.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#91A5B2]">
                  <span className="inline-flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-[#FFD400]" />
                    {blog.authorName}
                    {blog.authorRole ? ` · ${blog.authorRole}` : ""}
                  </span>

                  {blog.readingTime && (
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-[#FFD400]" />
                      {blog.readingTime} min read
                    </span>
                  )}

                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-[#FFD400]" />
                    {formatDate(
                      blog.status === "published"
                        ? blog.publishedAt
                        : blog.createdAt,
                    )}
                  </span>
                </div>

                <div className="mt-7 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <p className="text-sm leading-7 text-[#C3D0D8]">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="mt-8">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-[#FFD400]" />
                    <h3 className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#F8FAFC]">
                      Article Content
                    </h3>
                  </div>

                  <article
                    className="blog-admin-content text-sm leading-7 text-[#B9C8D1]"
                    dangerouslySetInnerHTML={{
                      __html: blog.content,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5 p-5 sm:p-7">
              {/* Publishing */}
              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#FFD400]" />
                  <h3 className="text-sm font-extrabold text-[#F8FAFC]">
                    Publishing
                  </h3>
                </div>

                <div className="mt-4 space-y-3">
                  <InfoRow
                    label="Status"
                    value={status.label}
                  />

                  <InfoRow
                    label="Featured"
                    value={blog.featured ? "Yes" : "No"}
                  />

                  <InfoRow
                    label="Published"
                    value={formatDateTime(blog.publishedAt)}
                  />

                  <InfoRow
                    label="Scheduled"
                    value={formatDateTime(blog.scheduledAt)}
                  />

                  <InfoRow
                    label="Created"
                    value={formatDateTime(blog.createdAt)}
                  />

                  <InfoRow
                    label="Updated"
                    value={formatDateTime(blog.updatedAt)}
                  />
                </div>
              </section>

              {/* Slug */}
              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-[#FFD400]" />
                  <h3 className="text-sm font-extrabold text-[#F8FAFC]">
                    URL
                  </h3>
                </div>

                <div className="mt-3 break-all rounded-xl border border-white/[0.07] bg-[#061A2B] p-3 font-mono text-[11px] leading-5 text-[#91A5B2]">
                  /blog/{blog.slug}
                </div>

                {blog.canonicalUrl && (
                  <div className="mt-2 break-all text-[10px] leading-5 text-[#718895]">
                    Canonical: {blog.canonicalUrl}
                  </div>
                )}
              </section>

              {/* Tags */}
              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-[#FFD400]" />
                  <h3 className="text-sm font-extrabold text-[#F8FAFC]">
                    Tags
                  </h3>
                </div>

                {blog.tags.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg border border-white/[0.08] bg-white/[0.035] px-2.5 py-1.5 text-[10px] font-semibold text-[#A8BBC8]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-[#718895]">
                    No tags added.
                  </p>
                )}
              </section>

              {/* Relations */}
              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2">
                  <Layers3 className="h-4 w-4 text-[#FFD400]" />
                  <h3 className="text-sm font-extrabold text-[#F8FAFC]">
                    Related Content
                  </h3>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <p className="mb-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#718895]">
                      Services
                    </p>

                    {blog.relatedServices.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {blog.relatedServices.map((id) => (
                          <span
                            key={id}
                            className="rounded-lg border border-[#0D6E91]/20 bg-[#0D6E91]/[0.07] px-2.5 py-1.5 text-[10px] font-bold text-[#79C4DD]"
                          >
                            {getServiceName(id, services)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#718895]">
                        No related services.
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="mb-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#718895]">
                      Service Areas
                    </p>

                    {blog.relatedServiceAreas.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {blog.relatedServiceAreas.map((id) => (
                          <span
                            key={id}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.035] px-2.5 py-1.5 text-[10px] font-bold text-[#A8BBC8]"
                          >
                            <MapPin className="h-3 w-3" />
                            {getServiceAreaName(id, serviceAreas)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#718895]">
                        No related service areas.
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* SEO */}
              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-[#FFD400]" />
                  <h3 className="text-sm font-extrabold text-[#F8FAFC]">
                    SEO
                  </h3>
                </div>

                <div className="mt-4 space-y-4">
                  <InfoBlock
                    label="SEO Title"
                    value={blog.seoTitle || "Not configured"}
                  />

                  <InfoBlock
                    label="SEO Description"
                    value={
                      blog.seoDescription || "Not configured"
                    }
                  />

                  <InfoBlock
                    label="OG Title"
                    value={blog.ogTitle || "Not configured"}
                  />

                  <InfoBlock
                    label="OG Description"
                    value={
                      blog.ogDescription || "Not configured"
                    }
                  />

                  <InfoRow
                    label="Search indexing"
                    value={blog.noIndex ? "No Index" : "Indexable"}
                  />
                </div>
              </section>

              {/* Media */}
              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-[#FFD400]" />
                  <h3 className="text-sm font-extrabold text-[#F8FAFC]">
                    Media
                  </h3>
                </div>

                <div className="mt-4 space-y-3">
                  <InfoRow
                    label="Cover"
                    value={blog.coverImage ? "Available" : "Not set"}
                  />

                  <InfoRow
                    label="Author image"
                    value={blog.authorImage ? "Available" : "Not set"}
                  />

                  <InfoRow
                    label="OG image"
                    value={blog.ogImage ? "Available" : "Not set"}
                  />
                </div>
              </section>
            </aside>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] bg-[#08263D]/80 px-5 py-4 backdrop-blur-xl sm:px-7">
          <div className="flex items-center gap-2 text-[10px] font-semibold text-[#718895]">
            <Hash className="h-3.5 w-3.5" />
            {blog.id}
          </div>

          <div className="flex w-full gap-2 sm:w-auto">
            {blog.status === "published" && (
              <Link
                href={`/blog/${blog.slug}`}
                target="_blank"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.035] px-4 py-2.5 text-xs font-extrabold text-[#F8FAFC] transition hover:bg-white/[0.08] sm:flex-none"
              >
                <ExternalLink className="h-4 w-4" />
                Open Public
              </Link>
            )}

            <Link
              href={`/admin/blog/${blog.id}/edit`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-4 py-2.5 text-xs font-extrabold text-[#061A2B] transition hover:bg-[#F5B800] sm:flex-none"
            >
              <Edit3 className="h-4 w-4" />
              Edit Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-3 last:border-b-0 last:pb-0">
      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#718895]">
        {label}
      </span>

      <span className="max-w-[62%] text-right text-xs font-bold text-[#DCE7ED]">
        {value}
      </span>
    </div>
  );
}

function InfoBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#718895]">
        {label}
      </p>

      <p className="mt-1.5 text-xs leading-5 text-[#B9C8D1]">
        {value}
      </p>
    </div>
  );
}

function DeleteModal({
  blog,
  deleting,
  onClose,
  onConfirm,
}: {
  blog: BlogItem;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-[#020B12]/85 p-0 backdrop-blur-md sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !deleting) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-t-[28px] border border-red-400/15 bg-[#061A2B] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.6)] sm:rounded-[28px]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/15 bg-red-400/[0.07]">
          <Trash2 className="h-5 w-5 text-red-300" />
        </div>

        <h2 className="mt-5 text-xl font-black text-[#F8FAFC]">
          Delete this blog post?
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#91A5B2]">
          You are about to permanently delete:
        </p>

        <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
          <p className="line-clamp-2 text-sm font-bold leading-6 text-[#F8FAFC]">
            {blog.title}
          </p>

          <p className="mt-1 text-[10px] text-[#718895]">
            /blog/{blog.slug}
          </p>
        </div>

        <p className="mt-4 text-xs leading-5 text-[#718895]">
          This removes the blog record from the database. The current delete
          API intentionally does not remove Cloudinary media assets.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="h-11 rounded-xl border border-white/[0.10] bg-white/[0.035] px-5 text-sm font-bold text-[#F8FAFC] transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-500 px-5 text-sm font-extrabold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Blog
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: LIMIT,
    total: 0,
    totalPages: 1,
  });

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ServiceAreaItem[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState("");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [relationsLoading, setRelationsLoading] = useState(true);

  const [viewBlog, setViewBlog] = useState<BlogItem | null>(null);
  const [deleteBlog, setDeleteBlog] = useState<BlogItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", String(LIMIT));

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (status) {
        params.set("status", status);
      }

      if (category) {
        params.set("category", category);
      }

      if (featured) {
        params.set("featured", featured);
      }

      const response = await fetch(
        `/api/admin/blog?${params.toString()}`,
        {
          cache: "no-store",
        },
      );

      const result =
        (await response.json()) as BlogResponse;

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load blog posts.",
        );
      }

      setBlogs(result.data ?? []);
      setPagination(
        result.pagination ?? {
          page,
          limit: LIMIT,
          total: 0,
          totalPages: 1,
        },
      );
    } catch (error) {
      console.error("[admin/blog] fetch error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load blog posts.",
      );

      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, category, featured]);

  const fetchRelations = useCallback(async () => {
    try {
      setRelationsLoading(true);

      const [servicesResponse, areasResponse] =
        await Promise.all([
          fetch("/api/admin/services?limit=100", {
            cache: "no-store",
          }),
          fetch("/api/admin/service-areas?limit=100", {
            cache: "no-store",
          }),
        ]);

      const servicesResult =
        (await servicesResponse.json()) as RelationResponse;

      const areasResult =
        (await areasResponse.json()) as RelationResponse;

      if (
        servicesResponse.ok &&
        servicesResult.success &&
        Array.isArray(servicesResult.data)
      ) {
        setServices(
          servicesResult.data as ServiceItem[],
        );
      }

      if (
        areasResponse.ok &&
        areasResult.success &&
        Array.isArray(areasResult.data)
      ) {
        setServiceAreas(
          areasResult.data as ServiceAreaItem[],
        );
      }
    } catch (error) {
      console.error(
        "[admin/blog] relation fetch error:",
        error,
      );
    } finally {
      setRelationsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    void fetchRelations();
  }, [fetchRelations]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        blogs
          .map((blog) => blog.category?.trim())
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [blogs]);

  const hasFilters = Boolean(
    search.trim() ||
      status ||
      category ||
      featured,
  );

  function resetFilters() {
    setSearch("");
    setStatus("");
    setCategory("");
    setFeatured("");
    setPage(1);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(value: string) {
    setStatus(value);
    setPage(1);
  }

  function handleCategoryChange(value: string) {
    setCategory(value);
    setPage(1);
  }

  function handleFeaturedChange(value: string) {
    setFeatured(value);
    setPage(1);
  }

  async function confirmDelete() {
    if (!deleteBlog) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/admin/blog/${deleteBlog.id}`,
        {
          method: "DELETE",
        },
      );

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to delete blog post.",
        );
      }

      toast.success(
        "Blog post deleted successfully.",
      );

      setDeleteBlog(null);

      if (blogs.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await fetchBlogs();
      }
    } catch (error) {
      console.error(
        "[admin/blog] delete error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete blog post.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-[#061A2B]">
        {/* Header */}
        <div className="border-b border-white/[0.07] bg-[#061A2B]/95">
          <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#718895]">
                    Content Management
                  </span>
                </div>

                <h1 className="text-2xl font-black tracking-[-0.035em] text-[#F8FAFC] sm:text-3xl">
                  Blog
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#91A5B2]">
                  Create, organise, publish and manage your website
                  articles from one place.
                </p>
              </div>

              <Link
                href="/admin/blog/new"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-5 text-sm font-extrabold text-[#061A2B] shadow-[0_10px_30px_rgba(255,212,0,0.12)] transition hover:bg-[#F5B800]"
              >
                <Plus className="h-4 w-4" />
                New Blog Post
              </Link>
            </div>

            {/* Top Stats */}
            <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/[0.08] bg-[#08263D]/60 p-4">
                <div className="flex items-center justify-between">
                  <FileText className="h-4 w-4 text-[#FFD400]" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#718895]">
                    Total
                  </span>
                </div>

                <p className="mt-3 text-2xl font-black text-[#F8FAFC]">
                  {pagination.total}
                </p>

                <p className="mt-1 text-[10px] text-[#718895]">
                  Blog posts
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-[#08263D]/60 p-4">
                <div className="flex items-center justify-between">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#718895]">
                    Published
                  </span>
                </div>

                <p className="mt-3 text-2xl font-black text-[#F8FAFC]">
                  {blogs.filter(
                    (blog) => blog.status === "published",
                  ).length}
                </p>

                <p className="mt-1 text-[10px] text-[#718895]">
                  Current page
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-[#08263D]/60 p-4">
                <div className="flex items-center justify-between">
                  <CircleDashed className="h-4 w-4 text-[#A8BBC8]" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#718895]">
                    Drafts
                  </span>
                </div>

                <p className="mt-3 text-2xl font-black text-[#F8FAFC]">
                  {blogs.filter(
                    (blog) => blog.status === "draft",
                  ).length}
                </p>

                <p className="mt-1 text-[10px] text-[#718895]">
                  Current page
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-[#08263D]/60 p-4">
                <div className="flex items-center justify-between">
                  <Star className="h-4 w-4 fill-current text-[#FFD400]" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#718895]">
                    Featured
                  </span>
                </div>

                <p className="mt-3 text-2xl font-black text-[#F8FAFC]">
                  {blogs.filter(
                    (blog) => blog.featured,
                  ).length}
                </p>

                <p className="mt-1 text-[10px] text-[#718895]">
                  Current page
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main */}
        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Filters */}
          <section className="rounded-[24px] border border-white/[0.08] bg-[#08263D]/55 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.14)] sm:p-5">
            <div className="flex flex-col gap-3 xl:flex-row">
              {/* Search */}
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718895]" />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    handleSearchChange(
                      event.target.value,
                    )
                  }
                  placeholder="Search title, slug or excerpt..."
                  className="h-11 w-full rounded-xl border border-white/[0.09] bg-[#061A2B] pl-10 pr-4 text-sm text-[#F8FAFC] outline-none transition placeholder:text-[#526A78] focus:border-[#FFD400]/35 focus:ring-2 focus:ring-[#FFD400]/10"
                />
              </div>

              {/* Status */}
              <select
                value={status}
                onChange={(event) =>
                  handleStatusChange(
                    event.target.value,
                  )
                }
                className="h-11 rounded-xl border border-white/[0.09] bg-[#061A2B] px-3 text-sm font-semibold text-[#C9D6DD] outline-none transition focus:border-[#FFD400]/35"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">
                  Published
                </option>
                <option value="scheduled">
                  Scheduled
                </option>
              </select>

              {/* Category */}
              <select
                value={category}
                onChange={(event) =>
                  handleCategoryChange(
                    event.target.value,
                  )
                }
                className="h-11 rounded-xl border border-white/[0.09] bg-[#061A2B] px-3 text-sm font-semibold text-[#C9D6DD] outline-none transition focus:border-[#FFD400]/35"
              >
                <option value="">All Categories</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {/* Featured */}
              <select
                value={featured}
                onChange={(event) =>
                  handleFeaturedChange(
                    event.target.value,
                  )
                }
                className="h-11 rounded-xl border border-white/[0.09] bg-[#061A2B] px-3 text-sm font-semibold text-[#C9D6DD] outline-none transition focus:border-[#FFD400]/35"
              >
                <option value="">Featured: All</option>
                <option value="true">
                  Featured Only
                </option>
                <option value="false">
                  Not Featured
                </option>
              </select>

              {hasFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 text-xs font-extrabold text-[#A8BBC8] transition hover:bg-white/[0.07] hover:text-[#F8FAFC]"
                >
                  <X className="h-4 w-4" />
                  Clear
                </button>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[#718895]">
                <Filter className="h-3.5 w-3.5" />
                {hasFilters
                  ? "Filtered results"
                  : "All blog content"}
              </div>

              <div className="text-[10px] font-semibold text-[#718895]">
                {loading
                  ? "Loading..."
                  : `${pagination.total} result${
                      pagination.total === 1
                        ? ""
                        : "s"
                    }`}
              </div>
            </div>
          </section>

          {/* Grid */}
          <section className="mt-6">
            {loading ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map(
                  (_, index) => (
                    <LoadingCard key={index} />
                  ),
                )}
              </div>
            ) : blogs.length === 0 ? (
              <div className="grid">
                <EmptyState
                  hasFilters={hasFilters}
                  onReset={resetFilters}
                />
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {blogs.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    blog={blog}
                    onView={setViewBlog}
                    onDelete={setDeleteBlog}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Pagination */}
          {!loading &&
            blogs.length > 0 &&
            pagination.totalPages > 1 && (
              <section className="mt-7 flex flex-col gap-4 rounded-[22px] border border-white/[0.08] bg-[#08263D]/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold text-[#C3D0D8]">
                    Page {pagination.page} of{" "}
                    {pagination.totalPages}
                  </p>

                  <p className="mt-1 text-[10px] text-[#718895]">
                    Showing{" "}
                    {(pagination.page - 1) *
                      pagination.limit +
                      1}{" "}
                   –
                    {Math.min(
                      pagination.page *
                        pagination.limit,
                      pagination.total,
                    )}{" "}
                    of {pagination.total}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={
                      pagination.page <= 1
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.max(
                            1,
                            current - 1,
                          ),
                      )
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.035] px-3 text-xs font-bold text-[#C3D0D8] transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <div className="flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#FFD400]/20 bg-[#FFD400]/[0.07] px-3 text-xs font-extrabold text-[#FFD400]">
                    {pagination.page}
                  </div>

                  <button
                    type="button"
                    disabled={
                      pagination.page >=
                      pagination.totalPages
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.min(
                            pagination.totalPages,
                            current + 1,
                          ),
                      )
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.035] px-3 text-xs font-bold text-[#C3D0D8] transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </section>
            )}
        </main>
      </div>

      {/* View */}
      {viewBlog && (
        <ViewModal
          blog={viewBlog}
          services={services}
          serviceAreas={serviceAreas}
          onClose={() => setViewBlog(null)}
        />
      )}

      {/* Delete */}
      {deleteBlog && (
        <DeleteModal
          blog={deleteBlog}
          deleting={deleting}
          onClose={() => {
            if (!deleting) {
              setDeleteBlog(null);
            }
          }}
          onConfirm={confirmDelete}
        />
      )}

      {/* Small global styles for rendered Tiptap HTML */}
      <style jsx global>{`
        .blog-admin-content {
          overflow-wrap: anywhere;
        }

        .blog-admin-content h1,
        .blog-admin-content h2,
        .blog-admin-content h3,
        .blog-admin-content h4 {
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          color: #f8fafc;
          font-weight: 800;
          line-height: 1.25;
        }

        .blog-admin-content h1 {
          font-size: 1.65rem;
        }

        .blog-admin-content h2 {
          font-size: 1.35rem;
        }

        .blog-admin-content h3 {
          font-size: 1.1rem;
        }

        .blog-admin-content p {
          margin: 0.9rem 0;
        }

        .blog-admin-content strong {
          color: #f8fafc;
          font-weight: 800;
        }

        .blog-admin-content em {
          color: #dce7ed;
        }

        .blog-admin-content a {
          color: #79c4dd;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .blog-admin-content ul,
        .blog-admin-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .blog-admin-content ul {
          list-style: disc;
        }

        .blog-admin-content ol {
          list-style: decimal;
        }

        .blog-admin-content li {
          margin: 0.45rem 0;
          padding-left: 0.25rem;
        }

        .blog-admin-content blockquote {
          margin: 1.25rem 0;
          border-left: 3px solid #ffd400;
          padding-left: 1rem;
          color: #a8bbc8;
          font-style: italic;
        }

        .blog-admin-content pre {
          margin: 1.25rem 0;
          overflow-x: auto;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          background: #04131f;
          padding: 1rem;
          color: #dce7ed;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco,
            Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.78rem;
          line-height: 1.7;
        }

        .blog-admin-content code {
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.15rem 0.35rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco,
            Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.85em;
          color: #dce7ed;
        }

        .blog-admin-content pre code {
          background: transparent;
          padding: 0;
        }

        .blog-admin-content hr {
          margin: 1.75rem 0;
          border: 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .blog-admin-content img {
          max-width: 100%;
          height: auto;
          margin: 1.25rem 0;
          border-radius: 16px;
        }
      `}</style>
    </>
  );
}