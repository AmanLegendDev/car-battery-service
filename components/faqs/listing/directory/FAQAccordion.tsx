"use client";

import { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
} from "lucide-react";

import type { PublicFAQ } from "../FAQsListingPage";

interface FAQAccordionProps {
  faq: PublicFAQ;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FAQAccordion({
  faq,
  isOpen,
  onToggle,
}: FAQAccordionProps) {
  const answerId = `faq-answer-${faq.id}`;
  const buttonId = `faq-question-${faq.id}`;

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-colors duration-200 ${
        isOpen
          ? "border-[#0D6E91]/25 bg-[#F8FAFC]"
          : "border-[#061A2B]/[0.08] bg-white"
      }`}
    >
      <button
        id={buttonId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={answerId}
        className="flex min-h-16 w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
            isOpen
              ? "bg-[#061A2B] text-[#FFD400]"
              : "bg-[#061A2B]/[0.05] text-[#0D6E91]"
          }`}
        >
          <HelpCircle
            size={16}
            strokeWidth={1.8}
          />
        </span>

        <span className="flex-1 text-sm font-semibold leading-6 tracking-[-0.01em] text-[#061A2B] sm:text-[15px]">
          {faq.question}
        </span>

        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
            isOpen
              ? "rotate-180 bg-[#FFD400] text-[#061A2B]"
              : "bg-[#061A2B]/[0.05] text-[#061A2B]/45"
          }`}
        >
          <ChevronDown size={15} />
        </span>
      </button>

      <div
        id={answerId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
      >
        <div className="border-t border-[#061A2B]/[0.07] px-5 pb-6 pt-5 sm:px-6">
          <p className="whitespace-pre-line pl-[52px] text-sm leading-7 text-[#061A2B]/55 sm:text-[15px] sm:leading-7">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}