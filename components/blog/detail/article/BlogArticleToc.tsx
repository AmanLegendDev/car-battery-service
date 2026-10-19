"use client";

import { useEffect, useState } from "react";
import { List, ArrowUpRight, ChevronRight } from "lucide-react";

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
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!items.length) {
      return;
    }

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => heading !== null);

    if (!headings.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeadings = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );

        if (visibleHeadings.length > 0) {
          setActiveId(visibleHeadings[0].target.id);
        }
      },
      {
        rootMargin: "-15% 0px -70% 0px",
        threshold: 0,
      },
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [items]);

  if (!items.length) {
    return null;
  }

  return (
    <aside className="w-full">
      <div
        className="
          overflow-hidden
          rounded-[1.5rem]
          border border-[#DDE7ED]
          bg-white
          shadow-[0_18px_50px_rgba(6,26,43,0.07)]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E7EEF2] bg-gradient-to-r from-[#F8FBFC] to-white px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#061A2B] text-[#FFD400] shadow-sm">
              <List size={17} strokeWidth={2.2} />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#0D6E91]">
                Explore the article
              </p>

              <h2 className="mt-0.5 text-sm font-bold tracking-tight text-[#061A2B]">
                On this page
              </h2>
            </div>
          </div>

          <ArrowUpRight
            size={17}
            aria-hidden="true"
            className="shrink-0 text-[#A8BBC8]"
          />
        </div>

        {/* Section list */}
        <nav
          aria-label="Table of contents"
          className="max-h-[min(65vh,560px)] overflow-y-auto p-3"
        >
          <ol className="space-y-1">
            {items.map((item, index) => {
              const isActive = activeId === item.id;

              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "location" : undefined}
                    onClick={() => setActiveId(item.id)}
                    className={[
                      "group flex items-start gap-3 rounded-xl border px-3 py-3",
                      "transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D6E91]/40",
                      item.level === 3 ? "ml-4" : "",
                      isActive
                        ? "border-[#DDE7ED] bg-[#F1F7F9] shadow-sm"
                        : "border-transparent hover:border-[#E7EEF2] hover:bg-[#F8FBFC]",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "mt-0.5 flex h-6 min-w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold tabular-nums transition-colors",
                        isActive
                          ? "bg-[#061A2B] text-[#FFD400]"
                          : "bg-[#F1F6F8] text-[#91A5B0] group-hover:bg-[#EAF3F6] group-hover:text-[#0D6E91]",
                      ].join(" ")}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={[
                        "min-w-0 flex-1 text-xs leading-5 transition-colors",
                        item.level === 3 ? "font-normal" : "font-semibold",
                        isActive
                          ? "text-[#061A2B]"
                          : "text-[#687B86] group-hover:text-[#061A2B]",
                      ].join(" ")}
                    >
                      {item.label}
                    </span>

                    <ChevronRight
                      size={14}
                      aria-hidden="true"
                      className={[
                        "mt-1 shrink-0 transition-all",
                        isActive
                          ? "translate-x-0 text-[#0D6E91] opacity-100"
                          : "-translate-x-1 text-[#A8BBC8] opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                      ].join(" ")}
                    />
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#E7EEF2] bg-[#FBFCFD] px-5 py-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#91A5B0]">
            Article guide
          </p>

          <p className="rounded-full bg-[#EAF3F6] px-2.5 py-1 text-[10px] font-bold tabular-nums text-[#0D6E91]">
            {items.length} sections
          </p>
        </div>
      </div>
    </aside>
  );
}