import "server-only";

import sanitizeHtml from "sanitize-html";

export function sanitizeBlogHtml(
  html: string
): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",

      "h2",
      "h3",
      "h4",

      "ul",
      "ol",
      "li",

      "blockquote",

      "pre",
      "code",

      "a",
      "img",

      "hr",
    ],

    allowedAttributes: {
      a: [
        "href",
        "target",
        "rel",
      ],

      img: [
        "src",
        "alt",
        "width",
        "height",
      ],
    },

    allowedSchemes: [
      "http",
      "https",
      "mailto",
    ],

    allowedSchemesByTag: {
      img: [
        "http",
        "https",
      ],
    },

    transformTags: {
      a: (
        _tagName,
        attribs
      ) => ({
        tagName: "a",
        attribs: {
          href: attribs.href || "",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    },

    disallowedTagsMode: "discard",
  }).trim();
}