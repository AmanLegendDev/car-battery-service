"use client";

import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import { useRef, useState } from "react";
import type { ChangeEvent } from "react";

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
  Table,
  Rows3,
  Columns3,
  Trash2,
  Plus,
    Loader2,
} from "lucide-react";

interface Props {
  editor: Editor | null;
}

export default function Toolbar({ editor }: Props) {



  const imageInputRef = useRef<HTMLInputElement>(null);
const imagePositionRef = useRef<number | null>(null);
const [isUploadingImage, setIsUploadingImage] = useState(false);


async function handleImageUpload(
  event: ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0];
  event.target.value = "";

  if (!file || !editor) return;

  if (!file.type.startsWith("image/")) {
    window.alert("Please select a valid image.");
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    window.alert("Image must be 10 MB or smaller.");
    return;
  }

  try {
    setIsUploadingImage(true);

    const cloudName =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
      throw new Error(
        "Cloudinary cloud name is missing from environment variables."
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "car-battery-service/blog-content";

    const signatureResponse = await fetch(
      "/api/admin/cloudinary/sign",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paramsToSign: {
            timestamp,
            folder,
          },
        }),
      }
    );

    const signatureData = (await signatureResponse.json()) as {
      signature?: string;
      apiKey?: string;
      message?: string;
    };

    if (
      !signatureResponse.ok ||
      !signatureData.signature ||
      !signatureData.apiKey
    ) {
      throw new Error(
        signatureData.message ||
          "Could not generate Cloudinary upload signature."
      );
    }

    const uploadData = new FormData();

    uploadData.append("file", file);
    uploadData.append("api_key", signatureData.apiKey);
    uploadData.append("timestamp", String(timestamp));
    uploadData.append("folder", folder);
    uploadData.append("signature", signatureData.signature);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const uploadedImage = (await uploadResponse.json()) as {
      secure_url?: string;
      error?: {
        message?: string;
      };
    };

    if (!uploadResponse.ok || !uploadedImage.secure_url) {
      throw new Error(
        uploadedImage.error?.message ||
          "Cloudinary image upload failed."
      );
    }

    const position = Math.min(
      imagePositionRef.current ?? editor.state.selection.from,
      editor.state.doc.content.size
    );

    editor
      .chain()
      .focus()
      .insertContentAt(position, {
        type: "image",
        attrs: {
          src: uploadedImage.secure_url,
          alt: file.name,
        },
      })
      .run();
  } catch (error) {
    console.error("Blog content image upload:", error);

    window.alert(
      error instanceof Error
        ? error.message
        : "Could not upload the image."
    );
  } finally {
    setIsUploadingImage(false);
  }
}

  // Subscribe to table selection changes so table controls
  // appear/disappear when the cursor enters/leaves a table.
  const tableState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isTableActive: editor?.isActive("table") ?? false,
      isHeaderActive: editor?.isActive("tableHeader") ?? false,
    }),
  });

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
          // Preserve the editor selection when clicking toolbar controls.
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
          disabled ? "cursor-not-allowed opacity-40" : "",
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

  const canUndo = editor.can().chain().undo().run();
  const canRedo = editor.can().chain().redo().run();

  function insertTable() {
    const rowsInput = window.prompt(
      "Number of rows (1–20)",
      "3",
    );

    if (rowsInput === null) {
      return;
    }

    const colsInput = window.prompt(
      "Number of columns (1–10)",
      "3",
    );

    if (colsInput === null) {
      return;
    }

    const rows = Number(rowsInput.trim());
    const cols = Number(colsInput.trim());

    if (
      !Number.isInteger(rows) ||
      !Number.isInteger(cols) ||
      rows < 1 ||
      rows > 20 ||
      cols < 1 ||
      cols > 10
    ) {
      window.alert(
        "Please enter 1–20 rows and 1–10 columns.",
      );
      return;
    }

   if (!editor) {
  return;
}

editor
  .chain()
  .focus()
  .insertTable({
    rows,
    cols,
    withHeaderRow: true,
  })
  .run();
  }

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
      {/* HISTORY */}

      <Button
        title="Undo"
        disabled={!canUndo}
        onClick={() => {
          editor.chain().focus().undo().run();
        }}
      >
        <Undo2 size={17} />
      </Button>

      <Button
        title="Redo"
        disabled={!canRedo}
        onClick={() => {
          editor.chain().focus().redo().run();
        }}
      >
        <Redo2 size={17} />
      </Button>

      <Divider />

      {/* BLOCK TYPE */}

      <Button
        title="Paragraph"
        active={editor.isActive("paragraph")}
        onClick={() => {
          editor.chain().focus().setParagraph().run();
        }}
      >
        <Type size={17} />
      </Button>

      <Button
        title="Heading 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
      >
        <Heading1 size={17} />
      </Button>

      <Button
        title="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
      >
        <Heading2 size={17} />
      </Button>

      <Button
        title="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
      >
        <Heading3 size={17} />
      </Button>

      <Button
        title="Heading 4"
        active={editor.isActive("heading", { level: 4 })}
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 4 }).run();
        }}
      >
        <Heading4 size={17} />
      </Button>

      <Divider />

      {/* TEXT FORMATTING */}

      <Button
        title="Bold"
        active={editor.isActive("bold")}
        onClick={() => {
          editor.chain().focus().toggleBold().run();
        }}
      >
        <Bold size={17} />
      </Button>

      <Button
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => {
          editor.chain().focus().toggleItalic().run();
        }}
      >
        <Italic size={17} />
      </Button>

      <Button
        title="Underline"
        active={editor.isActive("underline")}
        onClick={() => {
          editor.chain().focus().toggleUnderline().run();
        }}
      >
        <Underline size={17} />
      </Button>

      <Button
        title="Highlight"
        active={editor.isActive("highlight")}
        onClick={() => {
          editor.chain().focus().toggleHighlight().run();
        }}
      >
        <Highlighter size={17} />
      </Button>

      <Divider />

      {/* LISTS */}

      <Button
        title="Bullet List"
        active={editor.isActive("bulletList")}
        onClick={() => {
          editor.chain().focus().toggleBulletList().run();
        }}
      >
        <List size={17} />
      </Button>

      <Button
        title="Numbered List"
        active={editor.isActive("orderedList")}
        onClick={() => {
          editor.chain().focus().toggleOrderedList().run();
        }}
      >
        <ListOrdered size={17} />
      </Button>

      <Button
        title="Task List"
        active={editor.isActive("taskList")}
        onClick={() => {
          editor.chain().focus().toggleTaskList().run();
        }}
      >
        <ListChecks size={17} />
      </Button>

      <Divider />

      {/* BLOCKS */}

      <Button
        title="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() => {
          editor.chain().focus().toggleBlockquote().run();
        }}
      >
        <Quote size={17} />
      </Button>

      <Button
        title="Code Block"
        active={editor.isActive("codeBlock")}
        onClick={() => {
          editor.chain().focus().toggleCodeBlock().run();
        }}
      >
        <Code2 size={17} />
      </Button>

      <Button
        title="Horizontal Divider"
        onClick={() => {
          editor.chain().focus().setHorizontalRule().run();
        }}
      >
        <Minus size={17} />
      </Button>

      <Divider />

      {/* ALIGNMENT */}

      <Button
        title="Align Left"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => {
          editor.chain().focus().setTextAlign("left").run();
        }}
      >
        <AlignLeft size={17} />
      </Button>

      <Button
        title="Align Center"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => {
          editor.chain().focus().setTextAlign("center").run();
        }}
      >
        <AlignCenter size={17} />
      </Button>

      <Button
        title="Align Right"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => {
          editor.chain().focus().setTextAlign("right").run();
        }}
      >
        <AlignRight size={17} />
      </Button>

      <Divider />

      {/* TABLES */}

      <Button
        title="Insert Table"
        onClick={insertTable}
      >
        <Table size={17} />
      </Button>

      {tableState?.isTableActive && (
        <>
          <Divider />

          <Button
            title="Add Row Before"
            onClick={() => {
              editor.chain().focus().addRowBefore().run();
            }}
          >
            <Rows3 size={17} />
          </Button>

          <Button
            title="Add Row After"
            onClick={() => {
              editor.chain().focus().addRowAfter().run();
            }}
          >
            <span className="relative flex items-center justify-center">
              <Rows3 size={17} />
              <Plus
                size={10}
                className="absolute -right-1 -top-1 rounded-full bg-white"
              />
            </span>
          </Button>

          <Button
            title="Add Column Before"
            onClick={() => {
              editor.chain().focus().addColumnBefore().run();
            }}
          >
            <Columns3 size={17} />
          </Button>

          <Button
            title="Add Column After"
            onClick={() => {
              editor.chain().focus().addColumnAfter().run();
            }}
          >
            <span className="relative flex items-center justify-center">
              <Columns3 size={17} />
              <Plus
                size={10}
                className="absolute -right-1 -top-1 rounded-full bg-white"
              />
            </span>
          </Button>

          <Button
            title="Toggle Header Row"
            active={tableState.isHeaderActive}
            onClick={() => {
              editor.chain().focus().toggleHeaderRow().run();
            }}
          >
            <span className="text-xs font-black">TH</span>
          </Button>

          <Button
            title="Delete Current Row"
            onClick={() => {
              editor.chain().focus().deleteRow().run();
            }}
          >
            <span className="relative flex items-center justify-center">
              <Rows3 size={17} />
              <Trash2
                size={10}
                className="absolute -right-1 -top-1 rounded-full bg-white text-red-600"
              />
            </span>
          </Button>

          <Button
            title="Delete Current Column"
            onClick={() => {
              editor.chain().focus().deleteColumn().run();
            }}
          >
            <span className="relative flex items-center justify-center">
              <Columns3 size={17} />
              <Trash2
                size={10}
                className="absolute -right-1 -top-1 rounded-full bg-white text-red-600"
              />
            </span>
          </Button>

          <Button
            title="Delete Entire Table"
            onClick={() => {
              const confirmed = window.confirm(
                "Delete the entire table?",
              );

              if (confirmed) {
                editor.chain().focus().deleteTable().run();
              }
            }}
          >
            <Trash2 size={17} />
          </Button>
        </>
      )}

      <Divider />

      {/* LINKS */}

      <Button
        title="Add Link"
        active={editor.isActive("link")}
        onClick={() => {
          const previousUrl =
            editor.getAttributes("link").href || "";

          const url = window.prompt(
            "Enter URL",
            previousUrl,
          );

          if (url === null) {
            return;
          }

          const trimmedUrl = url.trim();

          if (!trimmedUrl) {
            editor.chain().focus().unsetLink().run();
            return;
          }

          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: trimmedUrl })
            .run();
        }}
      >
        <Link2 size={17} />
      </Button>

      {/* IMAGES */}

   <Button
  title={
    isUploadingImage
      ? "Uploading image..."
      : "Upload image from computer"
  }
  disabled={isUploadingImage}
  onClick={() => {
    imagePositionRef.current =
      editor.state.selection.from;

    imageInputRef.current?.click();
  }}
>
  {isUploadingImage ? (
    <Loader2 size={17} className="animate-spin" />
  ) : (
    <ImageIcon size={17} />
  )}
</Button>

<input
  ref={imageInputRef}
  type="file"
  accept="image/*"
  hidden
  onChange={handleImageUpload}
/>

      {/* YOUTUBE */}

      <Button
        title="Add YouTube Video"
        onClick={() => {
          const url = window.prompt("YouTube URL");

          if (!url) {
            return;
          }

          const trimmedUrl = url.trim();

          if (!trimmedUrl) {
            return;
          }

          editor
            .chain()
            .focus()
            .setYoutubeVideo({ src: trimmedUrl })
            .run();
        }}
      >
        <Play size={17} />
      </Button>
    </div>
  );
}