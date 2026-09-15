"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";

import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

import CharacterCount from "@tiptap/extension-character-count";

import Toolbar from "./Toolbar";

import "./EditorStyles.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function TiptapEditor({
  value,
  onChange,
}: Props) {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),

      Underline,

      Highlight,

      Link.configure({
        openOnClick: false,

        autolink: true,

        linkOnPaste: true,
      }),

      Image,

      Placeholder.configure({
        placeholder:
          "Start writing your travel story...",
      }),

      TextAlign.configure({
        types: [
          "heading",
          "paragraph",
        ],
      }),

      Youtube.configure({
        controls: true,
        nocookie: true,
      }),

      TaskList,

      TaskItem.configure({
        nested: true,
      }),

      CharacterCount,
    ],

    content: value,

    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none min-h-[450px] px-6 py-5",
      },
    },

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div
      className="
        overflow-hidden

        rounded-2xl

        border

        border-slate-200

        bg-white

        shadow-sm
      "
    >
      <Toolbar editor={editor} />

      <EditorContent
        editor={editor}
      />

      <div
        className="
          flex

          items-center

          justify-between

          border-t

          border-slate-200

          bg-slate-50

          px-5

          py-3

          text-sm

          text-slate-500
        "
      >
        <span>
          Characters :
          {" "}
          {editor?.storage.characterCount.characters() ??
            0}
        </span>

        <span>
          Words :
          {" "}
          {editor?.storage.characterCount.words() ??
            0}
        </span>
      </div>
    </div>
  );
}