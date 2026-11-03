
import type { Metadata } from "next";

import { connectDB } from "@/lib/db";

import Blog, {
  type BlogStatus,
} from "@/models/Blog";

import BlogListingPage from "@/components/blog/listing/BlogListingPage";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.mobilecarservices.com.au";

const POSTS_PER_PAGE = 6;

const SEO_TITLE =
  "Car Battery Tips & Guides | Mobile Car Services Blog";

const SEO_DESCRIPTION =
  "Practical car battery tips and guides covering battery replacement, battery testing, jump starts, starter motors and alternators in Melbourne West.";

const OG_IMAGE =
  `${SITE_URL}/images/seo/blog-og.jpg`;

interface BlogPageProps {
  searchParams: Promise<{
    page?: string | string[];
  }>;
}

function getCurrentPage(pageParam?: string | string[]) {
  const value = Array.isArray(pageParam)
    ? pageParam[0]
    : pageParam;

  if (!value || !/^\d+$/.test(value)) {
    return 1;
  }

  const page = Number(value);

  return Number.isSafeInteger(page) && page > 0
    ? page
    : 1;
}

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const params = await searchParams;

  const currentPage = getCurrentPage(params.page);

  const isPaginated = currentPage > 1;

  const title = isPaginated
    ? `${SEO_TITLE} - Page ${currentPage}`
    : SEO_TITLE;

  const canonicalUrl = isPaginated
    ? `${SITE_URL}/blog?page=${currentPage}`
    : `${SITE_URL}/blog`;

  return {
    title: {
      absolute: title,
    },

    description: SEO_DESCRIPTION,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: "website",
      locale: "en_AU",
      url: canonicalUrl,
      siteName: "Mobile Car Services",
      title,
      description: SEO_DESCRIPTION,

      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Car Battery Tips and Guides - Mobile Car Services Blog",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description: SEO_DESCRIPTION,
      images: [OG_IMAGE],
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
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

  const [posts, totalPosts] = await Promise.all([
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
            publicId: post.coverImage.publicId,
            secureUrl: post.coverImage.secureUrl,
            width: post.coverImage.width,
            height: post.coverImage.height,
            format: post.coverImage.format,
            bytes: post.coverImage.bytes,
            resourceType: post.coverImage.resourceType,
            alt: post.coverImage.alt,
          }
        : null,

      category: post.category || "",

      tags: Array.isArray(post.tags)
        ? post.tags
        : [],

      featured: Boolean(post.featured),

      publishedAt: post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : null,

      authorName: post.authorName || "",

      authorRole: post.authorRole || "",

      readingTime: post.readingTime ?? null,

      displayOrder: post.displayOrder ?? 0,
    })),

    totalPosts,
  };
}

function getBlogStructuredData({
  posts,
  currentPage,
}: {
  posts: Array<{
    title: string;
    slug: string;
    excerpt: string;
    coverImage: {
      secureUrl: string;
      width: number;
      height: number;
      alt: string;
    } | null;
    publishedAt: string | null;
    authorName: string;
  }>;

  currentPage: number;
}) {
  const blogUrl =
    currentPage > 1
      ? `${SITE_URL}/blog?page=${currentPage}`
      : `${SITE_URL}/blog`;

  const itemList = posts.map((post, index) => {
    const articleUrl = `${SITE_URL}/blog/${post.slug}`;

    const position =
      (currentPage - 1) * POSTS_PER_PAGE + index + 1;

    return {
      "@type": "ListItem",

      position,

      url: articleUrl,

      item: {
        "@type": "BlogPosting",

        "@id": `${articleUrl}#article`,

        url: articleUrl,

        headline: post.title,

        ...(post.excerpt
          ? {
              description: post.excerpt,
            }
          : {}),

        ...(post.coverImage?.secureUrl
          ? {
              image: [post.coverImage.secureUrl],
            }
          : {}),

        ...(post.publishedAt
          ? {
              datePublished: post.publishedAt,
            }
          : {}),

        ...(post.authorName
          ? {
              author: {
                "@type": "Person",
                name: post.authorName,
              },
            }
          : {}),

        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },

        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },

        inLanguage: "en-AU",
      },
    };
  });

  return {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "CollectionPage",

        "@id": `${blogUrl}#webpage`,

        url: blogUrl,

        name:
          currentPage > 1
            ? `${SEO_TITLE} - Page ${currentPage}`
            : SEO_TITLE,

        description: SEO_DESCRIPTION,

        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },

        about: {
          "@id": `${SITE_URL}/#organization`,
        },

        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },

        inLanguage: "en-AU",
      },

      {
        "@type": "ItemList",

        "@id": `${blogUrl}#itemlist`,

        name: "Mobile Car Services Blog Articles",

        numberOfItems: posts.length,

        itemListElement: itemList,
      },

      {
        "@type": "BreadcrumbList",

        "@id": `${blogUrl}#breadcrumb`,

        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },

          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${SITE_URL}/blog`,
          },

          ...(currentPage > 1
            ? [
                {
                  "@type": "ListItem",
                  position: 3,
                  name: `Page ${currentPage}`,
                  item: blogUrl,
                },
              ]
            : []),
        ],
      },
    ],
  };
}

export default async function BlogPage({
  searchParams,
}: BlogPageProps) {
  const params = await searchParams;

  const currentPage = getCurrentPage(params.page);

  const {
    posts,
    totalPosts,
  } = await getBlogPosts(currentPage);

  const totalPages = Math.max(
    1,
    Math.ceil(totalPosts / POSTS_PER_PAGE),
  );

  const structuredData = getBlogStructuredData({
    posts,
    currentPage,
  });

  const safeStructuredData = JSON.stringify(
    structuredData,
  ).replace(/</g, "\\u003c");

  return (
    <>
      <main>
        <BlogListingPage
          posts={posts}
          currentPage={currentPage}
          totalPages={totalPages}
          totalPosts={totalPosts}
        />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeStructuredData,
        }}
      />
    </>
  );
}
