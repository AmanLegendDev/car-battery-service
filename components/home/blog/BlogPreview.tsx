import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
} from "lucide-react";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";

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

interface HomepageBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: BlogMedia | null;
  category: string;
  featured: boolean;
  publishedAt: Date | null;
  authorName: string;
  authorRole: string;
}

async function getHomepageBlogs(): Promise<HomepageBlog[]> {
  await connectDB();

  const blogs = await Blog.find({
    status: "published",
    noIndex: false,
  })
    .select(
      "title slug excerpt coverImage category featured publishedAt authorName authorRole",
    )
    .sort({
      featured: -1,
      publishedAt: -1,
      displayOrder: 1,
    })
    .limit(3)
    .lean();

  return blogs.map((blog) => ({
    _id: String(blog._id),
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    coverImage: blog.coverImage
      ? {
          publicId: blog.coverImage.publicId,
          secureUrl: blog.coverImage.secureUrl,
          width: blog.coverImage.width,
          height: blog.coverImage.height,
          format: blog.coverImage.format,
          bytes: blog.coverImage.bytes,
          resourceType: "image",
          alt: blog.coverImage.alt,
        }
      : null,
    category: blog.category,
    featured: blog.featured,
    publishedAt: blog.publishedAt
      ? new Date(blog.publishedAt)
      : null,
    authorName: blog.authorName,
    authorRole: blog.authorRole,
  }));
}

function formatDate(date: Date | null) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function BlogPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-[#061A2B]"
    >
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(#FFD400 1px, transparent 1px), linear-gradient(90deg, #FFD400 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-[#FFD400]/20" />

      <div className="absolute -bottom-14 -left-10 h-48 w-48 rounded-full border border-[#0D6E91]/30" />

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-[9px] tracking-[0.3em] text-[#A8BBC8]/40">
          CAR BATTERY SERVICE
        </span>
      </div>
    </div>
  );
}

function BlogImage({
  blog,
  priority = false,
}: {
  blog: HomepageBlog;
  priority?: boolean;
}) {
  if (!blog.coverImage?.secureUrl) {
    return <BlogPlaceholder />;
  }

  return (
    <Image
      src={blog.coverImage.secureUrl}
      alt={blog.coverImage.alt || blog.title}
      fill
      priority={priority}
      sizes="(max-width: 768px) 100vw, 50vw"
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
    />
  );
}

function BlogMeta({
  blog,
  dark = false,
}: {
  blog: HomepageBlog;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span
        className={`text-[9px] font-bold uppercase tracking-[0.2em] ${
          dark ? "text-[#FFD400]" : "text-[#0D6E91]"
        }`}
      >
        {blog.category}
      </span>

      {blog.publishedAt && (
        <>
          <span
            className={`h-1 w-1 rounded-full ${
              dark ? "bg-white/20" : "bg-[#061A2B]/20"
            }`}
          />

          <span
            className={`flex items-center gap-1.5 text-[10px] ${
              dark ? "text-[#A8BBC8]" : "text-[#526675]"
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />

            {formatDate(blog.publishedAt)}
          </span>
        </>
      )}
    </div>
  );
}

function AuthorLine({
  blog,
  dark = false,
}: {
  blog: HomepageBlog;
  dark?: boolean;
}) {
  return (
    <div>
      <p
        className={`text-xs font-semibold ${
          dark ? "text-[#F8FAFC]" : "text-[#061A2B]"
        }`}
      >
        {blog.authorName}
      </p>

      {blog.authorRole && (
        <p
          className={`mt-0.5 text-[10px] ${
            dark ? "text-[#A8BBC8]" : "text-[#526675]"
          }`}
        >
          {blog.authorRole}
        </p>
      )}
    </div>
  );
}

export default async function BlogPreview() {
  const blogs = await getHomepageBlogs();

  if (blogs.length === 0) {
    return null;
  }

  const featuredBlog = blogs[0];
  const secondaryBlogs = blogs.slice(1);

  return (
    <section
      id="blog"
      className="relative overflow-hidden bg-[#F8FAFC] text-[#061A2B]"
    >
      {/* Technical background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.032]"
        style={{
          backgroundImage:
            "linear-gradient(#061A2B 1px, transparent 1px), linear-gradient(90deg, #061A2B 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        {/* ================= HEADER ================= */}
        <div className="mb-10 flex flex-col gap-7 border-b border-[#061A2B]/10 pb-9 sm:mb-12 sm:pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#0D6E91]">
                From The Garage
              </span>
            </div>

            <p className="mt-4 font-mono text-[9px] tracking-[0.22em] text-[#526675]/60">
              GUIDES / ANSWERS / KNOWLEDGE
            </p>
          </div>

          <div className="max-w-2xl lg:text-right">
            <h2 className="text-[clamp(2.4rem,5vw,4.7rem)] font-semibold leading-[0.94] tracking-[-0.055em]">
              Useful knowledge.
              <span className="block text-[#0D6E91]">
                Nothing complicated.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-6 text-[#526675] sm:text-base sm:leading-7 lg:ml-auto">
              Practical guides and helpful information for understanding your
              vehicle and battery needs.
            </p>
          </div>
        </div>

        {/* ================= FEATURED ARTICLE ================= */}
        <Link
          href={`/blog/${featuredBlog.slug}`}
          className="group block overflow-hidden rounded-[1.75rem] border border-[#061A2B]/10 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(6,26,43,0.11)]"
        >
          <div className="grid lg:grid-cols-[0.98fr_1.02fr]">
            {/* Image */}
            <div className="relative h-[260px] overflow-hidden bg-[#061A2B] sm:h-[340px] lg:h-[390px]">
              <BlogImage
                blog={featuredBlog}
                priority
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#061A2B]/50 via-transparent to-transparent" />

              {/* Feature label */}
              <div className="absolute left-5 top-5 sm:left-7 sm:top-7">
                <span className="inline-flex items-center rounded-full bg-[#FFD400] px-3.5 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#061A2B]">
                  Featured Guide
                </span>
              </div>

              {/* Number */}
              <span className="absolute bottom-5 left-5 font-mono text-[10px] tracking-[0.2em] text-white/65 sm:bottom-7 sm:left-7">
                01
              </span>

              {/* Image arrow */}
              <span className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#F8FAFC] text-[#061A2B] transition-transform duration-300 group-hover:rotate-45 sm:bottom-7 sm:right-7">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 xl:p-12">
              <BlogMeta blog={featuredBlog} />

              <h3 className="mt-5 line-clamp-3 text-[clamp(1.65rem,3vw,2.65rem)] font-semibold leading-[1.08] tracking-[-0.04em] transition-colors duration-300 group-hover:text-[#0D6E91]">
                {featuredBlog.title}
              </h3>

              <p className="mt-4 line-clamp-3 max-w-xl text-sm leading-6 text-[#526675] sm:text-[15px] sm:leading-7">
                {featuredBlog.excerpt}
              </p>

              <div className="mt-7 flex items-center justify-between gap-5 border-t border-[#061A2B]/10 pt-5">
                <AuthorLine blog={featuredBlog} />

                <span className="inline-flex shrink-0 items-center gap-2 text-xs font-bold text-[#061A2B]">
                  Read Guide
                  <span className="text-[#0D6E91] transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* ================= SECONDARY ARTICLES ================= */}
        {secondaryBlogs.length > 0 && (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {secondaryBlogs.map((blog, index) => (
              <Link
                key={blog._id}
                href={`/blog/${blog.slug}`}
                className="group grid overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#08263D] text-[#F8FAFC] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(6,26,43,0.14)] sm:grid-cols-[0.75fr_1.25fr]"
              >
                {/* Small image */}
                <div className="relative h-[190px] overflow-hidden bg-[#061A2B] sm:h-full sm:min-h-[220px]">
                  <BlogImage blog={blog} />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#061A2B]/50 to-transparent" />

                  <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.2em] text-white/60">
                    {String(index + 2).padStart(2, "0")}
                  </span>
                </div>

                {/* Small content */}
                <div className="flex flex-col p-5 sm:p-6 lg:p-7">
                  <BlogMeta
                    blog={blog}
                    dark
                  />

                  <h3 className="mt-4 line-clamp-3 text-xl font-semibold leading-[1.12] tracking-[-0.03em] transition-colors duration-300 group-hover:text-[#FFD400] sm:text-2xl">
                    {blog.title}
                  </h3>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#A8BBC8]">
                    {blog.excerpt}
                  </p>

                  <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                    <AuthorLine
                      blog={blog}
                      dark
                    />

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-[#FFD400] transition-transform duration-300 group-hover:rotate-45">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ================= BOTTOM STRIP ================= */}
        <div className="mt-9 flex flex-col gap-5 border-t border-[#061A2B]/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#061A2B]">
              Want to learn more?
            </p>

            <p className="mt-1 text-xs text-[#526675]">
              Explore all our practical guides and articles.
            </p>
          </div>

          <Link
            href="/blog"
            className="group inline-flex min-h-12 items-center gap-4 self-start rounded-full border border-[#061A2B]/15 px-5 py-2.5 text-sm font-semibold text-[#061A2B] transition-all duration-300 hover:border-[#0D6E91]/40 hover:bg-[#061A2B]/[0.03]"
          >
            Explore All Guides

            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B] transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}