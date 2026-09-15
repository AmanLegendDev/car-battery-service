import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowLeft,
  FileText,
} from "lucide-react";

import BlogForm from "@/components/admin/blog/BlogForm";

export const metadata: Metadata = {
  title:
    "Create Blog Post | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewBlogPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        {/* ================================================
            PAGE HEADER
        ================================================= */}

        <div className="mb-6">
          <Link
            href="/admin/blog"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#061A2B]"
          >
            <ArrowLeft
              size={16}
            />
            Back to Blog
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#061A2B] text-[#FFD400] shadow-lg shadow-[#061A2B]/10">
                <FileText
                  size={21}
                />
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0D6E91]">
                  Blog CMS
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#061A2B] sm:text-3xl">
                  Create New Blog Post
                </h1>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  Create a structured, SEO-ready article using the rich content editor.
                </p>
              </div>
            </div>
          </div>
        </div>

        <BlogForm />
      </div>
    </main>
  );
}