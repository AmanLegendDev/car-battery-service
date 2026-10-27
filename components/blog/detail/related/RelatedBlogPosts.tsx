
import RelatedBlogCard from "./RelatedBlogCard";

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

interface RelatedBlogPost {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: BlogMedia | null;
  category: string;
  publishedAt: string | null;
  readingTime: number | null;
}

interface RelatedBlogPostsProps {
  currentSlug: string;
  currentCategory: string;
  posts: RelatedBlogPost[];
}

export default function RelatedBlogPosts({
  currentSlug,
  currentCategory,
  posts,
}: RelatedBlogPostsProps) {
  const normalizedCategory = currentCategory.trim().toLowerCase();

  const filteredPosts = posts
    .filter((post) => post.slug !== currentSlug)
    .sort((a, b) => {
      const categoryA =
        normalizedCategory &&
        a.category.trim().toLowerCase() === normalizedCategory
          ? 1
          : 0;

      const categoryB =
        normalizedCategory &&
        b.category.trim().toLowerCase() === normalizedCategory
          ? 1
          : 0;

      return categoryB - categoryA;
    })
    .slice(0, 3);

  if (filteredPosts.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="related-blog-heading"
      className="bg-[#F8FAFC] px-5 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#0D6E91]">
              <span
                aria-hidden="true"
                className="h-px w-7 bg-[#FFD400]"
              />

              Keep Reading
            </div>

            <h2
              id="related-blog-heading"
              className="text-3xl font-semibold tracking-[-0.035em] text-[#061A2B] sm:text-4xl"
            >
              More insights for the road ahead.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-[#687B86] sm:text-right">
            Discover more automotive guides, maintenance advice
            and practical information to help you make informed
            decisions about your vehicle.
          </p>
        </div>

        {/* Related articles */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <RelatedBlogCard
              key={post.slug}
              post={post}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
