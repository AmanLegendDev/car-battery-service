import Image from "next/image";
import { UserRound } from "lucide-react";

interface BlogMedia {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: "image";
  alt: string;
}

interface BlogAuthorCardProps {
  authorName: string;
  authorRole: string;
  authorImage: BlogMedia | null;
}

export default function BlogAuthorCard({
  authorName,
  authorRole,
  authorImage,
}: BlogAuthorCardProps) {
  if (!authorName && !authorRole && !authorImage) {
    return null;
  }

  return (
    <section className="bg-[#F8FAFC] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-[#DDE7ED] bg-white p-6 shadow-[0_16px_45px_rgba(6,26,43,0.06)] sm:p-8">
          {/* Ambient */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#0D6E91]/[0.06] blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#061A2B]">
              {authorImage?.secureUrl ? (
                <Image
                  src={authorImage.secureUrl}
                  alt={
                    authorImage.alt ||
                    authorName ||
                    "Article author"
                  }
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#FFD400]">
                  <UserRound size={25} strokeWidth={1.7} />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0D6E91]">
                Written by
              </p>

              {authorName && (
                <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[#061A2B]">
                  {authorName}
                </h2>
              )}

              {authorRole && (
                <p className="mt-1 text-sm text-[#71828D]">
                  {authorRole}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}