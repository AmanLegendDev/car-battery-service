"use client";

import { useState } from "react";

import {
  useEditor,
  EditorContent,
} from "@tiptap/react";

import {
  useRef,
  
} from "react";

import AutosaveBadge from "./AutosaveBadge";

import StarterKit from "@tiptap/starter-kit";

import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";

import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

import CharacterCount from "@tiptap/extension-character-count";

import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
} from "@tiptap/extension-table";

import { all, createLowlight } from "lowlight";

const lowlight = createLowlight(all);import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

import Toolbar from "./Toolbar";
import BubbleMenu from "./BubbleMenu";
import FloatingMenu from "./FloatingMenu";
import CharacterCounter from "./CharacterCounter";
import ReadingTime from "./ReadingTime";
import FullscreenButton from "./FullscreenButton";

import "./EditorStyles.css";

interface EditorProps {
  value?: string;

  onChange?: (
    html: string
  ) => void;
}

export default function Editor({
  value = "",
  onChange,
}: EditorProps) {

  const [
    fullscreen,
    setFullscreen,
  ] = useState(false);


  const [saving, setSaving] =
  useState(false);

const [saved, setSaved] =
  useState(true);

const [error, setError] =
  useState(false);


const autosaveTimeout =
  useRef<NodeJS.Timeout | null>(
    null
  );
  const editor =
    useEditor({

      immediatelyRender: false,

      extensions: [

        StarterKit.configure({
          codeBlock: false,
        }),

        CodeBlockLowlight.configure({
          lowlight,
        }),

        Placeholder.configure({
          placeholder:
            "Start writing your amazing article...",
        }),

        Underline,

        Highlight,

        Link.configure({
          openOnClick: false,

          autolink: true,

          linkOnPaste: true,
        }),

        Image,

        Youtube.configure({
          controls: true,

          nocookie: true,
        }),

        TextAlign.configure({
          types: [
            "heading",
            "paragraph",
          ],
        }),

        TaskList,

        TaskItem.configure({
          nested: true,
        }),

        Table.configure({
          resizable: true,
        }),

        TableRow,

        TableHeader,

        TableCell,

        CharacterCount.configure({
          limit: 50000,
        }),
      ],

      content: value,

      editorProps: {
        attributes: {
          class:
            "editor-content min-h-[500px] focus:outline-none",
        },
      },

    onUpdate({ editor }) {

  setSaving(true);
  setSaved(false);
  setError(false);

  onChange?.(
    editor.getHTML()
  );

  if (autosaveTimeout.current) {
    clearTimeout(
      autosaveTimeout.current
    );
  }

  autosaveTimeout.current =
    setTimeout(() => {

      setSaving(false);

      setSaved(true);

    }, 700);
},
    });

  if (!editor) {
    return null;
  }

    return (
    <div
      className={
        fullscreen
          ? `
fixed
inset-0
z-[9999]

overflow-auto

bg-slate-100

p-8
`
          : ""
      }
    >
      <div
        className="
          overflow-hidden

          rounded-3xl

          border
          border-slate-200

          bg-white

          shadow-xl
        "
      >
        {/* Toolbar */}

        <Toolbar
          editor={editor}
        />

        {/* Bubble */}

        <BubbleMenu
          editor={editor}
        />

        {/* Floating */}

        <FloatingMenu
          editor={editor}
        />

        {/* Editor */}

        <div
          className="
            min-h-[550px]

            border-y
            border-slate-200

            bg-white

            p-8
          "
        >
          <EditorContent
            editor={editor}
          />
        </div>

        {/* Footer */}

        <div
          className="
            flex

            flex-wrap

            items-center

            justify-between

            gap-4

            bg-slate-50

            px-6
            py-4
          "
        >
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
            "
          >
            <CharacterCounter
              editor={editor}
            />

            <AutosaveBadge
  saving={saving}
  saved={saved}
  error={error}
/>

            <ReadingTime
              editor={editor}
            />
          </div>

          <FullscreenButton
            fullscreen={
              fullscreen
            }
            setFullscreen={
              setFullscreen
            }
          />
        </div>
      </div>
    </div>
  );
}
