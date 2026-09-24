import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { connectDB } from "@/lib/db";

import Blog from "@/models/Blog";
import Service from "@/models/Service";
import ServiceArea from "@/models/ServiceArea";
import SiteSettings from "@/models/SiteSettings";

import BlogDetailPage from "@/components/blog/detail/BlogDetailPage";

export const dynamic = "force-dynamic";

const SITE_URL =
  "https://carbatteryservices.com.au";

const BLOG_RELATED_POST_LIMIT = 6;
const BLOG_RELATED_SERVICE_LIMIT = 3;
const BLOG_RELATED_AREA_LIMIT = 4;

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getBlogPost(slug: string) {
  await connectDB();

  const post = await Blog.findOne({
    slug,
    status: "published",
    noIndex: false,
  })
    .select(
      [
        "title",
        "slug",
        "excerpt",
        "content",
        "coverImage",
        "ogImage",
        "authorName",
        "authorRole",
        "authorImage",
        "category",
        "tags",
        "featured",
        "publishedAt",
        "readingTime",
        "displayOrder",
        "seoTitle",
        "seoDescription",
        "canonicalUrl",
        "noIndex",
        "ogTitle",
        "ogDescription",
        "relatedServices",
        "relatedServiceAreas",
        "createdAt",
        "updatedAt",
      ].join(" "),
    )
    .lean();

  if (!post) {
    return null;
  }

  return post;
}

async function getSiteSettings() {
  await connectDB();

  const settings = await SiteSettings.findOne()
    .select(
      "businessName phone primaryCallNumber whatsapp primaryServiceRegion",
    )
    .lean();

  return {
    businessName:
      settings?.businessName ||
      "Car Battery Service",

    phone:
      settings?.primaryCallNumber ||
      settings?.phone ||
      "",

    whatsapp:
      settings?.whatsapp ||
      settings?.primaryCallNumber ||
      "",

    primaryServiceRegion:
      settings?.primaryServiceRegion ||
      "Melbourne West",
  };
}

async function getRelatedBlogPosts(
  currentSlug: string,
  category: string,
  tags: string[],
) {
  await connectDB();

  const orConditions: Record<
    string,
    unknown
  >[] = [];

  if (category) {
    orConditions.push({
      category,
    });
  }

  if (tags.length > 0) {
    orConditions.push({
      tags: {
        $in: tags,
      },
    });
  }

  const query: Record<
    string,
    unknown
  > = {
    status: "published",
    noIndex: false,
    slug: {
      $ne: currentSlug,
    },
  };

  if (orConditions.length > 0) {
    query.$or = orConditions;
  }

  const posts = await Blog.find(query)
    .select(
      [
        "title",
        "slug",
        "excerpt",
        "coverImage",
        "category",
        "publishedAt",
        "readingTime",
        "featured",
      ].join(" "),
    )
    .sort({
      featured: -1,
      publishedAt: -1,
      displayOrder: 1,
    })
    .limit(BLOG_RELATED_POST_LIMIT)
    .lean();

  return posts.map((post) => ({
    title: post.title,

    slug: post.slug,

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

    publishedAt:
      post.publishedAt
        ? new Date(
            post.publishedAt,
          ).toISOString()
        : null,

    readingTime:
      post.readingTime ?? null,
  }));
}

async function getRelatedServices(
  relatedServiceIds: unknown[],
) {
  await connectDB();

  if (
    !Array.isArray(
      relatedServiceIds,
    ) ||
    relatedServiceIds.length === 0
  ) {
    return [];
  }

  const validIds = relatedServiceIds
    .filter(
      (value) => value != null,
    )
    .map((value) =>
      String(value),
    )
    .filter(Boolean);

  if (validIds.length === 0) {
    return [];
  }

  const services =
    await Service.find({
      _id: {
        $in: validIds,
      },

      status: "active",
    })
      .select(
        [
          "title",
          "slug",
          "shortDescription",
          "heroImage",
          "estimatedTime",
          "emergencyService",
          "onSiteService",
          "featured",
          "displayOrder",
        ].join(" "),
      )
      .sort({
        featured: -1,
        displayOrder: 1,
        title: 1,
      })
      .limit(
        BLOG_RELATED_SERVICE_LIMIT,
      )
      .lean();

  return services.map(
    (service) => ({
      title: service.title,

      slug: service.slug,

      shortDescription:
        service.shortDescription ||
        "",

      heroImage:
        service.heroImage
          ? {
              publicId:
                service.heroImage.publicId,

              secureUrl:
                service.heroImage.secureUrl,

              width:
                service.heroImage.width,

              height:
                service.heroImage.height,

              format:
                service.heroImage.format,

              bytes:
                service.heroImage.bytes,

              resourceType:
                service.heroImage.resourceType,

              alt:
                service.heroImage.alt,
            }
          : null,

      estimatedTime:
        service.estimatedTime ||
        "",

      emergencyService:
        Boolean(
          service.emergencyService,
        ),

      onSiteService:
        Boolean(
          service.onSiteService,
        ),
    }),
  );
}

async function getRelatedServiceAreas(
  relatedServiceAreaIds: unknown[],
) {
  await connectDB();

  if (
    !Array.isArray(
      relatedServiceAreaIds,
    ) ||
    relatedServiceAreaIds.length === 0
  ) {
    return [];
  }

  const validIds = relatedServiceAreaIds
    .filter(
      (value) => value != null,
    )
    .map((value) =>
      String(value),
    )
    .filter(Boolean);

  if (validIds.length === 0) {
    return [];
  }

  const areas =
    await ServiceArea.find({
      _id: {
        $in: validIds,
      },

      status: "active",
    })
      .select(
        [
          "name",
          "slug",
          "shortDescription",
          "heroImage",
          "featured",
          "displayOrder",
        ].join(" "),
      )
      .sort({
        featured: -1,
        displayOrder: 1,
        name: 1,
      })
      .limit(
        BLOG_RELATED_AREA_LIMIT,
      )
      .lean();

  return areas.map(
    (area) => ({
      name: area.name,

      slug: area.slug,

      shortDescription:
        area.shortDescription ||
        "",

      heroImage:
        area.heroImage
          ? {
              publicId:
                area.heroImage.publicId,

              secureUrl:
                area.heroImage.secureUrl,

              width:
                area.heroImage.width,

              height:
                area.heroImage.height,

              format:
                area.heroImage.format,

              bytes:
                area.heroImage.bytes,

              resourceType:
                area.heroImage.resourceType,

              alt:
                area.heroImage.alt,
            }
          : null,
    }),
  );
}

function getAbsoluteUrl(
  value: string,
  fallback: string,
) {
  if (!value) {
    return `${SITE_URL}${fallback}`;
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  return `${SITE_URL}${
    value.startsWith("/")
      ? value
      : `/${value}`
  }`;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } =
    await params;

  const post =
    await getBlogPost(slug);

  if (!post) {
    return {
      title:
        "Article Not Found | Car Battery Service",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title =
    post.seoTitle ||
    post.ogTitle ||
    post.title;

  const description =
    post.seoDescription ||
    post.ogDescription ||
    post.excerpt;

  const canonical =
    getAbsoluteUrl(
      post.canonicalUrl,
      `/blog/${post.slug}`,
    );

  const image =
    post.ogImage?.secureUrl ||
    post.coverImage?.secureUrl;

  return {
    title,

    description,

    robots: post.noIndex
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },

    alternates: {
      canonical,
    },

    openGraph: {
      title,

      description,

      url: canonical,

      type: "article",

      publishedTime:
        post.publishedAt
          ? new Date(
              post.publishedAt,
            ).toISOString()
          : undefined,

      modifiedTime:
        post.updatedAt
          ? new Date(
              post.updatedAt,
            ).toISOString()
          : undefined,

      authors:
        post.authorName
          ? [post.authorName]
          : undefined,

      section:
        post.category ||
        undefined,

      tags:
        Array.isArray(
          post.tags,
        ) &&
        post.tags.length > 0
          ? post.tags
          : undefined,

      images: image
        ? [
            {
              url: image,

              width:
                post.ogImage?.width ||
                post.coverImage?.width,

              height:
                post.ogImage?.height ||
                post.coverImage?.height,

              alt:
                post.ogImage?.alt ||
                post.coverImage?.alt ||
                post.title,
            },
          ]
        : undefined,
    },

    twitter: {
      card:
        "summary_large_image",

      title,

      description,

      images: image
        ? [image]
        : undefined,
    },
  };
}

function getArticleStructuredData({
  post,
  business,
  canonicalUrl,
  articleImage,
}: {
  post: any;
  business: {
    businessName: string;
  };
  canonicalUrl: string;
  articleImage?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
}) {
  const articleId =
    `${canonicalUrl}#article`;

  const webpageId =
    `${canonicalUrl}#webpage`;

  const breadcrumbId =
    `${canonicalUrl}#breadcrumb`;

  const schemaGraph: Record<
    string,
    unknown
  >[] = [
    {
      "@type":
        "BlogPosting",

      "@id":
        articleId,

      headline:
        post.title,

      description:
        post.seoDescription ||
        post.ogDescription ||
        post.excerpt ||
        undefined,

      url:
        canonicalUrl,

      mainEntityOfPage: {
        "@id":
          webpageId,
      },

      ...(articleImage
        ? {
            image: [
              {
                "@type":
                  "ImageObject",

                url:
                  articleImage.url,

                ...(articleImage.width
                  ? {
                      width:
                        articleImage.width,
                    }
                  : {}),

                ...(articleImage.height
                  ? {
                      height:
                        articleImage.height,
                    }
                  : {}),

                ...(articleImage.alt
                  ? {
                      caption:
                        articleImage.alt,
                    }
                  : {}),
              },
            ],
          }
        : {}),

      ...(post.publishedAt
        ? {
            datePublished:
              new Date(
                post.publishedAt,
              ).toISOString(),
          }
        : {}),

      ...(post.updatedAt
        ? {
            dateModified:
              new Date(
                post.updatedAt,
              ).toISOString(),
          }
        : {}),

      ...(post.authorName
        ? {
            author: {
              "@type":
                "Person",

              name:
                post.authorName,

              ...(post.authorRole
                ? {
                    jobTitle:
                      post.authorRole,
                  }
                : {}),

              ...(post.authorImage?.secureUrl
                ? {
                    image:
                      post.authorImage
                        .secureUrl,
                  }
                : {}),
            },
          }
        : {}),

      publisher: {
        "@id":
          `${SITE_URL}/#organization`,
      },

      ...(post.category
        ? {
            articleSection:
              post.category,
          }
        : {}),

      ...(Array.isArray(
        post.tags,
      ) &&
      post.tags.length > 0
        ? {
            keywords:
              post.tags.join(", "),
          }
        : {}),

      ...(post.readingTime
        ? {
            timeRequired:
              `PT${post.readingTime}M`,
          }
        : {}),

      inLanguage:
        "en-AU",
    },

    {
      "@type":
        "WebPage",

      "@id":
        webpageId,

      url:
        canonicalUrl,

      name:
        post.seoTitle ||
        post.title,

      description:
        post.seoDescription ||
        post.ogDescription ||
        post.excerpt ||
        undefined,

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

      ...(articleImage
        ? {
            primaryImageOfPage: {
              "@id":
                `${canonicalUrl}#primaryimage`,
            },
          }
        : {}),

      breadcrumb: {
        "@id":
          breadcrumbId,
      },

      inLanguage:
        "en-AU",
    },

    ...(articleImage
      ? [
          {
            "@type":
              "ImageObject",

            "@id":
              `${canonicalUrl}#primaryimage`,

            url:
              articleImage.url,

            ...(articleImage.width
              ? {
                  width:
                    articleImage.width,
                }
              : {}),

            ...(articleImage.height
              ? {
                  height:
                    articleImage.height,
                }
              : {}),

            ...(articleImage.alt
              ? {
                  caption:
                    articleImage.alt,
                }
              : {}),
          },
        ]
      : []),

    {
      "@type":
        "BreadcrumbList",

      "@id":
        breadcrumbId,

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

        {
          "@type":
            "ListItem",

          position: 3,

          name:
            post.title,

          item:
            canonicalUrl,
        },
      ],
    },
  ];

  return {
    "@context":
      "https://schema.org",

    "@graph":
      schemaGraph,
  };
}

export default async function BlogArticlePage({
  params,
}: BlogPageProps) {
  const { slug } =
    await params;

  const post =
    await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const [
    relatedPosts,
    relatedServices,
    relatedServiceAreas,
    business,
  ] = await Promise.all([
    getRelatedBlogPosts(
      post.slug,
      post.category || "",
      Array.isArray(post.tags)
        ? post.tags
        : [],
    ),

    getRelatedServices(
      Array.isArray(
        post.relatedServices,
      )
        ? post.relatedServices
        : [],
    ),

    getRelatedServiceAreas(
      Array.isArray(
        post.relatedServiceAreas,
      )
        ? post.relatedServiceAreas
        : [],
    ),

    getSiteSettings(),
  ]);

  const normalizedPost = {
    title:
      post.title,

    slug:
      post.slug,

    excerpt:
      post.excerpt || "",

    content:
      post.content || "",

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

    ogImage:
      post.ogImage
        ? {
            publicId:
              post.ogImage.publicId,

            secureUrl:
              post.ogImage.secureUrl,

            width:
              post.ogImage.width,

            height:
              post.ogImage.height,

            format:
              post.ogImage.format,

            bytes:
              post.ogImage.bytes,

            resourceType:
              post.ogImage.resourceType,

            alt:
              post.ogImage.alt,
          }
        : null,

    authorName:
      post.authorName || "",

    authorRole:
      post.authorRole || "",

    authorImage:
      post.authorImage
        ? {
            publicId:
              post.authorImage.publicId,

            secureUrl:
              post.authorImage.secureUrl,

            width:
              post.authorImage.width,

            height:
              post.authorImage.height,

            format:
              post.authorImage.format,

            bytes:
              post.authorImage.bytes,

            resourceType:
              post.authorImage.resourceType,

            alt:
              post.authorImage.alt,
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

    readingTime:
      post.readingTime ?? null,

    seoTitle:
      post.seoTitle || "",

    seoDescription:
      post.seoDescription || "",

    canonicalUrl:
      post.canonicalUrl || "",

    noIndex:
      Boolean(post.noIndex),

    ogTitle:
      post.ogTitle || "",

    ogDescription:
      post.ogDescription || "",

    relatedServices,

    relatedServiceAreas,

    relatedProjects: [],
  };

  const canonicalUrl =
    getAbsoluteUrl(
      post.canonicalUrl,
      `/blog/${post.slug}`,
    );

  const articleImageUrl =
    post.ogImage?.secureUrl ||
    post.coverImage?.secureUrl;

  const articleImage =
    articleImageUrl
      ? {
          url:
            articleImageUrl,

          width:
            post.ogImage?.width ||
            post.coverImage?.width,

          height:
            post.ogImage?.height ||
            post.coverImage?.height,

          alt:
            post.ogImage?.alt ||
            post.coverImage?.alt ||
            post.title,
        }
      : undefined;

  const articleSchema =
    getArticleStructuredData({
      post,

      business,

      canonicalUrl,

      articleImage,
    });

  return (
    <>
      <main>
     <BlogDetailPage
  post={normalizedPost}
  relatedPosts={relatedPosts}
  business={business}
/>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              articleSchema,
            ),
        }}
      />
    </>
  );
}