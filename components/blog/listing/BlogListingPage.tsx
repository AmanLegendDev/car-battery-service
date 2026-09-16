import BlogDirectory from "./directory/BlogDirectory";
import FeaturedBlogPost from "./featured/FeaturedBlogPost";
import BlogEmptyState from "./empty/BlogEmptyState";
import BlogListingHero from "./hero/BlogListingHero";

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

interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: BlogMedia | null;
  category: string;
  tags: string[];
  featured: boolean;
  publishedAt: Date | string | null;
  authorName: string;
  authorRole: string;
  readingTime?: number | null;
  displayOrder?: number;
}

interface BlogListingPageProps {
  posts: BlogPost[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
}

export default function BlogListingPage({
  posts,
  totalPosts,
  currentPage,
  totalPages,
}: BlogListingPageProps) {
  const isFirstPage = currentPage === 1;

  const featuredPost =
    isFirstPage
      ? posts.find((post) => post.featured) ?? posts[0] ?? null
      : null;

  const normalizedFeaturedPost = featuredPost
    ? {
        ...featuredPost,
        publishedAt: featuredPost.publishedAt
          ? new Date(featuredPost.publishedAt).toISOString()
          : null,
      }
    : null;

  return (
    <>
      <BlogListingHero postCount={totalPosts} />

      {posts.length === 0 ? (
        <BlogEmptyState />
      ) : (
        <>
          {isFirstPage && (
            <FeaturedBlogPost
              post={normalizedFeaturedPost}
            />
          )}

          <BlogDirectory
            posts={posts}
            featuredPostSlug={featuredPost?.slug ?? null}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </>
      )}
    </>
  );
}