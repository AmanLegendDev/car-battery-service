import FAQCategoryGroup from "./FAQCategoryGroup";

import type { PublicFAQ } from "../FAQsListingPage";

interface FAQsDirectoryProps {
  faqs: PublicFAQ[];
}

function normalizeCategory(category: string) {
  const value = category.trim();

  return value || "General";
}

export default function FAQsDirectory({
  faqs,
}: FAQsDirectoryProps) {
  if (faqs.length === 0) {
    return null;
  }

  const categoryMap = new Map<
    string,
    PublicFAQ[]
  >();

  for (const faq of faqs) {
    const category = normalizeCategory(
      faq.category,
    );

    const existing =
      categoryMap.get(category) || [];

    existing.push(faq);

    categoryMap.set(category, existing);
  }

  const categories = Array.from(
    categoryMap.entries(),
  );

  return (
    <section
      id="faqs"
      className="relative overflow-hidden bg-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-[#0D6E91]/[0.025] blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        {/* Header */}
        <div className="grid gap-8 border-b border-[#061A2B]/10 pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-9 bg-[#0D6E91]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0D6E91]">
                FAQ directory
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#061A2B] sm:text-4xl lg:text-5xl">
              Find the answer
              <span className="text-[#061A2B]/30">
                {" "}
                you need.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#061A2B]/45 sm:text-base">
              Browse questions by category and open
              an answer to learn more.
            </p>
          </div>

          {/* Total */}
          <div className="flex items-center gap-4">
            <div>
              <p className="text-3xl font-semibold tracking-[-0.04em] text-[#061A2B]">
                {faqs.length}
              </p>

              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#061A2B]/30">
                Active FAQs
              </p>
            </div>

            <span className="h-10 w-px bg-[#061A2B]/10" />

            <div>
              <p className="text-3xl font-semibold tracking-[-0.04em] text-[#061A2B]">
                {categories.length}
              </p>

              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#061A2B]/30">
                Categories
              </p>
            </div>
          </div>
        </div>

        {/* Category groups */}
        <div className="mt-12 space-y-14">
          {categories.map(
            ([category, categoryFaqs]) => (
              <FAQCategoryGroup
                key={category}
                category={category}
                faqs={categoryFaqs}
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}