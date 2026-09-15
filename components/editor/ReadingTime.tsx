"use client";

import {
  BookOpen,
} from "lucide-react";

interface ReadingTimeProps {
  editor: any;
}

export default function ReadingTime({
  editor,
}: ReadingTimeProps) {
  if (!editor) return null;

  const words =
    editor.storage.characterCount.words();

  // Average reading speed: 200 words/min
  const readingTime = Math.max(
    1,
    Math.ceil(words / 200)
  );

  return (
    <div
      className="
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

        text-slate-600

        shadow-sm
      "
    >
      <BookOpen
        size={16}
        className="text-emerald-600"
      />

      <span>
        <strong className="text-slate-900">
          {readingTime}
        </strong>{" "}
        min read
      </span>
    </div>
  );
}