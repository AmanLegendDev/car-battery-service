"use client";

import { Check, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import type { PaymentOption } from "./paymentOptionsData";

interface PaymentOptionCardProps {
  option: PaymentOption;
  index: number;
}

export default function PaymentOptionCard({
  option,
  index,
}: PaymentOptionCardProps) {
  const Icon = option.icon;

  const isYellow = option.accent === "yellow";

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        delay: index * 0.045,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -5 }}
      className="group relative h-full"
    >
      {/* Outer glow */}
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute -inset-px rounded-[22px] opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100",
          isYellow
            ? "bg-[#FFD400]/10"
            : "bg-[#0D6E91]/20",
        ].join(" ")}
      />

      {/* Card */}
      <div
        className={[
          "relative flex h-full min-h-[124px] overflow-hidden rounded-[22px]",
          "border bg-[#08263D]/70 backdrop-blur-xl",
          "transition-all duration-500",
          isYellow
            ? "border-[#FFD400]/10 group-hover:border-[#FFD400]/30"
            : "border-[#0D6E91]/15 group-hover:border-[#0D6E91]/40",
          "group-hover:bg-[#08263D]/95",
        ].join(" ")}
      >
        {/* Top shine */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        {/* Ambient orb */}
        <div
          aria-hidden="true"
          className={[
            "pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl transition-all duration-500",
            isYellow
              ? "bg-[#FFD400]/[0.06] group-hover:bg-[#FFD400]/[0.12]"
              : "bg-[#0D6E91]/[0.08] group-hover:bg-[#0D6E91]/[0.18]",
          ].join(" ")}
        />

        {/* Main content */}
        <div className="relative flex w-full items-center gap-4 px-4 py-4 sm:px-5">
          {/* Icon */}
          <div
            className={[
              "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px]",
              "border shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
              "transition-all duration-500",
              isYellow
                ? "border-[#FFD400]/15 bg-[#FFD400]/[0.07] text-[#FFD400] group-hover:border-[#FFD400]/30 group-hover:bg-[#FFD400]/[0.11]"
                : "border-[#0D6E91]/20 bg-[#0D6E91]/[0.08] text-[#7DD3FC] group-hover:border-[#0D6E91]/40 group-hover:bg-[#0D6E91]/[0.14]",
            ].join(" ")}
          >
            <Icon
              size={20}
              strokeWidth={1.7}
              aria-hidden="true"
            />

            {/* Tiny status dot */}
            <span
              aria-hidden="true"
              className={[
                "absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#08263D]",
                isYellow
                  ? "bg-[#FFD400]"
                  : "bg-[#0D6E91]",
              ].join(" ")}
            />
          </div>

          {/* Text */}
          <div className="relative min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold tracking-[-0.01em] text-[#F8FAFC] sm:text-[15px]">
                {option.name}
              </h3>

              {option.featured && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#FFD400]/15 bg-[#FFD400]/[0.05] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.13em] text-[#FFD400]">
                  <Check
                    size={9}
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  Accepted
                </span>
              )}
            </div>

            <p className="mt-1 text-[11px] leading-5 text-[#A8BBC8] sm:text-xs">
              {option.label}
            </p>
          </div>

          {/* Arrow */}
          <div
            className={[
              "relative hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border",
              "transition-all duration-500 sm:flex",
              isYellow
                ? "border-[#FFD400]/10 text-[#A8BBC8]/35 group-hover:border-[#FFD400]/20 group-hover:text-[#FFD400]"
                : "border-white/[0.06] text-[#A8BBC8]/30 group-hover:border-[#0D6E91]/30 group-hover:text-[#7DD3FC]",
            ].join(" ")}
          >
            <ArrowUpRight
              size={14}
              strokeWidth={1.8}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}