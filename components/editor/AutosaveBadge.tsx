"use client";

import {
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface AutosaveBadgeProps {
  saving: boolean;
  saved: boolean;
  error?: boolean;
}

export default function AutosaveBadge({
  saving,
  saved,
  error = false,
}: AutosaveBadgeProps) {
  if (saving) {
    return (
      <div
        className="
          inline-flex
          items-center
          gap-2

          rounded-xl

          border
          border-blue-200

          bg-blue-50

          px-4
          py-2

          text-sm
          font-medium

          text-blue-700

          shadow-sm
        "
      >
        <Loader2
          size={16}
          className="animate-spin"
        />

        Saving...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="
          inline-flex
          items-center
          gap-2

          rounded-xl

          border
          border-red-200

          bg-red-50

          px-4
          py-2

          text-sm
          font-medium

          text-red-700

          shadow-sm
        "
      >
        <AlertCircle size={16} />

        Save Failed
      </div>
    );
  }

  if (saved) {
    return (
      <div
        className="
          inline-flex
          items-center
          gap-2

          rounded-xl

          border
          border-emerald-200

          bg-emerald-50

          px-4
          py-2

          text-sm
          font-medium

          text-emerald-700

          shadow-sm
        "
      >
        <CheckCircle2 size={16} />

        Saved
      </div>
    );
  }

  return (
    <div
      className="
        inline-flex
        items-center
        gap-2

        rounded-xl

        border
        border-slate-200

        bg-slate-50

        px-4
        py-2

        text-sm

        text-slate-500
      "
    >
      Ready
    </div>
  );
}