interface TermsContentSection {
  id: string;
  number: string;
  title: string;
}

interface TermsContentsProps {
  sections: readonly TermsContentSection[];
}

export default function TermsContents({
  sections,
}: TermsContentsProps) {
  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <div className="rounded-[1.5rem] border border-[#08263D]/10 bg-white p-4 shadow-[0_12px_40px_rgba(6,26,43,0.035)] sm:p-5">
        <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A8BBC8]">
          On This Page
        </p>

        <nav
          aria-label="Terms and conditions sections"
          className="mt-3 max-h-[65vh] overflow-y-auto pr-1"
        >
          <div className="space-y-0.5">
            {sections.map(
              (section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-[#F8FAFC]"
                >
                  <span className="shrink-0 pt-0.5 text-[10px] font-bold tracking-[0.12em] text-[#A8BBC8] transition group-hover:text-[#0D6E91]">
                    {section.number}
                  </span>

                  <span className="text-xs font-medium leading-5 text-[#5F7482] transition group-hover:text-[#061A2B]">
                    {section.title}
                  </span>
                </a>
              ),
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
}