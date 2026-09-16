import BlogArticleContent from "./article/BlogArticleContent";
import BlogArticleHero from "./hero/BlogArticleHero";
import BlogAuthorCard from "./author/BlogAuthorCard";
import RelatedBlogPosts from "./related/RelatedBlogPosts";
import RelatedServices from "./services/RelatedServices";
import BlogArticleCTA from "./cta/BlogArticleCTA";

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

interface BlogDetailPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;

  coverImage: BlogMedia | null;
  ogImage: BlogMedia | null;

  authorName: string;
  authorRole: string;
  authorImage: BlogMedia | null;

  category: string;
  tags: string[];

  featured: boolean;

  publishedAt: string | null;
  readingTime: number | null;

  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  noIndex: boolean;

  ogTitle: string;
  ogDescription: string;

  relatedServices: Array<{
    title: string;
    slug: string;
    shortDescription: string;
    heroImage: BlogMedia | null;
    estimatedTime: string;
    emergencyService: boolean;
    onSiteService: boolean;
  }>;

  relatedServiceAreas: Array<{
    name: string;
    slug: string;
    shortDescription: string;
    heroImage: BlogMedia | null;
  }>;

  relatedProjects: unknown[];
}

interface RelatedBlogPost {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: BlogMedia | null;
  category: string;
  publishedAt: string | null;
  readingTime: number | null;
}

interface BlogDetailPageProps {
  post: BlogDetailPost;

  relatedPosts: RelatedBlogPost[];

  business: {
    businessName: string;
    phone: string;
    whatsapp: string;
    primaryServiceRegion: string;
  };
}

export default function BlogDetailPage({
  post,
  relatedPosts,
  business,
}: BlogDetailPageProps) {
  return (
    <>
      <BlogArticleHero post={post} />

      <BlogArticleContent
        content={post.content}
      />

      <BlogAuthorCard
        authorName={post.authorName}
        authorRole={post.authorRole}
        authorImage={post.authorImage}
      />

      <RelatedServices
        services={post.relatedServices}
      />

      <RelatedBlogPosts
        currentSlug={post.slug}
        currentCategory={post.category}
        posts={relatedPosts}
      />

      <BlogArticleCTA
        businessName={business.businessName}
        phone={business.phone}
        whatsapp={business.whatsapp}
        primaryServiceRegion={
          business.primaryServiceRegion
        }
      />
    </>
  );
}