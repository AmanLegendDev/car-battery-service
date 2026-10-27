
import "server-only";

import sanitizeHtml from "sanitize-html";

export function sanitizeBlogHtml(
  html: string
): string {
  return sanitizeHtml(html, {
    allowedTags: [
      // Text
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "del",
      "sub",
      "sup",

      // Headings
      "h1",
      "h2",
      "h3",
      "h4",

      // Lists
      "ul",
      "ol",
      "li",

      // Block content
      "blockquote",
      "pre",
      "code",
      "hr",

      // Links and images
      "a",
      "img",

      // Tables — essential fix
      "table",
      "caption",
      "colgroup",
      "col",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "th",
      "td",
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
        "width",
        "height",
      ],

      table: [
        "class",
        "style",
      ],

      colgroup: [
        "span",
        "style",
      ],

      col: [
        "span",
        "width",
        "style",
      ],

      th: [
        "colspan",
        "rowspan",
        "scope",
        "align",
        "valign",
        "width",
        "style",
      ],

      td: [
        "colspan",
        "rowspan",
        "align",
        "valign",
        "width",
        "style",
      ],

      tr: [
        "align",
        "valign",
        "style",
      ],

      caption: [
        "align",
        "style",
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
          ...attribs,
          href: attribs.href || "",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    },

    disallowedTagsMode: "discard",
  }).trim();
}
