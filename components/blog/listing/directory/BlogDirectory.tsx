import BlogDirectoryCard from "./BlogDirectoryCard";
import BlogPagination from "../pagination/BlogPagination";

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
}

interface BlogDirectoryProps {
  posts: BlogPost[];
  featuredPostSlug?: string | null;
  currentPage: number;
  totalPages: number;
}

export default function BlogDirectory({
  posts,
  featuredPostSlug,
  currentPage,
  totalPages,
}: BlogDirectoryProps) {
  const directoryPosts = posts.filter(
    (post) => post.slug !== featuredPostSlug,
  );

  if (directoryPosts.length === 0) {
    return null;
  }

  return (
    <section
      id="all-articles"
      className="bg-[#F8FAFC] px-5 pb-20 sm:px-6 lg:px-8 lg:pb-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-10 border-t border-[#DDE7ED] pt-10 sm:mb-12 sm:pt-12">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#0D6E91]">
                <span className="h-px w-7 bg-[#FFD400]" />
                The Journal
              </div>

              <h2 className="text-3xl font-semibold tracking-[-0.035em] text-[#061A2B] sm:text-4xl">
                More practical answers.
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-[#687B86] lg:text-right">
              Browse published articles covering car batteries, battery
              testing, replacement and jump start assistance.
            </p>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {directoryPosts.map((post, index) => (
            <BlogDirectoryCard
              key={post.slug}
              post={post}
              index={index}
            />
          ))}
        </div>

        {/* Pagination */}
        <BlogPagination
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </section>
  );
}