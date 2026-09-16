import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
} from "lucide-react";

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

interface BlogDirectoryCardProps {
  post: {
    title: string;
    slug: string;
    excerpt: string;
    coverImage: BlogMedia | null;
    category: string;
    tags: string[];
    featured: boolean;
    publishedAt: Date | string | null;
    authorName: string;
    authorRole: string;
    readingTime?: number | null;
  };
  index: number;
}

function formatDate(date: Date | string | null) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function BlogDirectoryCard({
  post,
  index,
}: BlogDirectoryCardProps) {
  const image = post.coverImage?.secureUrl || null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#DDE7ED] bg-white transition duration-500 hover:-translate-y-1 hover:border-[#BFD2DC] hover:shadow-[0_22px_55px_rgba(6,26,43,0.10)]">
      {/* Image */}
      <Link
        href={`/blog/${post.slug}`}
        aria-label={`Read ${post.title}`}
        className="relative block aspect-[16/10] overflow-hidden bg-[#061A2B]"
      >
        {image ? (
          <Image
            src={image}
            alt={
              post.coverImage?.alt ||
              `${post.title} - Car Battery Service`
            }
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(13,110,145,0.55),transparent_38%),linear-gradient(135deg,#061A2B,#08263D_58%,#0D6E91)]" />

            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
                backgroundSize: "34px 34px",
              }}
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#061A2B]/45 via-transparent to-transparent" />

        {/* Number */}
        <div className="absolute left-5 top-5 flex h-9 min-w-9 items-center justify-center rounded-full border border-white/20 bg-[#061A2B]/75 px-2.5 text-[11px] font-bold tracking-[0.12em] text-white backdrop-blur-md">
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Featured */}
        {post.featured && (
          <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#061A2B]/75 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />
            Featured
          </div>
        )}

        {/* Arrow */}
        <div className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B] opacity-0 shadow-lg transition duration-300 group-hover:opacity-100">
          <ArrowUpRight size={17} strokeWidth={2.2} />
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {/* Meta */}
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium text-[#7A8B95]">
          {post.publishedAt && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={13} className="text-[#0D6E91]" />
              {formatDate(post.publishedAt)}
            </span>
          )}

          {post.readingTime ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={13} className="text-[#0D6E91]" />
              {post.readingTime} min
            </span>
          ) : null}
        </div>

        {/* Category */}
        {post.category && (
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0D6E91]">
            {post.category}
          </p>
        )}

        {/* Title */}
        <h3 className="text-xl font-semibold leading-[1.18] tracking-[-0.025em] text-[#061A2B] transition-colors duration-300 group-hover:text-[#0D6E91] sm:text-[22px]">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#697C87]">
            {post.excerpt}
          </p>
        )}

        {/* Bottom */}
        <div className="mt-auto pt-7">
          <div className="flex items-center justify-between gap-4 border-t border-[#E7EEF2] pt-5">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-[#061A2B]">
                {post.authorName}
              </p>

              {post.authorRole && (
                <p className="mt-0.5 truncate text-[11px] text-[#84939B]">
                  {post.authorRole}
                </p>
              )}
            </div>

            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#061A2B] transition-colors hover:text-[#0D6E91]"
            >
              Read article
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}