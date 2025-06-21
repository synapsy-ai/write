"use client";
import { Check, ChevronDown } from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useTranslation } from "@/app/i18n/client";

export interface BubbleColorMenuItem {
  name: string;
  color: string;
  translate: string;
}

const TEXT_COLORS: BubbleColorMenuItem[] = [
  {
    name: "Default",
    color: "var(--novel-black)",
    translate: "default",
  },
  {
    name: "Purple",
    color: "#9333EA",
    translate: "purple",
  },
  {
    name: "Red",
    color: "#E00000",
    translate: "red",
  },
  {
    name: "Yellow",
    color: "#EAB308",
    translate: "yellow",
  },
  {
    name: "Blue",
    color: "#2563EB",
    translate: "blue",
  },
  {
    name: "Green",
    color: "#008A00",
    translate: "green",
  },
  {
    name: "Orange",
    color: "#FFA500",
    translate: "orange",
  },
  {
    name: "Pink",
    color: "#BA4081",
    translate: "pink",
  },
  {
    name: "Gray",
    color: "#A8A29E",
    translate: "gray",
  },
];

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
  {
    name: "Default",
    color: "var(--novel-highlight-default)",
    translate: "default",
  },
  {
    name: "Purple",
    color: "var(--novel-highlight-purple)",
    translate: "purple",
  },
  {
    name: "Red",
    color: "var(--novel-highlight-red)",
    translate: "red",
  },
  {
    name: "Yellow",
    color: "var(--novel-highlight-yellow)",
    translate: "yellow",
  },
  {
    name: "Blue",
    color: "var(--novel-highlight-blue)",
    translate: "blue",
  },
  {
    name: "Green",
    color: "var(--novel-highlight-green)",
    translate: "green",
  },
  {
    name: "Orange",
    color: "var(--novel-highlight-orange)",
    translate: "orange",
  },
  {
    name: "Pink",
    color: "var(--novel-highlight-pink)",
    translate: "pink",
  },
  {
    name: "Gray",
    color: "var(--novel-highlight-gray)",
    translate: "gray",
  },
];

interface ColorSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lng: string;
}

export const ColorSelector = ({
  open,
  onOpenChange,
  lng,
}: ColorSelectorProps) => {
  const { t } = useTranslation(lng, "common");
  const { editor } = useEditor();

  if (!editor) return null;
  const activeColorItem = TEXT_COLORS.find(({ color }) =>
    editor.isActive("textStyle", { color }),
  );

  const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) =>
    editor.isActive("highlight", { color }),
  );

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button className="gap-2" variant="ghost">
          <span
            className="rounded-sm px-1"
            style={{
              color: activeColorItem?.color,
              backgroundColor: activeHighlightItem?.color,
            }}
          >
            A
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        sideOffset={5}
        className="my-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl"
        align="start"
      >
        <div className="flex flex-col">
          <div className="text-muted-foreground my-1 px-2 text-sm font-semibold">
            {t("color")}
          </div>
          {TEXT_COLORS.map(({ name, color, translate }, index) => (
            <EditorBubbleItem
              key={index}
              onSelect={() => {
                editor.commands.unsetColor();
                name !== "Default" &&
                  editor
                    .chain()
                    .focus()
                    .setColor(color || "")
                    .run();
              }}
              className="hover:bg-accent flex cursor-pointer items-center justify-between px-2 py-1 text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="rounded-sm border px-2 py-px font-medium"
                  style={{ color }}
                >
                  A
                </div>
                <span>{t(translate)}</span>
              </div>
            </EditorBubbleItem>
          ))}
        </div>
        <div>
          <div className="text-muted-foreground my-1 px-2 text-sm font-semibold">
            {t("background")}
          </div>
          {HIGHLIGHT_COLORS.map(({ name, color, translate }, index) => (
            <EditorBubbleItem
              key={index}
              onSelect={() => {
                editor.commands.unsetHighlight();
                name !== "Default" && editor.commands.setHighlight({ color });
              }}
              className="hover:bg-accent flex cursor-pointer items-center justify-between px-2 py-1 text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="rounded-sm border px-2 py-px font-medium"
                  style={{ backgroundColor: color }}
                >
                  A
                </div>
                <span>{t(translate)}</span>
              </div>
              {editor.isActive("highlight", { color }) && (
                <Check className="h-4 w-4" />
              )}
            </EditorBubbleItem>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
