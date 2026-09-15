"use client";

import {
  BubbleMenu as TiptapBubbleMenu,
} from "@tiptap/react/menus";
import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  Link2,
} from "lucide-react";

interface BubbleMenuProps {
  editor: any;
}

export default function BubbleMenu({
  editor,
}: BubbleMenuProps) {
  if (!editor) return null;

  return (
<TiptapBubbleMenu
  editor={editor}
  options={{
    placement: "top",
  }}
>
      <div
        className="
          flex
          items-center
          gap-1

          rounded-2xl

          border
          border-slate-200

          bg-white

          p-2

          shadow-2xl
        "
      >
        {/* Bold */}

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          className={`
            rounded-lg
            p-2
            transition

            ${
              editor.isActive("bold")
                ? "bg-emerald-100 text-emerald-700"
                : "hover:bg-slate-100"
            }
          `}
        >
          <Bold size={16} />
        </button>

        {/* Italic */}

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          className={`
            rounded-lg
            p-2
            transition

            ${
              editor.isActive("italic")
                ? "bg-emerald-100 text-emerald-700"
                : "hover:bg-slate-100"
            }
          `}
        >
          <Italic size={16} />
        </button>

        {/* Underline */}

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleUnderline()
              .run()
          }
          className={`
            rounded-lg
            p-2
            transition

            ${
              editor.isActive("underline")
                ? "bg-emerald-100 text-emerald-700"
                : "hover:bg-slate-100"
            }
          `}
        >
          <Underline size={16} />
        </button>

        {/* Highlight */}

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHighlight()
              .run()
          }
          className={`
            rounded-lg
            p-2
            transition

            ${
              editor.isActive("highlight")
                ? "bg-yellow-200 text-yellow-700"
                : "hover:bg-slate-100"
            }
          `}
        >
          <Highlighter size={16} />
        </button>

        {/* Link */}

        <button
          onClick={() => {
            const url = window.prompt(
              "Enter URL"
            );

            if (!url) return;

            editor
              .chain()
              .focus()
              .setLink({
                href: url,
              })
              .run();
          }}
          className="
            rounded-lg
            p-2
            transition
            hover:bg-slate-100
          "
        >
          <Link2 size={16} />
        </button>
      </div>
   </TiptapBubbleMenu>
  );
}