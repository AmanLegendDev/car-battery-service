import sanitizeHtml from "sanitize-html";

import BlogArticleToc from "./BlogArticleToc";

interface TocItem {
  id: string;
  label: string;
  level: 2 | 3;
}

interface BlogArticleContentProps {
  content: string;
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function decodeHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .trim();
}

function prepareArticle(content: string) {
  const sanitized = sanitizeHtml(content, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "mark",

      "h1",
      "h2",
      "h3",
      "h4",

      "ul",
      "ol",
      "li",

      "blockquote",
      "hr",

      "a",
      "img",

      "figure",
      "figcaption",

      "pre",
      "code",

      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",

      "div",
      "span",
    ],

    allowedAttributes: {
      a: [
        "href",
        "target",
        "rel",
        "title",
      ],

      img: [
        "src",
        "alt",
        "title",
        "width",
        "height",
      ],

      "*": [
        "class",
        "style",
      ],
    },

    allowedSchemes: [
      "http",
      "https",
      "mailto",
    ],

    allowedSchemesByTag: {
      img: ["http", "https"],
    },

    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href || "";

        return {
          tagName,
          attribs: {
            ...attribs,
            href,
            target: "_blank",
            rel: "noopener noreferrer",
          },
        };
      },
    },
  });

  const usedIds = new Map<string, number>();
  const toc: TocItem[] = [];

  const html = sanitized.replace(
    /<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi,
    (
      fullMatch,
      tagName,
      attributes,
      innerHtml,
    ) => {
      const text = decodeHtml(innerHtml);

      if (!text) {
        return fullMatch;
      }

      const baseId =
        createSlug(text) ||
        `section-${toc.length + 1}`;

      const count =
        usedIds.get(baseId) || 0;

      usedIds.set(baseId, count + 1);

      const id =
        count === 0
          ? baseId
          : `${baseId}-${count + 1}`;

      const level =
        tagName.toLowerCase() === "h3"
          ? 3
          : 2;

      toc.push({
        id,
        label: text,
        level,
      });

      const existingId =
        attributes.match(
          /\sid=["']([^"']+)["']/i,
        );

      const nextAttributes =
        existingId
          ? attributes.replace(
              /\sid=["'][^"']+["']/i,
              ` id="${id}"`,
            )
          : `${attributes} id="${id}"`;

      return `<${tagName}${nextAttributes}>${innerHtml}</${tagName}>`;
    },
  );

  return {
    html,
    toc,
  };
}

export default function BlogArticleContent({
  content,
}: BlogArticleContentProps) {
  const article = prepareArticle(content);

  if (!article.html.trim()) {
    return (
      <section
        id="article-content"
        className="bg-[#F8FAFC] px-5 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[2rem] border border-[#DDE7ED] bg-white px-6 py-14 text-center shadow-[0_18px_50px_rgba(6,26,43,0.06)]">
            <p className="text-sm text-[#687B86]">
              This article does not have published content yet.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="article-content"
      className="bg-[#F8FAFC] px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,820px)_280px] lg:justify-center lg:gap-16">
          {/* ARTICLE */}
          <article className="min-w-0">
            <div
              className="
                blog-prose

                text-[#425866]

                [&>h1]:mb-8
                [&>h1]:mt-0
                [&>h1]:text-4xl
                [&>h1]:font-semibold
                [&>h1]:leading-[1.08]
                [&>h1]:tracking-[-0.04em]
                [&>h1]:text-[#061A2B]
                sm:[&>h1]:text-5xl

                [&>h2]:relative
                [&>h2]:mb-5
                [&>h2]:mt-16
                [&>h2]:scroll-mt-28
                [&>h2]:text-2xl
                [&>h2]:font-semibold
                [&>h2]:leading-[1.15]
                [&>h2]:tracking-[-0.03em]
                [&>h2]:text-[#061A2B]
                sm:[&>h2]:text-3xl

                [&>h3]:mb-4
                [&>h3]:mt-11
                [&>h3]:scroll-mt-28
                [&>h3]:text-xl
                [&>h3]:font-semibold
                [&>h3]:leading-[1.2]
                [&>h3]:tracking-[-0.02em]
                [&>h3]:text-[#061A2B]
                sm:[&>h3]:text-2xl

                [&>h4]:mb-3
                [&>h4]:mt-8
                [&>h4]:text-lg
                [&>h4]:font-semibold
                [&>h4]:text-[#061A2B]

                [&>p]:mb-7
                [&>p]:text-[17px]
                [&>p]:leading-[1.9]
                [&>p]:text-[#526A77]
                sm:[&>p]:text-[18px]

                [&>ul]:mb-8
                [&>ul]:ml-0
                [&>ul]:list-none
                [&>ul]:space-y-3
                [&>ul]:pl-0
                [&>ul]:text-[17px]
                [&>ul]:leading-7
                [&>ul]:text-[#526A77]

                [&>ol]:mb-8
                [&>ol]:ml-0
                [&>ol]:list-none
                [&>ol]:space-y-3
                [&>ol]:pl-0
                [&>ol]:text-[17px]
                [&>ol]:leading-7
                [&>ol]:text-[#526A77]

                [&>ul>li]:relative
                [&>ul>li]:pl-7

                [&>ul>li]:before:absolute
                [&>ul>li]:before:left-1
                [&>ul>li]:before:top-[0.75rem]
                [&>ul>li]:before:h-2
                [&>ul>li]:before:w-2
                [&>ul>li]:before:rounded-full
                [&>ul>li]:before:bg-[#FFD400]

                [&>ol>li]:relative
                [&>ol>li]:pl-9

                [&>ol>li]:before:absolute
                [&>ol>li]:before:left-0
                [&>ol>li]:before:top-1
                [&>ol>li]:before:flex
                [&>ol>li]:before:h-7
                [&>ol>li]:before:w-7
                [&>ol>li]:before:items-center
                [&>ol>li]:before:justify-center
                [&>ol>li]:before:rounded-full
                [&>ol>li]:before:bg-[#EAF3F6]
                [&>ol>li]:before:text-[11px]
                [&>ol>li]:before:font-bold
                [&>ol>li]:before:text-[#0D6E91]

                [&_strong]:font-semibold
                [&_strong]:text-[#061A2B]

                [&_a]:font-semibold
                [&_a]:text-[#0D6E91]
                [&_a]:underline
                [&_a]:decoration-[#0D6E91]/30
                [&_a]:underline-offset-4
                [&_a:hover]:text-[#061A2B]

                [&_blockquote]:relative
                [&_blockquote]:my-10
                [&_blockquote]:overflow-hidden
                [&_blockquote]:rounded-[1.5rem]
                [&_blockquote]:border
                [&_blockquote]:border-[#DDE7ED]
                [&_blockquote]:bg-[#F3F8FA]
                [&_blockquote]:px-7
                [&_blockquote]:py-7
                [&_blockquote]:text-lg
                [&_blockquote]:font-medium
                [&_blockquote]:leading-8
                [&_blockquote]:text-[#294452]

                [&_blockquote]:before:absolute
                [&_blockquote]:before:left-0
                [&_blockquote]:before:top-0
                [&_blockquote]:before:h-full
                [&_blockquote]:before:w-1
                [&_blockquote]:before:bg-[#FFD400]

                [&_hr]:my-12
                [&_hr]:border-0
                [&_hr]:border-t
                [&_hr]:border-[#DDE7ED]

                [&_img]:my-10
                [&_img]:h-auto
                [&_img]:w-full
                [&_img]:rounded-[1.5rem]
                [&_img]:border
                [&_img]:border-[#DDE7ED]
                [&_img]:bg-white
                [&_img]:object-cover
                [&_img]:shadow-[0_18px_45px_rgba(6,26,43,0.08)]

                [&_figure]:my-10
                [&_figure]:overflow-hidden
                [&_figure]:rounded-[1.5rem]

                [&_figcaption]:mt-3
                [&_figcaption]:text-center
                [&_figcaption]:text-xs
                [&_figcaption]:leading-5
                [&_figcaption]:text-[#84939B]

                [&_table]:my-10
                [&_table]:w-full
                [&_table]:overflow-hidden
                [&_table]:rounded-[1rem]
                [&_table]:border
                [&_table]:border-[#DDE7ED]

                [&_th]:border-b
                [&_th]:border-[#DDE7ED]
                [&_th]:bg-[#F1F6F8]
                [&_th]:px-4
                [&_th]:py-3
                [&_th]:text-left
                [&_th]:text-xs
                [&_th]:font-bold
                [&_th]:text-[#061A2B]

                [&_td]:border-b
                [&_td]:border-[#E7EEF2]
                [&_td]:px-4
                [&_td]:py-3
                [&_td]:text-sm
                [&_td]:leading-6
                [&_td]:text-[#526A77]

                [&_pre]:my-10
                [&_pre]:overflow-x-auto
                [&_pre]:rounded-[1.25rem]
                [&_pre]:bg-[#061A2B]
                [&_pre]:p-6
                [&_pre]:text-sm
                [&_pre]:leading-7
                [&_pre]:text-white/85

                [&_code]:rounded
                [&_code]:bg-[#EEF4F6]
                [&_code]:px-1.5
                [&_code]:py-0.5
                [&_code]:text-[0.9em]
                [&_code]:text-[#0D6E91]

                [&_pre_code]:bg-transparent
                [&_pre_code]:p-0
                [&_pre_code]:text-inherit

                [&_mark]:rounded
                [&_mark]:bg-[#FFF1A8]
                [&_mark]:px-1

                [&_s]:text-[#7C8C94]
              "
              dangerouslySetInnerHTML={{
                __html: article.html,
              }}
            />
          </article>

          {/* DESKTOP TOC */}
          {article.toc.length > 0 && (
            <aside className="hidden lg:block">
              <BlogArticleToc
                items={article.toc}
              />
            </aside>
          )}
        </div>

        {/* MOBILE TOC */}
        {article.toc.length > 0 && (
          <div className="mt-10 lg:hidden">
            <BlogArticleToc
              items={article.toc}
            />
          </div>
        )}
      </div>
    </section>
  );
}