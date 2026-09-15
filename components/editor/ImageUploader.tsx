"use client";

import { ImagePlus } from "lucide-react";

interface ImageUploaderProps {
  editor: any;
}

export default function ImageUploader({
  editor,
}: ImageUploaderProps) {
  async function uploadImage(
    file: File
  ) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
      "/api/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      alert("Image upload failed.");
      return;
    }

    const data =
      await response.json();

    editor
      ?.chain()
      .focus()
      .setImage({
        src: data.url,
      })
      .run();
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      e.target.files?.[0];

    if (!file) return;

    uploadImage(file);
  }

  return (
    <label
      className="
        flex
        h-9
        w-9
        cursor-pointer
        items-center
        justify-center
        rounded-lg
        transition
        hover:bg-slate-100
      "
    >
      <ImagePlus size={18} />

      <input
        hidden
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
    </label>
  );
}