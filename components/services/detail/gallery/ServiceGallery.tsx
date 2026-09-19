"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { useState } from "react";

import type { IServiceMedia } from "@/models/Service";

interface ServiceGalleryProps {
  images: IServiceMedia[];
  serviceTitle: string;
}

export default function ServiceGallery({
  images,
  serviceTitle,
}: ServiceGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(
    null
  );

 if (!images || images.length === 0) {
  return (
    <section className="bg-[#F8FAFC] px-5 py-20 text-[#061A2B]">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold text-red-600">
          Gallery data is empty.
        </p>
      </div>
    </section>
  );
}

  const activeImage =
    activeIndex !== null ? images[activeIndex] : null;

  const showPrevious = () => {
    if (activeIndex === null || images.length <= 1) {
      return;
    }

    setActiveIndex(
      activeIndex === 0
        ? images.length - 1
        : activeIndex - 1
    );
  };

  const showNext = () => {
    if (activeIndex === null || images.length <= 1) {
      return;
    }

    setActiveIndex(
      activeIndex === images.length - 1
        ? 0
        : activeIndex + 1
    );
  };

  return (
    <>
      <section className="bg-[#F8FAFC] py-20 text-[#061A2B] sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {/* HEADER */}
          <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#0D6E91]">
                <Images className="h-4 w-4" />
                Service Gallery
              </div>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                See the service{" "}
                <span className="text-[#0D6E91]">
                  in action.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                Explore images related to{" "}
                {serviceTitle.toLowerCase()}.
              </p>
            </div>

            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Gallery
              </p>

              <p className="mt-1 text-sm font-bold text-slate-700">
                {images.length}{" "}
                {images.length === 1 ? "Image" : "Images"}
              </p>
            </div>
          </div>

          {/* GALLERY */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <button
                key={image.publicId}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group relative overflow-hidden rounded-2xl bg-slate-200 text-left outline-none focus-visible:ring-4 focus-visible:ring-[#0D6E91]/30"
                aria-label={`View gallery image ${index + 1} of ${images.length}`}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={image.secureUrl}
                    alt={
                      image.alt ||
                      `${serviceTitle} service image ${index + 1}`
                    }
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#061A2B]/70 via-transparent to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFD400]">
                        Service Image
                      </p>

                      <p className="mt-1 text-sm font-bold text-white">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                    </div>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition group-hover:bg-[#FFD400] group-hover:text-[#061A2B]">
                      <Images className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {activeImage && activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020B12]/95 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${serviceTitle} image gallery`}
          onClick={() => setActiveIndex(null)}
        >
          {/* CLOSE */}
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
            aria-label="Close gallery"
          >
            <X className="h-5 w-5" />
          </button>

          {/* PREVIOUS */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-[#FFD400] hover:text-[#061A2B] sm:left-6"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* ACTIVE IMAGE */}
          <div
            className="relative h-[78vh] w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activeImage.secureUrl}
              alt={
                activeImage.alt ||
                `${serviceTitle} service image ${
                  activeIndex + 1
                }`
              }
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-[#061A2B]/80 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
              {activeIndex + 1} / {images.length}
            </div>
          </div>

          {/* NEXT */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-[#FFD400] hover:text-[#061A2B] sm:right-6"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
    </>
  );
}