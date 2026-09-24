import type { MetadataRoute } from "next";

import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import Service from "@/models/Service";
import ServiceArea from "@/models/ServiceArea";

const SITE_URL = "https://carbatteryservices.com.au";

export const dynamic = "force-dynamic";

function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
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
      url: absoluteUrl("/privacy"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },

    {
      url: absoluteUrl("/terms"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    await connectDB();

    const [services, serviceAreas, blogPosts] = await Promise.all([
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
        noIndex: false,
      })
        .select("slug updatedAt publishedAt canonicalUrl")
        .sort({
          publishedAt: -1,
        })
        .lean(),
    ]);

    const servicePages: MetadataRoute.Sitemap = services
      .filter((service) => Boolean(service.slug))
      .map((service) => ({
        url: absoluteUrl(`/services/${service.slug}`),
        lastModified: service.updatedAt ?? now,
        changeFrequency: "monthly" as const,
        priority: 0.85,
      }));

    const serviceAreaPages: MetadataRoute.Sitemap = serviceAreas
      .filter((area) => Boolean(area.slug))
      .map((area) => ({
        url: absoluteUrl(`/service-areas/${area.slug}`),
        lastModified: area.updatedAt ?? now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }));

    const blogPages: MetadataRoute.Sitemap = blogPosts
      .filter((post) => Boolean(post.slug))
      .map((post) => {
        const canonicalUrl =
          typeof post.canonicalUrl === "string" &&
          post.canonicalUrl.startsWith(SITE_URL)
            ? post.canonicalUrl
            : absoluteUrl(`/blog/${post.slug}`);

        return {
          url: canonicalUrl,
          lastModified:
            post.updatedAt ??
            post.publishedAt ??
            now,
          changeFrequency: "monthly" as const,
          priority: 0.75,
        };
      });

    return [
      ...staticPages,
      ...servicePages,
      ...serviceAreaPages,
      ...blogPages,
    ];
  } catch (error) {
    console.error(
      "Failed to generate sitemap:",
      error
    );

    return staticPages;
  }
}