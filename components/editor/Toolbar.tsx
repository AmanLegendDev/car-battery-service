"use client";

import type { Editor } from "@tiptap/react";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Play,
  Quote,
  Redo2,
  Type,
  Underline,
  Undo2,
} from "lucide-react";

interface Props {
  editor: Editor | null;
}

export default function Toolbar({
  editor,
}: Props) {
  if (!editor) {
    return null;
  }

  function Button({
    onClick,
    active = false,
    disabled = false,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) {
    return (
      <button
        type="button"
        title={title}
        aria-label={title}
        disabled={disabled}
        onMouseDown={(event) => {
          /*
           * Prevent the editor from losing its selection
           * before the formatting command runs.
           */
          event.preventDefault();
        }}
        onClick={onClick}
        className={[
          "flex h-10 w-10 shrink-0 items-center justify-center",
          "rounded-xl border transition-all duration-150",
          "focus:outline-none focus:ring-2 focus:ring-[#0D6E91]/20",

          active
            ? "border-[#0D6E91] bg-[#061A2B] text-[#FFD400]"
            : "border-transparent bg-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-[#061A2B]",

          disabled
            ? "cursor-not-allowed opacity-40"
            : "",
        ].join(" ")}
      >
        {children}
      </button>
    );
  }

  function Divider() {
    return (
      <div
        aria-hidden="true"
        className="mx-1 hidden h-7 w-px bg-slate-200 sm:block"
      />
    );
  }

  const canUndo = editor.can().chain().focus().undo().run();
  const canRedo = editor.can().chain().focus().redo().run();

  return (
    <div
      className="
        sticky
        top-0
        z-20

        flex
        flex-wrap
        items-center
        gap-1.5

        border-b
        border-slate-200

        bg-white/95
        p-3

        backdrop-blur-md
      "
    >
      {/* =========================
          HISTORY
      ========================== */}

      <Button
        title="Undo"
        disabled={!canUndo}
        onClick={() => {
          editor
            .chain()
            .focus()
            .undo()
            .run();
        }}
      >
        <Undo2 size={17} />
      </Button>

      <Button
        title="Redo"
        disabled={!canRedo}
        onClick={() => {
          editor
            .chain()
            .focus()
            .redo()
            .run();
        }}
      >
        <Redo2 size={17} />
      </Button>

      <Divider />

      {/* =========================
          BLOCK TYPE
      ========================== */}

      <Button
        title="Paragraph"
        active={editor.isActive("paragraph")}
        onClick={() => {
          editor
            .chain()
            .focus()
            .setParagraph()
            .run();
        }}
      >
        <Type size={17} />
      </Button>

      <Button
        title="Heading 1"
        active={editor.isActive("heading", {
          level: 1,
        })}
        onClick={() => {
          editor
            .chain()
            .focus()
            .toggleHeading({
              level: 1,
            })
            .run();
        }}
      >
        <Heading1 size={17} />
      </Button>

      <Button
        title="Heading 2"
        active={editor.isActive("heading", {
          level: 2,
        })}
        onClick={() => {
          editor
            .chain()
            .focus()
            .toggleHeading({
              level: 2,
            })
            .run();
        }}
      >
        <Heading2 size={17} />
      </Button>

      <Button
        title="Heading 3"
        active={editor.isActive("heading", {
          level: 3,
        })}
        onClick={() => {
          editor
            .chain()
            .focus()
            .toggleHeading({
              level: 3,
            })
            .run();
        }}
      >
        <Heading3 size={17} />
      </Button>

      <Button
        title="Heading 4"
        active={editor.isActive("heading", {
          level: 4,
        })}
        onClick={() => {
          editor
            .chain()
            .focus()
            .toggleHeading({
              level: 4,
            })
            .run();
        }}
      >
        <Heading4 size={17} />
      </Button>

      <Divider />

      {/* =========================
          TEXT
      ========================== */}

      <Button
        title="Bold"
        active={editor.isActive("bold")}
        onClick={() => {
          editor
            .chain()
            .focus()
            .toggleBold()
            .run();
        }}
      >
        <Bold size={17} />
      </Button>

      <Button
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => {
          editor
            .chain()
            .focus()
            .toggleItalic()
            .run();
        }}
      >
        <Italic size={17} />
      </Button>

      <Button
        title="Underline"
        active={editor.isActive("underline")}
        onClick={() => {
          editor
            .chain()
            .focus()
            .toggleUnderline()
            .run();
        }}
      >
        <Underline size={17} />
      </Button>

      <Button
        title="Highlight"
        active={editor.isActive("highlight")}
        onClick={() => {
          editor
            .chain()
            .focus()
            .toggleHighlight()
            .run();
        }}
      >
        <Highlighter size={17} />
      </Button>

      <Divider />

      {/* =========================
          LISTS
      ========================== */}

      <Button
        title="Bullet List"
        active={editor.isActive("bulletList")}
        onClick={() => {
          editor
            .chain()
            .focus()
            .toggleBulletList()
            .run();
        }}
      >
        <List size={17} />
      </Button>

      <Button
        title="Numbered List"
        active={editor.isActive("orderedList")}
        onClick={() => {
          editor
            .chain()
            .focus()
            .toggleOrderedList()
            .run();
        }}
      >
        <ListOrdered size={17} />
      </Button>

      <Button
        title="Task List"
        active={editor.isActive("taskList")}
        onClick={() => {
          editor
            .chain()
            .focus()
            .toggleTaskList()
            .run();
        }}
      >
        <ListChecks size={17} />
      </Button>

      <Divider />

      {/* =========================
          BLOCKS
      ========================== */}

      <Button
        title="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() => {
          editor
            .chain()
            .focus()
            .toggleBlockquote()
            .run();
        }}
      >
        <Quote size={17} />
      </Button>

      <Button
        title="Code Block"
        active={editor.isActive("codeBlock")}
        onClick={() => {
          editor
            .chain()
            .focus()
            .toggleCodeBlock()
            .run();
        }}
      >
        <Code2 size={17} />
      </Button>

      <Button
        title="Horizontal Divider"
        onClick={() => {
          editor
            .chain()
            .focus()
            .setHorizontalRule()
            .run();
        }}
      >
        <Minus size={17} />
      </Button>

      <Divider />

      {/* =========================
          ALIGNMENT
      ========================== */}

      <Button
        title="Align Left"
        active={editor.isActive({
          textAlign: "left",
        })}
        onClick={() => {
          editor
            .chain()
            .focus()
            .setTextAlign("left")
            .run();
        }}
      >
        <AlignLeft size={17} />
      </Button>

      <Button
        title="Align Center"
        active={editor.isActive({
          textAlign: "center",
        })}
        onClick={() => {
          editor
            .chain()
            .focus()
            .setTextAlign("center")
            .run();
        }}
      >
        <AlignCenter size={17} />
      </Button>

      <Button
        title="Align Right"
        active={editor.isActive({
          textAlign: "right",
        })}
        onClick={() => {
          editor
            .chain()
            .focus()
            .setTextAlign("right")
            .run();
        }}
      >
        <AlignRight size={17} />
      </Button>

      <Divider />

      {/* =========================
          LINK
      ========================== */}

      <Button
        title="Add Link"
        active={editor.isActive("link")}
        onClick={() => {
          const previousUrl =
            editor.getAttributes("link").href ||
            "";

          const url = window.prompt(
            "Enter URL",
            previousUrl,
          );

          if (url === null) {
            return;
          }

          const trimmedUrl =
            url.trim();

          if (!trimmedUrl) {
            editor
              .chain()
              .focus()
              .unsetLink()
              .run();

            return;
          }

          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({
              href: trimmedUrl,
            })
            .run();
        }}
      >
        <Link2 size={17} />
      </Button>

      {/* =========================
          IMAGE
      ========================== */}

      <Button
        title="Add Image"
        onClick={() => {
          const url = window.prompt(
            "Image URL",
          );

          if (!url) {
            return;
          }

          const trimmedUrl =
            url.trim();

          if (!trimmedUrl) {
            return;
          }

          editor
            .chain()
            .focus()
            .setImage({
              src: trimmedUrl,
            })
            .run();
        }}
      >
        <ImageIcon size={17} />
      </Button>

      {/* =========================
          YOUTUBE
      ========================== */}

      <Button
        title="Add YouTube Video"
        onClick={() => {
          const url = window.prompt(
            "YouTube URL",
          );

          if (!url) {
            return;
          }

          const trimmedUrl =
            url.trim();

          if (!trimmedUrl) {
            return;
          }

          editor
            .chain()
            .focus()
            .setYoutubeVideo({
              src: trimmedUrl,
            })
            .run();
        }}
      >
        <Play size={17} />
      </Button>
    </div>
  );
}