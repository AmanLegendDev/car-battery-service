import type { ReactNode } from "react";

interface PrivacySectionProps {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
}

export default function PrivacySection({
  id,
  number,
  title,
  children,
}: PrivacySectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-28 border-b border-[#08263D]/10 py-10 first:pt-0 last:border-b-0 sm:py-12"
    >
      <div className="flex items-start gap-4 sm:gap-5">
        <span className="mt-1 shrink-0 font-mono text-xs font-semibold tracking-wider text-[#0D6E91]">
          {number}
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[#061A2B] sm:text-3xl">
            {title}
          </h2>

          <div className="mt-6 space-y-5 text-[15px] leading-8 text-[#061A2B]/70 [&_h3]:mt-8 [&_h3]:text-base [&_h3]:font-bold [&_h3]:leading-6 [&_h3]:text-[#061A2B] [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}