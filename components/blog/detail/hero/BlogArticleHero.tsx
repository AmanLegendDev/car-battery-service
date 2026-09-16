import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  CalendarDays,
  Clock3,
  UserRound,
} from "lucide-react";

import { BLOG_ARTICLE_HERO } from "./blogArticleHeroData";

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

interface BlogArticleHeroProps {
  post: {
    title: string;
    slug: string;
    excerpt: string;

    coverImage: BlogMedia | null;

    authorName: string;
    authorRole: string;

    category: string;
    tags: string[];

    featured: boolean;

    publishedAt: string | null;
    readingTime: number | null;
  };
}

function formatDate(date: string | null) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default function BlogArticleHero({
  post,
}: BlogArticleHeroProps) {
  const image = post.coverImage?.secureUrl || null;

  const imageAlt =
    post.coverImage?.alt ||
    `${post.title} - Car Battery Service`;

  return (
    <section className="relative overflow-hidden bg-[#061A2B] text-white">
      {/* Ambient Atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#0D6E91]/20 blur-[110px]" />

        <div className="absolute -bottom-40 right-[-8rem] h-[32rem] w-[32rem] rounded-full bg-[#FFD400]/10 blur-[120px]" />

        <div className="absolute left-1/2 top-1/3 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-[#0D6E91]/10 blur-[100px]" />
      </div>

      {/* Technical Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.075]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Top Border Glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFD400]/70 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-7 sm:px-6 sm:pb-16 sm:pt-9 lg:px-8 lg:pb-20 lg:pt-10">
        {/* Back */}
        <div className="mb-10">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white/75 backdrop-blur-md transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            <ArrowLeft
              size={15}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            {BLOG_ARTICLE_HERO.backLabel}
          </Link>
        </div>

        <div className="grid items-end gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Content */}
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFD400]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />
                {BLOG_ARTICLE_HERO.eyebrow}
              </span>

              {post.featured && (
                <>
                  <span className="h-1 w-1 rounded-full bg-white/25" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                    Featured
                  </span>
                </>
              )}
            </div>

            {/* Category */}
            {post.category && (
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#65B5D1]">
                {post.category}
              </p>
            )}

            {/* Title */}
            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl md:text-6xl lg:text-[4.5rem]">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="mt-7 max-w-2xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
                {post.excerpt}
              </p>
            )}

            {/* Metadata */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-white/10 pt-6">
              {post.publishedAt && (
                <div className="flex items-center gap-2.5">
                  <CalendarDays
                    size={16}
                    className="text-[#FFD400]"
                  />

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
                      Published
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-white/75">
                      {formatDate(post.publishedAt)}
                    </p>
                  </div>
                </div>
              )}

              {post.readingTime && (
                <div className="flex items-center gap-2.5">
                  <Clock3
                    size={16}
                    className="text-[#FFD400]"
                  />

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
                      Reading time
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-white/75">
                      {post.readingTime} min read
                    </p>
                  </div>
                </div>
              )}

              {post.authorName && (
                <div className="flex items-center gap-2.5">
                  <UserRound
                    size={16}
                    className="text-[#FFD400]"
                  />

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
                      Written by
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-white/75">
                      {post.authorName}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#08263D] shadow-[0_35px_100px_rgba(0,0,0,0.32)]">
              <div className="relative aspect-[4/3]">
                {image ? (
                  <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(13,110,145,0.65),transparent_36%),linear-gradient(145deg,#061A2B,#08263D_55%,#0D6E91)]" />

                    <div
                      className="absolute inset-0 opacity-[0.13]"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                        backgroundSize: "42px 42px",
                      }}
                    />

                    <div className="absolute left-[12%] top-[16%] h-24 w-24 rounded-full border border-white/10" />

                    <div className="absolute bottom-[12%] right-[12%] h-36 w-36 rounded-full border border-[#FFD400]/15" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#061A2B]/50 via-transparent to-white/[0.03]" />

                {/* Image Label */}
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <div className="rounded-xl border border-white/10 bg-[#061A2B]/70 px-3.5 py-2.5 backdrop-blur-md">
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                      {BLOG_ARTICLE_HERO.imageFallbackLabel}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-white/85">
                      {post.category || "Journal"}
                    </p>
                  </div>

                  {post.featured && (
                    <span className="rounded-full bg-[#FFD400] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#061A2B]">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Decorative Index */}
            <div className="absolute -bottom-5 -left-4 hidden h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-[#061A2B] shadow-2xl sm:flex">
              <span className="text-2xl font-semibold tracking-[-0.04em] text-white/80">
                /
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-white/10 pt-6">
            <span className="mr-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
              Topics
            </span>

            {post.tags.slice(0, 8).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium text-white/55"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Scroll Cue */}
        <div className="mt-12 flex justify-center lg:mt-16">
          <a
            href="#article-content"
            className="group inline-flex flex-col items-center gap-2 text-white/35 transition hover:text-white/65"
            aria-label={BLOG_ARTICLE_HERO.scrollLabel}
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.24em]">
              {BLOG_ARTICLE_HERO.scrollLabel}
            </span>

            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
              <ArrowDown
                size={15}
                className="transition-transform duration-300 group-hover:translate-y-1"
              />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}