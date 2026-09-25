"use client";

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
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.45,
        delay: index * 0.045,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4 }}
      className="group relative h-full"
    >
      <div className="absolute inset-0 rounded-2xl bg-[#0D6E91]/0 blur-xl transition duration-500 group-hover:bg-[#0D6E91]/15" />

      <div className="relative flex h-full min-h-[108px] items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#08263D]/75 px-4 py-4 backdrop-blur-xl transition-all duration-300 group-hover:border-[#0D6E91]/45 group-hover:bg-[#08263D] sm:px-5">
        {/* Ambient highlight */}
        <div
          className={[
            "absolute -right-10 -top-10 h-24 w-24 rounded-full blur-2xl transition-opacity duration-300",
            isYellow
              ? "bg-[#FFD400]/10 group-hover:bg-[#FFD400]/15"
              : "bg-[#0D6E91]/10 group-hover:bg-[#0D6E91]/20",
          ].join(" ")}
        />

        {/* Icon */}
        <div
          className={[
            "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all duration-300",
            isYellow
              ? "border-[#FFD400]/15 bg-[#FFD400]/[0.07] text-[#FFD400] group-hover:border-[#FFD400]/30 group-hover:bg-[#FFD400]/10"
              : "border-[#0D6E91]/20 bg-[#0D6E91]/[0.08] text-[#7DD3FC] group-hover:border-[#0D6E91]/40 group-hover:bg-[#0D6E91]/15",
          ].join(" ")}
        >
          <Icon
            size={21}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>

        {/* Content */}
        <div className="relative min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold tracking-tight text-[#F8FAFC] sm:text-[15px]">
              {option.name}
            </h3>

            {option.featured && (
              <span className="rounded-full border border-[#FFD400]/15 bg-[#FFD400]/[0.06] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#FFD400]">
                Accepted
              </span>
            )}
          </div>

          <p className="mt-1 text-xs leading-5 text-[#A8BBC8]">
            {option.label}
          </p>
        </div>

        {/* Right arrow */}
        <div className="relative ml-auto hidden shrink-0 text-[#A8BBC8]/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[#A8BBC8]/60 sm:block">
          <span className="text-lg">→</span>
        </div>
      </div>
    </motion.div>
  );
}