import Image from "next/image";
import Link from "next/link";
import { NAVBAR_BRAND } from "./navbarData";

interface NavbarLogoProps {
  onClick?: () => void;
}

export default function NavbarLogo({ onClick }: NavbarLogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label={`${NAVBAR_BRAND.name} - Home`}
      className="group flex min-w-0 items-center gap-3.5"
    >
      <span className="relative flex h-14 w-14 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-[1.03]">
        <Image
          src={NAVBAR_BRAND.logoSrc}
          alt=""
          width={56}
          height={56}
          priority
          className="h-14 w-14 object-contain"
        />
      </span>

      <span className="min-w-0 leading-none">
        <span className="block truncate text-[15px] font-extrabold tracking-[-0.025em] text-[#F8FAFC] sm:text-base">
          {NAVBAR_BRAND.name}
        </span>

        <span className="mt-1.5 block truncate text-[9px] font-semibold uppercase tracking-[0.17em] text-[#A8BBC8] sm:text-[10px]">
          {NAVBAR_BRAND.tagline}
        </span>
      </span>
    </Link>
  );
}