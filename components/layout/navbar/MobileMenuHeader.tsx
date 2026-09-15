import Image from "next/image";
import Link from "next/link";
import { NAVBAR_BRAND } from "./navbarData";

interface MobileMenuHeaderProps {
  onClick?: () => void;
}

export default function MobileMenuHeader({
  onClick,
}: MobileMenuHeaderProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label={`${NAVBAR_BRAND.name} - Home`}
      className="group flex min-w-0 items-center gap-3"
    >
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-[1.02]">
        <Image
          src={NAVBAR_BRAND.logoSrc}
          alt=""
          width={48}
          height={48}
          priority
          className="h-12 w-12 object-contain"
        />
      </span>

      <span className="min-w-0 leading-none">
        <span className="block truncate text-[15px] font-extrabold tracking-[-0.025em] text-[#F8FAFC]">
          {NAVBAR_BRAND.name}
        </span>

        <span className="mt-1.5 block truncate text-[9px] font-semibold uppercase tracking-[0.17em] text-[#A8BBC8]">
          {NAVBAR_BRAND.tagline}
        </span>
      </span>
    </Link>
  );
}