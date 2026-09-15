import { connectDB } from "@/lib/db";
import FAQ from "@/models/FAQ";
import FAQAccordion from "./FAQAccordion";

interface HomepageFAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  featured: boolean;
  displayOrder: number;
}

async function getHomepageFAQs(): Promise<HomepageFAQ[]> {
  await connectDB();

  const faqs = await FAQ.find({
    status: "active",
  })
    .select(
      "question answer category featured displayOrder",
    )
    .sort({
      featured: -1,
      displayOrder: 1,
      createdAt: -1,
    })
    .limit(10)
    .lean();

  return faqs.map((faq) => ({
    _id: String(faq._id),
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    featured: faq.featured,
    displayOrder: faq.displayOrder,
  }));
}

export default async function FAQOverview() {
  const faqs = await getHomepageFAQs();

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section
      id="faqs"
      className="relative overflow-hidden bg-[#F8FAFC] text-[#061A2B]"
    >
      {/* Technical background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#061A2B 1px, transparent 1px), linear-gradient(90deg, #061A2B 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Ambient shape */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#0D6E91] opacity-[0.055] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        {/* Header */}
        <div className="grid gap-8 border-b border-[#061A2B]/10 pb-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-end lg:gap-16">
          <div>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#0D6E91]">
                Common Questions
              </span>
            </div>

            <p className="mt-5 font-mono text-[10px] tracking-[0.2em] text-[#526675]/60">
              CLARITY BEFORE YOU CALL
            </p>
          </div>

          <div>
            <h2 className="max-w-4xl text-[clamp(2.7rem,5vw,5.2rem)] font-semibold leading-[0.94] tracking-[-0.055em]">
              Got a question?
              <span className="block text-[#0D6E91]">
                Start here.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#526675] sm:text-lg sm:leading-8">
              Find answers to common questions about mobile car battery
              assistance and requesting a service.
            </p>
          </div>
        </div>

        {/* FAQ layout */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[0.32fr_0.68fr] lg:gap-20">
          {/* Left information */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border-l-2 border-[#FFD400] pl-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#061A2B]">
                Need more help?
              </p>

              <p className="mt-3 max-w-xs text-sm leading-6 text-[#526675]">
                If your question is not answered here, you can contact the
                team directly or request the service you need.
              </p>
            </div>

            <a
              href="/contact"
              className="group mt-7 inline-flex items-center gap-3 text-sm font-semibold text-[#061A2B]"
            >
              Contact Us

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#061A2B] text-[#FFD400] transition-transform duration-300 group-hover:rotate-45">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M7 17 17 7" />
                  <path d="M8 7h9v9" />
                </svg>
              </span>
            </a>
          </aside>

          {/* Accordion */}
          <FAQAccordion faqs={faqs} />
        </div>

        {/* Bottom strip */}
        <div className="mt-12 flex flex-col gap-5 border-t border-[#061A2B]/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#061A2B]">
              Still looking for something?
            </p>

            <p className="mt-1 text-xs text-[#526675]">
              Explore the complete FAQ collection.
            </p>
          </div>

          <a
            href="/faqs"
            className="group inline-flex min-h-12 items-center justify-between gap-4 self-start rounded-full border border-[#061A2B]/15 px-5 py-2.5 text-sm font-semibold text-[#061A2B] transition-all duration-300 hover:border-[#0D6E91]/40 hover:bg-[#061A2B]/[0.03]"
          >
            View All FAQs

            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B] transition-transform duration-300 group-hover:rotate-45">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}