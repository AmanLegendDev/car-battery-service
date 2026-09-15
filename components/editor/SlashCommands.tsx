"use client";

import {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";

import { slashItems } from "./SlashItems";

interface SlashCommandsProps {
  items: typeof slashItems;

  command: (item: any) => void;

  selectedIndex: number;
}

export interface SlashCommandsRef {
  onKeyDown: (props: {
    event: KeyboardEvent;
  }) => boolean;
}

const SlashCommands = forwardRef<
  SlashCommandsRef,
  SlashCommandsProps
>(function SlashCommands(
  {
    items,
    command,
    selectedIndex,
  },
  ref
) {
  if (!items.length) {
    return null;
  }

  const [selected, setSelected] =
  useState(0);

  const divRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
  onKeyDown: ({ event }) => {

    if (event.key === "ArrowUp") {

      event.preventDefault();

      setSelected((prev) =>
        prev <= 0
          ? items.length - 1
          : prev - 1
      );

      return true;
    }

    if (event.key === "ArrowDown") {

      event.preventDefault();

      setSelected((prev) =>
        prev >= items.length - 1
          ? 0
          : prev + 1
      );

      return true;
    }

    if (event.key === "Enter") {

      event.preventDefault();

      command(items[selected]);

      return true;
    }

    return false;
  },
}));

  return (
    <div
      className="
        w-80

        overflow-hidden

        rounded-2xl

        border
        border-slate-200

        bg-white

        p-2

        shadow-2xl
      "
    >
      <div
        className="
          mb-2

          px-3
          py-2

          text-xs

          font-semibold

          uppercase

          tracking-wider

          text-slate-400
        "
      >
        Commands
      </div>

      {items.map(
        (item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              type="button"
              onClick={() => {
  command(item);
}}
              className={`
                flex
                w-full
                items-center
                gap-3

                rounded-xl

                px-3
                py-3

                text-left

                transition

                ${
                  selected  ===
                  index
                    ? "bg-emerald-50"
                    : "hover:bg-slate-50"
                }
              `}
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center

                  rounded-xl

                  bg-slate-100
                "
              >
                <Icon
                  size={18}
                />
              </div>

              <div className="flex-1">
                <p
                  className="
                    font-medium

                    text-slate-900
                  "
                >
                  {item.title}
                </p>

                <p
                  className="
                    text-xs

                    text-slate-500
                  "
                >
                  {item.description}
                </p>
              </div>
            </button>
          );
        }
      )}
    </div>
  );
});

export default SlashCommands;