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
      className="flex min-w-0 items-center gap-3"
    >
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.09] bg-[#08263D]">
        <Image
          src={NAVBAR_BRAND.logoSrc}
          alt=""
          width={44}
          height={44}
          priority
          className="h-full w-full object-contain p-1.5"
        />
      </span>

      <span className="min-w-0">
        <span className="block truncate text-[15px] font-extrabold tracking-[-0.02em] text-[#F8FAFC]">
          {NAVBAR_BRAND.name}
        </span>

        <span className="mt-1 block truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-[#A8BBC8]">
          {NAVBAR_BRAND.tagline}
        </span>
      </span>
    </Link>
  );
}