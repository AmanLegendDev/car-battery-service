"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
}

interface ServiceFAQAccordionProps {
  items: FAQItem[];
}

export default function ServiceFAQAccordion({
  items,
}: ServiceFAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(
    items[0]?._id ?? null,
  );

  if (!items.length) {
    return null;
  }

  return (
    <div className="border-t border-[#061A2B]/10">
      {items.map((item) => {
        const isOpen = openId === item._id;

        return (
          <div
            key={item._id}
            className="border-b border-[#061A2B]/10"
          >
            <button
              type="button"
              onClick={() =>
                setOpenId(isOpen ? null : item._id)
              }
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-6 text-left sm:py-7"
            >
              <span className="max-w-3xl text-base font-semibold leading-6 tracking-[-0.015em] text-[#061A2B]/85 sm:text-lg">
                {item.question}
              </span>

              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#061A2B]/10 transition-all duration-300 ${
                  isOpen
                    ? "rotate-180 bg-[#061A2B] text-[#FFD400]"
                    : "bg-transparent text-[#061A2B]/55"
                }`}
              >
                <ChevronDown
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              </span>
            </button>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl pb-7 pr-12 text-sm leading-7 text-[#061A2B]/55 sm:text-base">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}