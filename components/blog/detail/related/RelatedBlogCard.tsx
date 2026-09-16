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

interface RelatedBlogCardProps {
  post: {
    title: string;
    slug: string;
    excerpt: string;
    coverImage: BlogMedia | null;
    category: string;
    publishedAt: string | null;
    readingTime: number | null;
  };
}

function formatDate(date: string | null) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function RelatedBlogCard({
  post,
}: RelatedBlogCardProps) {
  const image = post.coverImage?.secureUrl || null;

  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-[#DDE7ED] bg-white transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(6,26,43,0.09)]">
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
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(13,110,145,0.55),transparent_38%),linear-gradient(135deg,#061A2B,#08263D_60%,#0D6E91)]">
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                backgroundSize: "36px 36px",
              }}
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#061A2B]/40 to-transparent" />

        <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B] opacity-0 transition duration-300 group-hover:opacity-100">
          <ArrowUpRight size={17} />
        </span>
      </Link>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-medium text-[#84939B]">
          {post.category && (
            <span className="font-bold uppercase tracking-[0.16em] text-[#0D6E91]">
              {post.category}
            </span>
          )}

          {post.publishedAt && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={12} />
              {formatDate(post.publishedAt)}
            </span>
          )}

          {post.readingTime ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={12} />
              {post.readingTime} min
            </span>
          ) : null}
        </div>

        <h3 className="mt-4 text-xl font-semibold leading-[1.18] tracking-[-0.025em] text-[#061A2B] transition-colors group-hover:text-[#0D6E91]">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>

        {post.excerpt && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#6B7D87]">
            {post.excerpt}
          </p>
        )}

        <Link
          href={`/blog/${post.slug}`}
          className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#061A2B] transition-colors hover:text-[#0D6E91]"
        >
          Read article
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </article>
  );
}