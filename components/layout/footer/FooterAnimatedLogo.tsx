

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Wrench } from "lucide-react";

interface FooterAnimatedLogoProps {
  businessName: string;
  logo: {
    secureUrl: string;
    alt: string;
  } | null;
}

export default function FooterAnimatedLogo({
  businessName,
  logo,
}: FooterAnimatedLogoProps) {
  const reduceMotion = useReducedMotion();

  return (
    <Link
      href="/"
      aria-label={`${businessName} home`}
      className="group relative z-10 -my-2.5 flex h-[84px] w-[84px] shrink-0 items-center justify-center overflow-visible outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061A2B]"
    >
      <motion.span
        className="relative flex h-[82px] w-[82px] items-center justify-center [perspective:700px]"
        animate={
          reduceMotion
            ? undefined
            : {
                y: [0, -4, 0, 3, 0],
                rotateZ: [0, -1.5, 0, 1.5, 0],
              }
        }
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        whileHover={reduceMotion ? undefined : { scale: 1.08, y: -5 }}
      >
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 rounded-full bg-sky-400/25 blur-xl"
          animate={
            reduceMotion
              ? undefined
              : { opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.1, 0.9] }
          }
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.span
          className="relative flex h-[78px] w-[78px] items-center justify-center"
          style={{
            transformStyle: "preserve-3d",
            filter:
              "drop-shadow(0 5px 4px rgba(0,0,0,0.45)) drop-shadow(0 0 9px rgba(14,165,233,0.22))",
          }}
          animate={reduceMotion ? undefined : { rotateY: [0, 360] }}
          transition={{
            rotateY: {
              duration: 1.2,
              repeat: Infinity,
              repeatDelay: 3.8,
              ease: "easeInOut",
            },
          }}
        >
          {logo?.secureUrl ? (
            <Image
              src={logo.secureUrl}
              alt={logo.alt || businessName}
              width={78}
              height={78}
              sizes="78px"
              className="h-[78px] w-[78px] object-contain"
            />
          ) : (
            <Wrench
              aria-hidden="true"
              className="h-10 w-10 text-[#FFD400] drop-shadow-[0_4px_8px_rgba(255,212,0,0.25)]"
              strokeWidth={2}
            />
          )}
        </motion.span>
      </motion.span>
    </Link>
  );
}
