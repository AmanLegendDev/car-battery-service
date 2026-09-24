import type { Metadata } from "next";

import { connectDB } from "@/lib/db";

import Blog, {
  type BlogStatus,
} from "@/models/Blog";

import SiteSettings from "@/models/SiteSettings";

import BlogListingPage from "@/components/blog/listing/BlogListingPage";

export const dynamic = "force-dynamic";

const SITE_URL =
  "https://carbatteryservices.com.au";

const POSTS_PER_PAGE = 6;

const DEFAULT_TITLE =
  "Blog | Car Battery Service";

const DEFAULT_DESCRIPTION =
  "Practical information about car batteries, battery replacement, battery testing, jump start assistance, starter motors and alternators from Car Battery Service.";

const OG_IMAGE =
  "/images/seo/blog-og.jpg";

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
      DEFAULT_TITLE,

    description:
      settings?.defaultSiteDescription ||
      DEFAULT_DESCRIPTION,
  };
}

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const [settings, params] =
    await Promise.all([
      getSiteSettings(),
      searchParams,
    ]);

  const rawPage =
    Number.parseInt(
      params.page || "1",
      10,
    );

  const currentPage =
    Number.isFinite(rawPage) &&
    rawPage > 0
      ? rawPage
      : 1;

  const isPaginated =
    currentPage > 1;

  const title = isPaginated
    ? `${settings.title} - Page ${currentPage}`
    : settings.title;

  const description =
    settings.description ||
    DEFAULT_DESCRIPTION;

  const canonicalUrl = isPaginated
    ? `${SITE_URL}/blog?page=${currentPage}`
    : `${SITE_URL}/blog`;

  return {
    title,

    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: "website",

      locale: "en_AU",

      url: canonicalUrl,

      siteName:
        settings.businessName,

      title,

      description,

      images: [
        {
          url: OG_IMAGE,

          width: 1200,

          height: 630,

          alt:
            "Car Battery Service Blog - Melbourne West",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title,

      description,

      images: [
        OG_IMAGE,
      ],
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

  const skip =
    (page - 1) *
    POSTS_PER_PAGE;

  const filter: {
    status: BlogStatus;
    noIndex: boolean;
  } = {
    status: "published",
    noIndex: false,
  };

  const [
    posts,
    totalPosts,
  ] = await Promise.all([
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
      title:
        post.title,

      slug:
        post.slug,

      excerpt:
        post.excerpt || "",

      coverImage:
        post.coverImage
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
        Boolean(
          post.featured,
        ),

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
        post.readingTime ??
        null,

      displayOrder:
        post.displayOrder ??
        0,
    })),

    totalPosts,
  };
}

function getBlogStructuredData({
  businessName,
  description,
  posts,
  currentPage,
}: {
  businessName: string;
  description: string;
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

  const itemList = posts.map(
    (post, index) => {
      const articleUrl =
        `${SITE_URL}/blog/${post.slug}`;

      return {
        "@type": "ListItem",

        position:
          index + 1,

        url: articleUrl,

        item: {
          "@type": "Article",

          "@id":
            `${articleUrl}#article`,

          url: articleUrl,

          headline:
            post.title,

          description:
            post.excerpt ||
            undefined,

          ...(post.coverImage
            ? {
                image: [
                  post.coverImage
                    .secureUrl,
                ],
              }
            : {}),

          ...(post.publishedAt
            ? {
                datePublished:
                  post.publishedAt,
              }
            : {}),

          ...(post.authorName
            ? {
                author: {
                  "@type":
                    "Person",

                  name:
                    post.authorName,
                },
              }
            : {}),

          publisher: {
            "@id":
              `${SITE_URL}/#organization`,
          },

          mainEntityOfPage: {
            "@type":
              "WebPage",

            "@id":
              articleUrl,
          },

          inLanguage:
            "en-AU",
        },
      };
    },
  );

  return {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "CollectionPage",

        "@id":
          `${blogUrl}#webpage`,

        url:
          blogUrl,

        name:
          currentPage > 1
            ? `${businessName} Blog - Page ${currentPage}`
            : `${businessName} Blog`,

        description,

        isPartOf: {
          "@id":
            `${SITE_URL}/#website`,
        },

        about: {
          "@id":
            `${SITE_URL}/#organization`,
        },

        publisher: {
          "@id":
            `${SITE_URL}/#organization`,
        },

        inLanguage:
          "en-AU",
      },

      {
        "@type":
          "ItemList",

        "@id":
          `${blogUrl}#itemlist`,

        name:
          "Car Battery Service Blog Articles",

        numberOfItems:
          posts.length,

        itemListElement:
          itemList,
      },

      {
        "@type":
          "BreadcrumbList",

        "@id":
          `${blogUrl}#breadcrumb`,

        itemListElement: [
          {
            "@type":
              "ListItem",

            position: 1,

            name: "Home",

            item:
              SITE_URL,
          },

          {
            "@type":
              "ListItem",

            position: 2,

            name: "Blog",

            item:
              `${SITE_URL}/blog`,
          },

          ...(currentPage > 1
            ? [
                {
                  "@type":
                    "ListItem",

                  position: 3,

                  name:
                    `Page ${currentPage}`,

                  item:
                    blogUrl,
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
  const params =
    await searchParams;

  const rawPage =
    Number.parseInt(
      params.page || "1",
      10,
    );

  const currentPage =
    Number.isFinite(rawPage) &&
    rawPage > 0
      ? rawPage
      : 1;

  const {
    posts,
    totalPosts,
  } =
    await getBlogPosts(
      currentPage,
    );

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalPosts /
          POSTS_PER_PAGE,
      ),
    );

  const settings =
    await getSiteSettings();

  const structuredData =
    getBlogStructuredData({
      businessName:
        settings.businessName,

      description:
        settings.description,

      posts,

      currentPage,
    });

  return (
    <>
      <main>
        <BlogListingPage
          posts={posts}
          currentPage={
            currentPage
          }
          totalPages={
            totalPages
          }
          totalPosts={
            totalPosts
          }
        />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              structuredData,
            ),
        }}
      />
    </>
  );
}