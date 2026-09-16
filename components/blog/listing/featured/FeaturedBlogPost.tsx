import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  UserRound,
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

interface FeaturedBlogPostData {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: BlogMedia | null;
  category: string;
  tags: string[];
  featured: boolean;
  publishedAt: string | null;
  authorName: string;
  authorRole: string;
  readingTime?: number | null;
}

interface FeaturedBlogPostProps {
  post: FeaturedBlogPostData | null;
}

function formatDate(date: string | null) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default function FeaturedBlogPost({
  post,
}: FeaturedBlogPostProps) {
  if (!post) return null;

  const image = post.coverImage?.secureUrl || null;
  const imageAlt =
    post.coverImage?.alt || `${post.title} - Car Battery Service`;

  return (
    <section className="bg-[#F8FAFC] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#0D6E91]">
              <span className="h-px w-7 bg-[#FFD400]" />
              Featured Article
            </div>

            <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.03em] text-[#061A2B] sm:text-4xl">
              Worth reading first.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-[#647783] sm:text-right">
            A practical article selected from the published Car Battery
            Service journal.
          </p>
        </div>

        {/* Featured Card */}
        <article className="group relative overflow-hidden rounded-[2rem] border border-[#DDE7ED] bg-white shadow-[0_24px_70px_rgba(6,26,43,0.10)]">
          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            {/* Image */}
            <Link
              href={`/blog/${post.slug}`}
              aria-label={`Read ${post.title}`}
              className="relative block min-h-[320px] overflow-hidden bg-[#061A2B] sm:min-h-[430px] lg:min-h-[560px]"
            >
              {image ? (
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
                />
              ) : (
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(13,110,145,0.55),transparent_38%),linear-gradient(135deg,#061A2B_0%,#08263D_55%,#0D6E91_100%)]" />

                  <div
                    className="absolute inset-0 opacity-[0.13]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                      backgroundSize: "42px 42px",
                    }}
                  />

                  <div className="absolute left-8 top-8 h-20 w-20 rounded-full border border-white/15" />
                  <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full border border-[#FFD400]/20" />
                </div>
              )}

              {/* Image Overlay */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#061A2B]/70 to-transparent" />

              {/* Featured Badge */}
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#061A2B]/75 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md sm:left-7 sm:top-7">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />
                Featured
              </div>

              {/* Image Corner Label */}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
                <span className="max-w-[75%] text-xs font-medium uppercase tracking-[0.16em] text-white/75">
                  {post.category}
                </span>

                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B] shadow-lg transition duration-300 group-hover:rotate-6">
                  <ArrowUpRight size={19} strokeWidth={2.2} />
                </span>
              </div>
            </Link>

            {/* Content */}
            <div className="flex flex-col justify-between p-7 sm:p-9 lg:p-12">
              <div>
                {/* Meta */}
                <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium text-[#71828D]">
                  {post.publishedAt && (
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays
                        size={15}
                        className="text-[#0D6E91]"
                      />
                      {formatDate(post.publishedAt)}
                    </span>
                  )}

                  {post.readingTime ? (
                    <span className="inline-flex items-center gap-2">
                      <Clock3 size={15} className="text-[#0D6E91]" />
                      {post.readingTime} min read
                    </span>
                  ) : null}
                </div>

                {/* Category */}
                <div className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0D6E91]">
                  {post.category}
                </div>

                {/* Title */}
                <h3 className="max-w-2xl text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#061A2B] sm:text-4xl lg:text-[2.75rem]">
                  {post.title}
                </h3>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="mt-6 max-w-xl text-base leading-7 text-[#647783] sm:text-[17px]">
                    {post.excerpt}
                  </p>
                )}

                {/* Author */}
                <div className="mt-8 flex items-center gap-3 border-t border-[#E6EDF1] pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF3F6] text-[#0D6E91]">
                    <UserRound size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#061A2B]">
                      {post.authorName}
                    </p>

                    {post.authorRole && (
                      <p className="mt-0.5 text-xs text-[#7A8B95]">
                        {post.authorRole}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {post.tags?.length > 0 && (
                  <div className="mt-7 flex flex-wrap gap-2">
                    {post.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#DDE7ED] bg-[#F8FAFC] px-3 py-1.5 text-[11px] font-medium text-[#617580]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="mt-10">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#061A2B] px-6 py-3.5 text-sm font-semibold text-white transition duration-300 hover:bg-[#08263D]"
                >
                  Read featured article
                  <ArrowUpRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}