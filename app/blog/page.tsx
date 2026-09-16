import type { Metadata } from "next";

import { connectDB } from "@/lib/db";

import Blog, {
  type BlogStatus,
} from "@/models/Blog";

import SiteSettings from "@/models/SiteSettings";

import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";
import FloatingCallButton from "@/components/layout/floating-call/FloatingCallButton";

import BlogListingPage from "@/components/blog/listing/BlogListingPage";

export const dynamic = "force-dynamic";

const POSTS_PER_PAGE = 6;

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

async function getSiteSettings() {
  await connectDB();

  const settings = await SiteSettings.findOne()
    .select(
      "businessName tagline defaultSiteTitle defaultSiteDescription",
    )
    .lean();

  return {
    businessName:
      settings?.businessName ||
      "Car Battery Service",

    tagline:
      settings?.tagline ||
      "Mobile Car Battery Assistance in Melbourne West",

    title:
      settings?.defaultSiteTitle ||
      "Blog | Car Battery Service",

    description:
      settings?.defaultSiteDescription ||
      "Practical information about car batteries, battery replacement, battery testing and jump start assistance.",
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: settings.title,
    description: settings.description,

    alternates: {
      canonical: "/blog",
    },

    openGraph: {
      title: settings.title,
      description: settings.description,
      url: "/blog",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: settings.title,
      description: settings.description,
    },
  };
}

async function getBlogPosts(page: number) {
  await connectDB();

  const skip = (page - 1) * POSTS_PER_PAGE;

  const filter: {
    status: BlogStatus;
    noIndex: boolean;
  } = {
    status: "published",
    noIndex: false,
  };

  const [posts, totalPosts] =
    await Promise.all([
      Blog.find(filter)
        .select(
          [
            "title",
            "slug",
            "excerpt",
            "coverImage",
            "category",
            "tags",
            "featured",
            "publishedAt",
            "authorName",
            "authorRole",
            "readingTime",
            "displayOrder",
          ].join(" "),
        )
        .sort({
          featured: -1,
          publishedAt: -1,
          displayOrder: 1,
        })
        .skip(skip)
        .limit(POSTS_PER_PAGE)
        .lean(),

      Blog.countDocuments(filter),
    ]);

  return {
    posts: posts.map((post) => ({
      title: post.title,

      slug: post.slug,

      excerpt: post.excerpt || "",

      coverImage: post.coverImage
        ? {
            publicId:
              post.coverImage.publicId,

            secureUrl:
              post.coverImage.secureUrl,

            width:
              post.coverImage.width,

            height:
              post.coverImage.height,

            format:
              post.coverImage.format,

            bytes:
              post.coverImage.bytes,

            resourceType:
              post.coverImage.resourceType,

            alt:
              post.coverImage.alt,
          }
        : null,

      category:
        post.category || "",

      tags:
        Array.isArray(post.tags)
          ? post.tags
          : [],

      featured:
        Boolean(post.featured),

      publishedAt:
        post.publishedAt
          ? new Date(
              post.publishedAt,
            ).toISOString()
          : null,

      authorName:
        post.authorName || "",

      authorRole:
        post.authorRole || "",

      readingTime:
        post.readingTime ?? null,

      displayOrder:
        post.displayOrder ?? 0,
    })),

    totalPosts,
  };
}

export default async function BlogPage({
  searchParams,
}: BlogPageProps) {
  const params = await searchParams;

  const rawPage = Number.parseInt(
    params.page || "1",
    10,
  );

  const currentPage =
    Number.isFinite(rawPage) && rawPage > 0
      ? rawPage
      : 1;

  const {
    posts,
    totalPosts,
  } = await getBlogPosts(currentPage);

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalPosts / POSTS_PER_PAGE,
    ),
  );

  return (
    <>
      <Navbar />

      <main>
        <BlogListingPage
          posts={posts}
          currentPage={currentPage}
          totalPages={totalPages}
          totalPosts={totalPosts}
        />
      </main>

      <Footer />

      <FloatingCallButton />
    </>
  );
}