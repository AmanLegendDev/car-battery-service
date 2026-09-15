"use client";

import type { Editor } from "@tiptap/react";
import ImageUploader from "./ImageUploader";

import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Code2,
  Link2,
  Image,
Play,
  Minus,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

interface Props {
  editor: Editor | null;
}

export default function Toolbar({
  editor,
}: Props) {
  if (!editor) return null;

  function Button({
    onClick,
    active,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`
          flex
          h-10
          w-10
          items-center
          justify-center

          rounded-xl

          transition

          ${
            active
              ? "bg-emerald-600 text-white"
              : "hover:bg-slate-100"
          }
        `}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      className="
        sticky
        top-0
        z-20

        flex
        flex-wrap
        gap-2

        border-b
        border-slate-200

        bg-white

        p-3
      "
    >
      {/* Undo */}

      <Button
        onClick={() =>
          editor.chain().focus().undo().run()
        }
      >
        <Undo2 size={18} />
      </Button>

      {/* Redo */}

      <Button
        onClick={() =>
          editor.chain().focus().redo().run()
        }
      >
        <Redo2 size={18} />
      </Button>

      <div className="mx-2 w-px bg-slate-200" />

      {/* Heading */}

      <Button
        active={editor.isActive("heading", { level: 1 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        <Heading1 size={18} />
      </Button>

      <Button
        active={editor.isActive("heading", { level: 2 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 size={18} />
      </Button>

      <Button
        active={editor.isActive("heading", { level: 3 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        <Heading3 size={18} />
      </Button>

      <div className="mx-2 w-px bg-slate-200" />

      {/* Text */}

      <Button
        active={editor.isActive("bold")}
        onClick={() =>
          editor.chain().focus().toggleBold().run()
        }
      >
        <Bold size={18} />
      </Button>

      <Button
        active={editor.isActive("italic")}
        onClick={() =>
          editor.chain().focus().toggleItalic().run()
        }
      >
        <Italic size={18} />
      </Button>

      <Button
        active={editor.isActive("underline")}
        onClick={() =>
          editor.chain().focus().toggleUnderline().run()
        }
      >
        <Underline size={18} />
      </Button>

      <Button
        active={editor.isActive("highlight")}
        onClick={() =>
          editor.chain().focus().toggleHighlight().run()
        }
      >
        <Highlighter size={18} />
      </Button>

      <Button
        active={editor.isActive("blockquote")}
        onClick={() =>
          editor.chain().focus().toggleBlockquote().run()
        }
      >
        <Quote size={18} />
      </Button>

      <Button
        active={editor.isActive("codeBlock")}
        onClick={() =>
          editor.chain().focus().toggleCodeBlock().run()
        }
      >
        <Code2 size={18} />
      </Button>

      <div className="mx-2 w-px bg-slate-200" />

      {/* Lists */}

      <Button
        active={editor.isActive("bulletList")}
        onClick={() =>
          editor.chain().focus().toggleBulletList().run()
        }
      >
        <List size={18} />
      </Button>

      <Button
        active={editor.isActive("orderedList")}
        onClick={() =>
          editor.chain().focus().toggleOrderedList().run()
        }
      >
        <ListOrdered size={18} />
      </Button>

      <Button
        active={editor.isActive("taskList")}
        onClick={() =>
          editor.chain().focus().toggleTaskList().run()
        }
      >
        <ListChecks size={18} />
      </Button>

      <div className="mx-2 w-px bg-slate-200" />

      {/* Alignment */}

      <Button
        onClick={() =>
          editor.chain().focus().setTextAlign("left").run()
        }
      >
        <AlignLeft size={18} />
      </Button>

      <Button
        onClick={() =>
          editor.chain().focus().setTextAlign("center").run()
        }
      >
        <AlignCenter size={18} />
      </Button>

      <Button
        onClick={() =>
          editor.chain().focus().setTextAlign("right").run()
        }
      >
        <AlignRight size={18} />
      </Button>

      <div className="mx-2 w-px bg-slate-200" />

      {/* Link */}

      <Button
        onClick={() => {
          const url = window.prompt("Enter URL");

          if (!url) return;

          editor
            .chain()
            .focus()
            .setLink({
              href: url,
            })
            .run();
        }}
      >
        <Link2 size={18} />
      </Button>

      {/* Image */}

      <Button
        onClick={() => {
          const url = window.prompt("Image URL");

          if (!url) return;

          editor
            .chain()
            .focus()
            .setImage({
              src: url,
            })
            .run();
        }}
      >
        <Image size={18} />
      </Button>

      {/* Youtube */}

      <Button
        onClick={() => {
          const url = window.prompt("Youtube URL");

          if (!url) return;

          editor
            .chain()
            .focus()
            .setYoutubeVideo({
              src: url,
            })
            .run();
        }}
      >
        <Play size={18} />
      </Button>

      {/* Divider */}

      <Button
        onClick={() =>
          editor.chain().focus().setHorizontalRule().run()
        }
      >
        <Minus size={18} />
      </Button>
    </div>
  );
}