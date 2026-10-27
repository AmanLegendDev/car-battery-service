
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { NAVBAR_BRAND } from "./navbarData";

interface NavbarLogoProps {
  onClick?: () => void;
}

export default function NavbarLogo({ onClick }: NavbarLogoProps) {
  const reduceMotion = useReducedMotion();

  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label={`${NAVBAR_BRAND.name} - Home`}
      className="group flex min-w-0 items-center gap-3"
    >
      {/* Floating 3D logo — no separate background box */}
      <motion.span
        className="relative z-20 -my-3 flex h-[84px] w-[84px] shrink-0 items-center justify-center overflow-visible [perspective:700px]"
        animate={
          reduceMotion
            ? undefined
            : {
                y: [0, -4, 0, 3, 0],
                rotateZ: [0, -1.5, 0, 1.5, 0],
              }
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={reduceMotion ? undefined : { scale: 1.08, y: -5 }}
      >
        {/* Ambient glow */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-1 rounded-full bg-sky-400/20 blur-xl"
          animate={
            reduceMotion ? undefined : { opacity: [0.35, 0.8, 0.35] }
          }
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Logo rotates once every 5 seconds */}
        <motion.span
          className="relative flex h-[78px] w-[78px] items-center justify-center"
          style={{
            transformStyle: "preserve-3d",
            filter:
              "drop-shadow(0 5px 3px rgba(0,0,0,0.5)) drop-shadow(0 0 8px rgba(14,165,233,0.18))",
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  rotateY: [0, 360],
                }
          }
          transition={{
            rotateY: {
              duration: 1.2,
              repeat: Infinity,
              repeatDelay: 3.8,
              ease: "easeInOut",
            },
          }}
        >
          <Image
            src={NAVBAR_BRAND.logoSrc}
            alt={NAVBAR_BRAND.name}
            width={78}
            height={78}
            priority
            className="h-[78px] w-[78px] object-contain"
          />
        </motion.span>
      </motion.span>

      {/* Brand text */}
      <span className="min-w-0 leading-none">
        <span className="block truncate text-[16px] font-black tracking-[-0.035em] text-[#F8FAFC] sm:text-[17px]">
          {NAVBAR_BRAND.name}
        </span>

        <span className="mt-1.5 block truncate text-[9px] font-bold uppercase tracking-[0.19em] text-[#A8BBC8] sm:text-[10px]">
          {NAVBAR_BRAND.tagline}
        </span>
      </span>
    </Link>
  );
}
