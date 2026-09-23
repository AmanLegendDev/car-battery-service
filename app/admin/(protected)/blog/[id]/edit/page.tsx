import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowLeft, FileText } from "lucide-react";

import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";

import BlogForm, {
  type BlogFormData,
} from "@/components/admin/blog/BlogForm";

export const metadata: Metadata = {
  title: "Edit Blog Post | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface EditBlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

function mapMedia(
  media:
    | {
        publicId?: string;
        secureUrl?: string;
        width?: number;
        height?: number;
        format?: string;
        bytes?: number;
        resourceType?: "image";
        alt?: string;
      }
    | null
    | undefined
) {
  if (!media?.publicId || !media.secureUrl) {
    return null;
  }

  return {
    publicId: media.publicId,
    secureUrl: media.secureUrl,
    width: Number(media.width ?? 0),
    height: Number(media.height ?? 0),
    format: String(media.format ?? ""),
    bytes: Number(media.bytes ?? 0),
    resourceType: "image" as const,
    alt: String(media.alt ?? ""),
  };
}

export default async function EditBlogPage({
  params,
}: EditBlogPageProps) {
  const { id } = await params;

  // Prevent invalid MongoDB ObjectId errors.
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    notFound();
  }

  await connectDB();

  const blog = await Blog.findById(id)
    .select(
      [
        "title",
        "slug",
        "excerpt",
        "content",
        "coverImage",
        "authorName",
        "authorRole",
        "authorImage",
        "category",
        "tags",
        "status",
        "featured",
        "publishedAt",
        "scheduledAt",
        "displayOrder",
        "seoTitle",
        "seoDescription",
        "canonicalUrl",
        "noIndex",
        "ogTitle",
        "ogDescription",
        "ogImage",
        "relatedServices",
        "relatedServiceAreas",
      ].join(" ")
    )
    .lean();

  if (!blog) {
    notFound();
  }

  const initialData: Partial<BlogFormData> = {
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    content: blog.content,

    coverImage: mapMedia(blog.coverImage),

    authorName: blog.authorName,
    authorRole: blog.authorRole,
    authorImage: mapMedia(blog.authorImage),

    category: blog.category,
    tags: blog.tags ?? [],

    status: blog.status,
    featured: blog.featured,

    publishedAt: blog.publishedAt
      ? blog.publishedAt.toISOString()
      : "",

    scheduledAt: blog.scheduledAt
      ? blog.scheduledAt.toISOString()
      : "",

    displayOrder: String(blog.displayOrder ?? 0),

    seoTitle: blog.seoTitle ?? "",
    seoDescription: blog.seoDescription ?? "",
    canonicalUrl: blog.canonicalUrl ?? "",
    noIndex: Boolean(blog.noIndex),

    ogTitle: blog.ogTitle ?? "",
    ogDescription: blog.ogDescription ?? "",
    ogImage: mapMedia(blog.ogImage),

    relatedServices: (blog.relatedServices ?? []).map(
      String
    ),

    relatedServiceAreas: (
      blog.relatedServiceAreas ?? []
    ).map(String),
  };

  return (
    <main className="min-h-screen bg-[#061A2B] text-[#F8FAFC]">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        {/* PAGE HEADER */}
        <div className="mb-7">
          <Link
            href="/admin/blog"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#A8BBC8] transition hover:text-[#FFD400]"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFD400] text-[#061A2B] shadow-lg shadow-[#FFD400]/10">
                <FileText size={21} />
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFD400]">
                  Blog CMS
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#F8FAFC] sm:text-3xl">
                  Edit Blog Post
                </h1>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-[#A8BBC8]">
                  Update article content, media, publishing settings and SEO
                  information.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* EDIT MODE */}
        <BlogForm
          mode="edit"
          blogId={id}
          initialData={initialData}
        />
      </div>
    </main>
  );
}