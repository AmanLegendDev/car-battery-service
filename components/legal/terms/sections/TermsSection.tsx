import type { ReactNode } from "react";

interface TermsSectionProps {
  id: string;
  number: string;
  title: string;
  paragraphs: readonly string[];
  notice?: ReactNode;
}

export default function TermsSection({
  id,
  number,
  title,
  paragraphs,
  notice,
}: TermsSectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-28"
    >
      <div className="flex gap-5 sm:gap-7">
        <span className="hidden shrink-0 pt-1 text-[10px] font-bold tracking-[0.16em] text-[#A8BBC8] sm:block">
          {number}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 sm:hidden">
            <span className="text-[10px] font-bold tracking-[0.16em] text-[#A8BBC8]">
              {number}
            </span>

            <span className="h-px flex-1 bg-[#08263D]/10" />
          </div>

          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#061A2B] sm:mt-0 sm:text-3xl">
            {title}
          </h2>

          <div className="mt-5 space-y-4">
            {paragraphs.map(
              (paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-8 text-[#5F7482] sm:text-[15px]"
                >
                  {paragraph}
                </p>
              ),
            )}
          </div>

          {notice}
        </div>
      </div>
    </section>
  );
}