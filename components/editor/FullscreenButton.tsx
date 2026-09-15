"use client";

import {
  Maximize2,
  Minimize2,
} from "lucide-react";

interface FullscreenButtonProps {
  fullscreen: boolean;

  setFullscreen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export default function FullscreenButton({
  fullscreen,
  setFullscreen,
}: FullscreenButtonProps) {
  return (
    <button
      type="button"
      onClick={() =>
        setFullscreen((prev) => !prev)
      }
      className={`
        flex
        items-center
        gap-2

        rounded-xl

        border
        border-slate-200

        bg-white

        px-4
        py-2

        text-sm
        font-medium

        text-slate-700

        shadow-sm

        transition-all
        duration-200

        hover:border-emerald-500
        hover:bg-emerald-50
        hover:text-emerald-700

        active:scale-95
      `}
    >
      {fullscreen ? (
        <>
          <Minimize2
            size={17}
          />

          Exit Fullscreen
        </>
      ) : (
        <>
          <Maximize2
            size={17}
          />

          Fullscreen
        </>
      )}
    </button>
  );
}