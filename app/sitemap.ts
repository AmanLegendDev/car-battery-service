
import type { MetadataRoute } from "next";

import { connectDB } from "@/lib/db";

import Blog from "@/models/Blog";
import Service from "@/models/Service";
import ServiceArea from "@/models/ServiceArea";

const SITE_URL = "https://www.mobilecarservices.com.au";

const SITE_ORIGIN = new URL(SITE_URL).origin;

export const dynamic = "force-dynamic";

/* ============================================================
   URL HELPERS
============================================================ */

function absoluteUrl(path: string): string {
  return new URL(
    path.startsWith("/") ? path : `/${path}`,
    SITE_URL,
  ).toString();
}

function getValidCanonicalUrl(
  canonicalUrl: unknown,
  fallbackPath: string,
): string {
  if (typeof canonicalUrl !== "string" || !canonicalUrl.trim()) {
    return absoluteUrl(fallbackPath);
  }

  try {
    const parsedUrl = new URL(canonicalUrl);

    const isValid =
      parsedUrl.protocol === "https:" &&
      parsedUrl.origin === SITE_ORIGIN &&
      !parsedUrl.username &&
      !parsedUrl.password &&
      !parsedUrl.search &&
      !parsedUrl.hash;

    return isValid
      ? parsedUrl.toString()
      : absoluteUrl(fallbackPath);
  } catch {
    return absoluteUrl(fallbackPath);
  }
}

/* ============================================================
   STATIC PUBLIC PAGES
============================================================ */

function getStaticPages(
  now: Date,
): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },

    {
      url: absoluteUrl("/services"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: absoluteUrl("/service-areas"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: absoluteUrl("/faqs"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: absoluteUrl("/testimonials"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: absoluteUrl("/blog"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    {
      url: absoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: absoluteUrl("/book-service"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },

    {
      url: absoluteUrl("/privacy-policy"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },

    {
      url: absoluteUrl("/terms-and-conditions"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}

/* ============================================================
   FINAL SITEMAP
============================================================ */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages = getStaticPages(now);

  try {
    await connectDB();

    /* --------------------------------------------------------
       FETCH ACTIVE SERVICES, AREAS AND INDEXABLE BLOGS
    -------------------------------------------------------- */

    const [services, serviceAreas, blogPosts] =
      await Promise.all([
        Service.find({
          status: "active",
        })
          .select("slug updatedAt")
          .sort({
            displayOrder: 1,
          })
          .lean(),

        ServiceArea.find({
          status: "active",
        })
          .select("slug updatedAt")
          .sort({
            displayOrder: 1,
          })
          .lean(),

        Blog.find({
          status: "published",

          noIndex: {
            $ne: true,
          },
        })
          .select(
            "slug updatedAt publishedAt canonicalUrl",
          )
          .sort({
            publishedAt: -1,
          })
          .lean(),
      ]);

    /* --------------------------------------------------------
       SERVICE DETAIL PAGES
    -------------------------------------------------------- */

    const servicePages: MetadataRoute.Sitemap =
      services
        .filter(
          (service) =>
            typeof service.slug === "string" &&
            service.slug.trim().length > 0,
        )
        .map((service) => ({
          url: absoluteUrl(
            `/services/${service.slug}`,
          ),

          lastModified:
            service.updatedAt ?? now,

          changeFrequency: "monthly",

          priority: 0.85,
        }));

    /* --------------------------------------------------------
       SERVICE AREA DETAIL PAGES
    -------------------------------------------------------- */

    const serviceAreaPages: MetadataRoute.Sitemap =
      serviceAreas
        .filter(
          (area) =>
            typeof area.slug === "string" &&
            area.slug.trim().length > 0,
        )
        .map((area) => ({
          url: absoluteUrl(
            `/service-areas/${area.slug}`,
          ),

          lastModified:
            area.updatedAt ?? now,

          changeFrequency: "monthly",

          priority: 0.8,
        }));

    /* --------------------------------------------------------
       BLOG DETAIL PAGES
    -------------------------------------------------------- */

    const blogPages: MetadataRoute.Sitemap =
      blogPosts
        .filter(
          (post) =>
            typeof post.slug === "string" &&
            post.slug.trim().length > 0,
        )
        .map((post) => ({
          url: getValidCanonicalUrl(
            post.canonicalUrl,
            `/blog/${post.slug}`,
          ),

          lastModified:
            post.updatedAt ??
            post.publishedAt ??
            now,

          changeFrequency: "monthly",

          priority: 0.75,
        }));

    /* --------------------------------------------------------
       COMBINE AND REMOVE DUPLICATE URLS
    -------------------------------------------------------- */

    const allPages = [
      ...staticPages,
      ...servicePages,
      ...serviceAreaPages,
      ...blogPages,
    ];

    const uniquePages = new Map<
      string,
      MetadataRoute.Sitemap[number]
    >();

    for (const page of allPages) {
      if (!uniquePages.has(page.url)) {
        uniquePages.set(page.url, page);
      }
    }

    return Array.from(uniquePages.values());
  } catch (error) {
    console.error(
      "Failed to generate sitemap:",
      error,
    );

    // Preserve static URLs if the database is unavailable.
    return staticPages;
  }
}
