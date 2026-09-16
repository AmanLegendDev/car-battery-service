"use client";

import { List, ArrowUpRight } from "lucide-react";

interface TocItem {
  id: string;
  label: string;
  level: 2 | 3;
}

interface BlogArticleTocProps {
  items: TocItem[];
}

export default function BlogArticleToc({
  items,
}: BlogArticleTocProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="sticky top-28">
      <div className="overflow-hidden rounded-[1.5rem] border border-[#DDE7ED] bg-white shadow-[0_18px_50px_rgba(6,26,43,0.07)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E7EEF2] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#061A2B] text-[#FFD400]">
              <List size={16} strokeWidth={2} />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#0D6E91]">
                Article
              </p>

              <p className="mt-0.5 text-xs font-semibold text-[#061A2B]">
                On this page
              </p>
            </div>
          </div>

          <ArrowUpRight
            size={15}
            className="text-[#A8BBC8]"
          />
        </div>

        {/* Navigation */}
        <nav
          aria-label="Article sections"
          className="max-h-[calc(100vh-10rem)] overflow-y-auto p-3"
        >
          <ol className="space-y-1">
            {items.map((item, index) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={[
                    "group flex items-start gap-3 rounded-xl px-3 py-2.5",
                    "transition-all duration-200",
                    "hover:bg-[#F3F8FA]",
                    item.level === 3
                      ? "ml-4"
                      : "",
                  ].join(" ")}
                >
                  {/* Number */}
                  <span className="mt-0.5 min-w-[20px] text-[10px] font-bold tabular-nums text-[#A8BBC8] transition-colors group-hover:text-[#0D6E91]">
                    {String(index + 1).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  {/* Label */}
                  <span className="text-xs font-medium leading-5 text-[#687B86] transition-colors group-hover:text-[#061A2B]">
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Footer */}
        <div className="border-t border-[#E7EEF2] px-5 py-3">
          <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#A8BBC8]">
            {items.length} sections
          </p>
        </div>
      </div>
    </div>
  );
}