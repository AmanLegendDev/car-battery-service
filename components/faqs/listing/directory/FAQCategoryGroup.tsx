"use client";

import { useState } from "react";

import FAQAccordion from "./FAQAccordion";

import type { PublicFAQ } from "../FAQsListingPage";

interface FAQCategoryGroupProps {
  category: string;
  faqs: PublicFAQ[];
}

export default function FAQCategoryGroup({
  category,
  faqs,
}: FAQCategoryGroupProps) {
  const [openId, setOpenId] = useState<string | null>(
    null,
  );

  if (faqs.length === 0) {
    return null;
  }

  function handleToggle(id: string) {
    setOpenId((current) =>
      current === id ? null : id,
    );
  }

  return (
    <section>
      {/* Category heading */}
      <div className="mb-5 flex items-center justify-between gap-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#FFD400]" />

          <h3 className="truncate text-sm font-bold uppercase tracking-[0.12em] text-[#061A2B]">
            {category}
          </h3>
        </div>

        <span className="shrink-0 text-[10px] font-semibold text-[#061A2B]/30">
          {faqs.length}{" "}
          {faqs.length === 1 ? "question" : "questions"}
        </span>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {faqs.map((faq) => (
          <FAQAccordion
            key={faq.id}
            faq={faq}
            isOpen={openId === faq.id}
            onToggle={() =>
              handleToggle(faq.id)
            }
          />
        ))}
      </div>
    </section>
  );
}