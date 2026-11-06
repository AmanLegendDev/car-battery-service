
import { Phone, ArrowUpRight } from "lucide-react";

import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

interface FloatingCallSettings {
  phone: string;
  primaryCallNumber: string;
}

async function getFloatingCallSettings(): Promise<FloatingCallSettings> {
  try {
    await connectDB();

    const settings = await SiteSettings.findOne()
      .select("phone primaryCallNumber")
      .lean();

    return {
      phone:
        typeof settings?.phone === "string" && settings.phone.trim()
          ? settings.phone.trim()
          : "+61 467 037 886",

      primaryCallNumber:
        typeof settings?.primaryCallNumber === "string" &&
        settings.primaryCallNumber.trim()
          ? settings.primaryCallNumber.trim()
          : typeof settings?.phone === "string" &&
              settings.phone.trim()
            ? settings.phone.trim()
            : "+61 467 037 886",
    };
  } catch (error) {
    console.error("Failed to load floating call settings:", error);

    return {
      phone: "+61 467 037 886",
      primaryCallNumber: "+61 467 037 886",
    };
  }
}

function getMelbourneBusinessStatus() {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Melbourne",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const hour = Number(
    parts.find((part) => part.type === "hour")?.value
  );
  const minute = Number(
    parts.find((part) => part.type === "minute")?.value
  );

  const currentMinutes = hour * 60 + minute;

  const isOpen =
    weekday !== undefined &&
    currentMinutes >= 8 * 60 &&
    currentMinutes < 21 * 60;

  return {
    isOpen,
    label: isOpen ? "Open Now" : "Hours: 8 AM – 9 PM",
  };
}

function phoneHref(phone: string) {
  const normalized = phone.replace(/[^\d+]/g, "");

  return /\d/.test(normalized) ? `tel:${normalized}` : null;
}

export default async function FloatingCallButton() {
  const settings = await getFloatingCallSettings();

  const businessStatus = getMelbourneBusinessStatus();
  const href = phoneHref(settings.primaryCallNumber);

  if (!href) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:px-0 sm:pb-0">
      <a
        href={href}
        aria-label={`Call ${settings.phone || "Mobile Car Services"}. Business hours Monday to Sunday, 8 AM to 9 PM Melbourne time.`}
        className="
          pointer-events-auto
          group
          relative
          ml-auto
          flex
          items-center
          justify-center
          rounded-full
          border
          border-[#061A2B]/10
          bg-[#FFD400]
          text-[#061A2B]
          shadow-[0_14px_40px_rgba(6,26,43,0.22)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:bg-[#F5B800]
          hover:shadow-[0_18px_50px_rgba(6,26,43,0.28)]
          active:scale-[0.94]
          h-14
          w-14
          sm:h-auto
          sm:w-fit
          sm:gap-3.5
          sm:justify-start
          sm:px-3
          sm:py-3
          sm:pr-4
        "
      >
        {/* Soft glow */}
        <span
          aria-hidden="true"
          className="
            absolute
            inset-0
            -z-10
            rounded-full
            bg-[#FFD400]
            opacity-40
            blur-md
            transition-opacity
            duration-300
            group-hover:opacity-60
          "
        />

        {/* Call icon */}
        <span
          className="
            relative
            flex
            h-full
            w-full
            items-center
            justify-center
            rounded-full
            bg-[#061A2B]
            text-[#FFD400]
            sm:h-12
            sm:w-12
            sm:shrink-0
          "
        >
          <Phone
            aria-hidden="true"
            className="
              h-[19px]
              w-[19px]
              transition-transform
              duration-300
              group-hover:rotate-[-8deg]
              sm:h-[17px]
              sm:w-[17px]
            "
            strokeWidth={2}
          />

          <span
            aria-hidden="true"
            className="
              absolute
              right-1
              top-1
              h-2.5
              w-2.5
              rounded-full
              border-2
              border-[#061A2B]
              bg-[#FFD400]
              sm:right-0.5
              sm:top-0.5
            "
          />
        </span>

        {/* Desktop text */}
        <span className="hidden pr-0.5 sm:block">
          <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-[#061A2B]/55">
            {businessStatus.label}
          </span>

          <span className="mt-0.5 block text-sm font-bold leading-none">
            Call Now
          </span>
        </span>

        {/* Desktop arrow */}
        <span
          aria-hidden="true"
          className="
            hidden
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            border
            border-[#061A2B]/15
            transition-all
            duration-300
            group-hover:rotate-45
            group-hover:border-[#061A2B]/30
            sm:flex
          "
        >
          <ArrowUpRight
            className="h-4 w-4"
            strokeWidth={2}
          />
        </span>
      </a>
    </div>
  );
}
