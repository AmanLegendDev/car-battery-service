"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface HomepageFAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  featured: boolean;
  displayOrder: number;
}

interface FAQAccordionProps {
  faqs: HomepageFAQ[];
}

export default function FAQAccordion({
  faqs,
}: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(
    faqs[0]?._id ?? null,
  );

  function toggleFAQ(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <div className="border-t border-[#061A2B]/15">
      {faqs.map((faq, index) => {
        const isOpen = openId === faq._id;

        return (
          <div
            key={faq._id}
            className={`border-b border-[#061A2B]/15 transition-colors duration-300 ${
              isOpen ? "bg-white/70" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => toggleFAQ(faq._id)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${faq._id}`}
              className="group flex w-full items-start gap-4 py-6 text-left sm:gap-7 sm:py-7"
            >
              {/* Number */}
              <span
                className={`w-7 shrink-0 pt-1 font-mono text-[10px] font-medium tracking-[0.15em] transition-colors duration-300 sm:w-9 ${
                  isOpen
                    ? "text-[#0D6E91]"
                    : "text-[#526675]/50"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Question */}
              <span className="min-w-0 flex-1 pr-2">
                <span
                  className={`block text-base font-semibold leading-6 tracking-[-0.015em] transition-colors duration-300 sm:text-lg sm:leading-7 ${
                    isOpen
                      ? "text-[#0D6E91]"
                      : "text-[#061A2B] group-hover:text-[#0D6E91]"
                  }`}
                >
                  {faq.question}
                </span>

                {/* Category */}
                {faq.category && (
                  <span className="mt-2 block text-[9px] font-bold uppercase tracking-[0.2em] text-[#526675]/55">
                    {faq.category}
                  </span>
                )}
              </span>

              {/* Icon */}
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                  isOpen
                    ? "rotate-180 border-[#0D6E91] bg-[#0D6E91] text-[#F8FAFC]"
                    : "border-[#061A2B]/15 bg-transparent text-[#061A2B] group-hover:border-[#0D6E91] group-hover:text-[#0D6E91]"
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>

            {/* Animated answer */}
            <div
              id={`faq-answer-${faq._id}`}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pb-7 pl-[3.75rem] pr-10 sm:pb-8 sm:pl-16 sm:pr-16">
                  <div className="max-w-2xl border-l border-[#0D6E91]/30 pl-5 sm:pl-6">
                    <p className="text-sm leading-7 text-[#526675] sm:text-[15px] sm:leading-7">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}