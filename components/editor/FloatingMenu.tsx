"use client";

import {
  FloatingMenu as TiptapFloatingMenu,
} from "@tiptap/react/menus";
import {
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code2,
} from "lucide-react";

interface FloatingMenuProps {
  editor: any;
}

export default function FloatingMenu({
  editor,
}: FloatingMenuProps) {
  if (!editor) return null;

  return (
<TiptapFloatingMenu
  editor={editor}
  shouldShow={({ editor }) => {
    const { $from } = editor.state.selection;

    return (
      editor.isEditable &&
      $from.parent.textContent === ""
    );
  }}
>
      <div
        className="
          flex
          flex-col
          gap-1

          rounded-2xl

          border
          border-slate-200

          bg-white

          p-2

          shadow-2xl
        "
      >
        {/* Heading 1 */}

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 1,
              })
              .run()
          }
          className="
            flex
            items-center
            gap-2

            rounded-lg

            px-3
            py-2

            text-sm

            transition

            hover:bg-slate-100
          "
        >
          <Heading1 size={16} />

          Heading 1
        </button>

        {/* Heading 2 */}

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
          className="
            flex
            items-center
            gap-2

            rounded-lg

            px-3
            py-2

            text-sm

            transition

            hover:bg-slate-100
          "
        >
          <Heading2 size={16} />

          Heading 2
        </button>

        {/* Bullet */}

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          className="
            flex
            items-center
            gap-2

            rounded-lg

            px-3
            py-2

            text-sm

            transition

            hover:bg-slate-100
          "
        >
          <List size={16} />

          Bullet List
        </button>

        {/* Number */}

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
          className="
            flex
            items-center
            gap-2

            rounded-lg

            px-3
            py-2

            text-sm

            transition

            hover:bg-slate-100
          "
        >
          <ListOrdered size={16} />

          Number List
        </button>

        {/* Quote */}

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBlockquote()
              .run()
          }
          className="
            flex
            items-center
            gap-2

            rounded-lg

            px-3
            py-2

            text-sm

            transition

            hover:bg-slate-100
          "
        >
          <Quote size={16} />

          Quote
        </button>

        {/* Code */}

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleCodeBlock()
              .run()
          }
          className="
            flex
            items-center
            gap-2

            rounded-lg

            px-3
            py-2

            text-sm

            transition

            hover:bg-slate-100
          "
        >
          <Code2 size={16} />

          Code Block
        </button>
      </div>
    </TiptapFloatingMenu>
  );
}