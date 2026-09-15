"use client";

import { useState } from "react";

import {
  Play,
  X,
} from "lucide-react";

interface YoutubeDialogProps {
  editor: any;
}

export default function YoutubeDialog({
  editor,
}: YoutubeDialogProps) {
  const [open, setOpen] =
    useState(false);

  const [url, setUrl] =
    useState("");

  function insertVideo() {
    if (!url.trim()) return;

    editor
      ?.chain()
      .focus()
      .setYoutubeVideo({
        src: url,
        width: 960,
        height: 540,
      })
      .run();

    setUrl("");
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          transition
          hover:bg-slate-100
        "
      >
        <Play size={18} />
      </button>

      {open && (
        <div
          className="
            fixed
            inset-0
            z-[9999]

            flex
            items-center
            justify-center

            bg-black/40
            backdrop-blur-sm
          "
        >
          <div
            className="
              w-full
              max-w-lg

              rounded-3xl
              bg-white

              p-6

              shadow-2xl
            "
          >
            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Insert YouTube Video
              </h2>

              <button
                onClick={() =>
                  setOpen(false)
                }
              >
                <X size={20} />
              </button>

            </div>

            <input
              value={url}
              onChange={(e) =>
                setUrl(e.target.value)
              }
              placeholder="https://youtube.com/watch?v=..."
              className="
                w-full

                rounded-xl
                border

                p-3

                outline-none

                focus:border-emerald-500
              "
            />

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="
                  rounded-xl
                  border

                  px-5
                  py-2
                "
              >
                Cancel
              </button>

              <button
                onClick={insertVideo}
                className="
                  rounded-xl

                  bg-emerald-600

                  px-5
                  py-2

                  font-medium

                  text-white

                  hover:bg-emerald-700
                "
              >
                Insert Video
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}