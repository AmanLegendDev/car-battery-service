import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

interface ContactInfoCardProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  value: string;
  href?: string;
  accent?: "yellow" | "blue";
}

export default function ContactInfoCard({
  icon: Icon,
  eyebrow,
  title,
  value,
  href,
  accent = "blue",
}: ContactInfoCardProps) {
  const iconClass =
    accent === "yellow"
      ? "bg-[#FFD400] text-[#061A2B]"
      : "bg-[#0D6E91]/10 text-[#0D6E91]";

  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={19} />
        </span>

        {href ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#061A2B]/[0.04] text-[#5F7482] transition group-hover:bg-[#061A2B] group-hover:text-[#FFD400]">
            <ArrowUpRight size={15} />
          </span>
        ) : null}
      </div>

      <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A8BBC8]">
        {eyebrow}
      </p>

      <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#061A2B]">
        {title}
      </h3>

      <p className="mt-2 break-words text-sm leading-6 text-[#5F7482]">
        {value}
      </p>
    </>
  );

  if (!href) {
    return (
      <div className="rounded-[1.5rem] border border-[#08263D]/10 bg-white p-5 shadow-[0_12px_40px_rgba(6,26,43,0.04)]">
        {content}
      </div>
    );
  }

  return (
    <a
      href={href}
      className="group rounded-[1.5rem] border border-[#08263D]/10 bg-white p-5 shadow-[0_12px_40px_rgba(6,26,43,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#0D6E91]/20 hover:shadow-[0_18px_50px_rgba(6,26,43,0.08)]"
    >
      {content}
    </a>
  );
}