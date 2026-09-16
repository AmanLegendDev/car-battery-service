import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
}

function getPageHref(page: number) {
  return page <= 1 ? "/blog" : `/blog?page=${page}`;
}

export default function BlogPagination({
  currentPage,
  totalPages,
}: BlogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages: number[] = [];

  for (let page = 1; page <= totalPages; page += 1) {
    pages.push(page);
  }

  return (
    <nav
      aria-label="Blog pagination"
      className="mt-12 border-t border-[#DDE7ED] pt-8"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Previous */}
        <div>
          {currentPage > 1 ? (
            <Link
              href={getPageHref(currentPage - 1)}
              className="group inline-flex items-center gap-2 rounded-full border border-[#CBD9E0] bg-white px-4 py-2.5 text-sm font-semibold text-[#061A2B] transition hover:border-[#0D6E91] hover:text-[#0D6E91]"
              aria-label="Previous page"
            >
              <ChevronLeft
                size={16}
                className="transition-transform group-hover:-translate-x-0.5"
              />
              Previous
            </Link>
          ) : (
            <span
              aria-hidden="true"
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-[#E7EEF2] bg-[#F8FAFC] px-4 py-2.5 text-sm font-semibold text-[#A4B1B8]"
            >
              <ChevronLeft size={16} />
              Previous
            </span>
          )}
        </div>

        {/* Page Numbers */}
        <div className="flex items-center justify-center gap-1.5">
          {pages.map((page) => {
            const isCurrent = page === currentPage;

            return (
              <Link
                key={page}
                href={getPageHref(page)}
                aria-current={isCurrent ? "page" : undefined}
                className={[
                  "flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition",
                  isCurrent
                    ? "bg-[#061A2B] text-white shadow-md"
                    : "text-[#617580] hover:bg-white hover:text-[#0D6E91]",
                ].join(" ")}
              >
                {page}
              </Link>
            );
          })}
        </div>

        {/* Next */}
        <div className="flex justify-end">
          {currentPage < totalPages ? (
            <Link
              href={getPageHref(currentPage + 1)}
              className="group inline-flex items-center gap-2 rounded-full border border-[#CBD9E0] bg-white px-4 py-2.5 text-sm font-semibold text-[#061A2B] transition hover:border-[#0D6E91] hover:text-[#0D6E91]"
              aria-label="Next page"
            >
              Next
              <ChevronRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          ) : (
            <span
              aria-hidden="true"
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-[#E7EEF2] bg-[#F8FAFC] px-4 py-2.5 text-sm font-semibold text-[#A4B1B8]"
            >
              Next
              <ChevronRight size={16} />
            </span>
          )}
        </div>
      </div>

      {/* Mobile Context */}
      <div className="mt-5 text-center text-xs text-[#84939B]">
        Page {currentPage} of {totalPages}
      </div>
    </nav>
  );
}