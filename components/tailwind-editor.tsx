"use client";

import {
  EditorBubble,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  JSONContent,
} from "novel";
import { useState } from "react";
import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  Save,
  Text,
  TextQuote,
} from "lucide-react";
import { SuggestionItem, handleCommandNavigation } from "novel";
import { Command, renderItems } from "novel";
import { defaultExtensions } from "@/lib/editor-extensions";
import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { ColorSelector } from "./selectors/color-selector";
import { TextButtons } from "./selectors/text-buttons";
import { Button } from "./ui/button";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "./ui/tooltip";
import { useTranslation } from "@/app/i18n/client";
import { HistoryItem } from "@/lib/history";
import { handleImageDrop, handleImagePaste } from "novel";
import { uploadFn } from "@/lib/image-upload";
import { MathSelector } from "./selectors/math-selector";
import { generateHTML } from "@tiptap/html";
interface EditorProps {
  content: JSONContent;
  lng: string;
  id: number;
  enabled?: boolean;
  editorOnly?: boolean;
}

export default function TailwindEditor(props: EditorProps) {
  const extensions = [...defaultExtensions, slashCommand];
  const openAI = false;
  const [content, setContent] = useState<JSONContent>(props.content);
  const [openNode, setOpenNode] = useState<boolean>(false);
  const [openLink, setOpenLink] = useState<boolean>(false);
  const [openColor, setOpenColor] = useState<boolean>(false);
  const [htmlContent, setHtmlContent] = useState(
    generateHTML(content, extensions),
  );
  const { t } = useTranslation(props.lng, "common");
  function saveContent() {
    if (typeof window !== "undefined") {
      let history: HistoryItem[] = [];
      history = JSON.parse(
        localStorage.getItem("synapsy_write_history") ?? "[]",
      );
      history[props.id].content = htmlContent;
      localStorage.setItem("synapsy_write_history", JSON.stringify(history));
    }
  }

  return (
    <div className="space-y-2">
      {props.editorOnly ? (
        <></>
      ) : (
        <div className="mx-2 flex rounded-md border sm:mx-0 sm:rounded-lg">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button onClick={saveContent} variant="ghost">
                  <Save size={15} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("save")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      <EditorRoot>
        <EditorContent
          editable={props.enabled ?? true}
          className={`relative w-full max-w-screen-lg ${!props.editorOnly && "min-h-[500px] border bg-background sm:mb-[calc(20vh)]"} sm:rounded-lg`}
          extensions={extensions}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class: `prose-lg prose-stone dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full `,
            },
          }}
          initialContent={content}
          onUpdate={({ editor }) => {
            const json = editor.getJSON();
            setHtmlContent(editor.getHTML());
            setContent(json);
          }}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              {t("no-results")}
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className={`grid w-full grid-cols-[auto,1fr] items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent`}
                  key={item.title}
                >
                  <div className="flex size-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{t(item.translation)}</p>
                    <p className="text-xs text-muted-foreground">
                      {t(item.translation + "-desc")}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>
          <EditorBubble
            tippyOptions={{
              placement: openAI ? "bottom-start" : "top",
            }}
            className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
          >
            <NodeSelector
              lng={props.lng}
              open={openNode}
              onOpenChange={setOpenNode}
            />
            <MathSelector />
            <LinkSelector
              lng={props.lng}
              open={openLink}
              onOpenChange={setOpenLink}
            />
            <TextButtons />
            <ColorSelector
              lng={props.lng}
              open={openColor}
              onOpenChange={setOpenColor}
            />
          </EditorBubble>
        </EditorContent>
      </EditorRoot>
    </div>
  );
}

interface CustomSuggestionItem extends SuggestionItem {
  translation: string;
}

export const suggestionItems: CustomSuggestionItem[] = [
  {
    title: "Text",
    description: "Just start typing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: <Text size={18} />,
    translation: "text",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .run();
    },
  },
  {
    title: "To-do List",
    description: "Track tasks with a to-do list.",
    searchTerms: ["todo", "task", "list", "check", "checkbox", "case", "coche"],
    icon: <CheckSquare size={18} />,
    translation: "todo",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: "Heading 1",
    description: "Big section heading.",
    searchTerms: ["title", "big", "large"],
    icon: <Heading1 size={18} />,
    translation: "h1",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading.",
    searchTerms: ["subtitle", "medium"],
    icon: <Heading2 size={18} />,
    translation: "h2",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading.",
    searchTerms: ["subtitle", "small"],
    icon: <Heading3 size={18} />,
    translation: "h3",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list.",
    searchTerms: ["unordered", "point", "puce"],
    icon: <List size={18} />,
    translation: "bullet-list",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a list with numbering.",
    searchTerms: ["ordered"],
    icon: <ListOrdered size={18} />,
    translation: "number-list",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Quote",
    description: "Capture a quote.",
    searchTerms: ["blockquote", "citation"],
    icon: <TextQuote size={18} />,
    translation: "quote",
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .toggleBlockquote()
        .run(),
  },
  {
    title: "Code",
    description: "Capture a code snippet.",
    searchTerms: ["codeblock"],
    icon: <Code size={18} />,
    translation: "code",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "Image",
    description: "Upload an image from your computer.",
    searchTerms: ["photo", "picture", "media"],
    icon: <ImageIcon size={18} />,
    translation: "image",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      // upload image
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        if (input.files?.length) {
          const file = input.files[0];
          const pos = editor.view.state.selection.from;
          uploadFn(file, editor.view, pos);
        }
      };
      input.click();
    },
  },
];

export const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
});
