"use client";

interface CharacterCounterProps {
  editor: any;
}

export default function CharacterCounter({
  editor,
}: CharacterCounterProps) {
  if (!editor) return null;

  const characters =
    editor.storage.characterCount.characters();

  const words =
    editor.storage.characterCount.words();

  return (
    <div
      className="
        flex
        items-center
        gap-4

        rounded-xl

        border
        border-slate-200

        bg-white

        px-4
        py-2

        text-sm

        text-slate-500

        shadow-sm
      "
    >
      <span>
        <strong className="text-slate-800">
          {words}
        </strong>{" "}
        Words
      </span>

      <span>
        <strong className="text-slate-800">
          {characters}
        </strong>{" "}
        Characters
      </span>
    </div>
  );
}