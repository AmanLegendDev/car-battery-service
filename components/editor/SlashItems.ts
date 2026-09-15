import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code2,
  Minus,
  Table2,
  Image,
  Play,
} from "lucide-react";

export interface SlashItem {
  title: string;
  description: string;
  icon: any;

  command: (props: {
    editor: any;
  }) => void;
}

export const slashItems: SlashItem[] = [
  {
    title: "Heading 1",
    description: "Large section heading",
    icon: Heading1,

    command: ({ editor }) =>
      editor
        .chain()
        .focus()
        .toggleHeading({
          level: 1,
        })
        .run(),
  },

  {
    title: "Heading 2",
    description: "Medium heading",
    icon: Heading2,

    command: ({ editor }) =>
      editor
        .chain()
        .focus()
        .toggleHeading({
          level: 2,
        })
        .run(),
  },

  {
    title: "Heading 3",
    description: "Small heading",
    icon: Heading3,

    command: ({ editor }) =>
      editor
        .chain()
        .focus()
        .toggleHeading({
          level: 3,
        })
        .run(),
  },

  {
    title: "Bullet List",
    description: "Create bullet list",
    icon: List,

    command: ({ editor }) =>
      editor
        .chain()
        .focus()
        .toggleBulletList()
        .run(),
  },

  {
    title: "Numbered List",
    description: "Create ordered list",
    icon: ListOrdered,

    command: ({ editor }) =>
      editor
        .chain()
        .focus()
        .toggleOrderedList()
        .run(),
  },

  {
    title: "Checklist",
    description: "Task list",
    icon: CheckSquare,

    command: ({ editor }) =>
      editor
        .chain()
        .focus()
        .toggleTaskList()
        .run(),
  },

  {
    title: "Quote",
    description: "Insert quote",
    icon: Quote,

    command: ({ editor }) =>
      editor
        .chain()
        .focus()
        .toggleBlockquote()
        .run(),
  },

  {
    title: "Code Block",
    description: "Insert code block",
    icon: Code2,

    command: ({ editor }) =>
      editor
        .chain()
        .focus()
        .toggleCodeBlock()
        .run(),
  },

  {
    title: "Divider",
    description: "Horizontal line",
    icon: Minus,

    command: ({ editor }) =>
      editor
        .chain()
        .focus()
        .setHorizontalRule()
        .run(),
  },

  {
    title: "Table",
    description: "Insert table",
    icon: Table2,

    command: ({ editor }) =>
      editor
        .chain()
        .focus()
        .insertTable({
          rows: 3,
          cols: 3,
          withHeaderRow: true,
        })
        .run(),
  },

  {
    title: "Image",
    description: "Upload image",
    icon: Image,

    command: () => {
      // ImageUploader handle karega
    },
  },

  {
    title: "Youtube",
    description: "Embed YouTube video",
    icon: Play,

    command: ({ editor }) => {
      const url = window.prompt(
        "Paste YouTube URL"
      );

      if (!url) return;

      editor
        .chain()
        .focus()
        .setYoutubeVideo({
          src: url,
          width: 960,
          height: 540,
        })
        .run();
    },
  },
];