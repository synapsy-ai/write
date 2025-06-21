import { Template } from "@/lib/ai-completions";
import { Check } from "lucide-react";
import parse, { HTMLReactParserOptions, Element } from "html-react-parser";
import { OutlineItem } from "@/lib/formats";
import { FontType } from "@/lib/settings";
import { defaultExtensions } from "@/lib/editor-extensions";
import { generateJSON } from "@tiptap/html";
import TailwindEditor from "./tailwind-editor";
import { Language } from "@/lib/languages";
import { useState } from "react";

interface ResultDisplayerProps {
  content: string;
  type: Template | string;
  is_generating: boolean;
  no_padding?: boolean;
  font?: FontType;
  lng: Language;
}

export default function ResultDisplayer({
  content,
  is_generating,
  type,
  no_padding,
  font,
  lng,
}: ResultDisplayerProps) {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.tagName === "body") {
        return null;
      }
    },
  };

  if (
    (is_generating && type === "ideas") ||
    (is_generating && type === "ph_visual_outline")
  ) {
    return (
      <p id="contentp" className={no_padding ? "" : "p-4"}>
        {content}
        <span className="inline-block h-[14px] w-[7px] animate-pulse self-baseline bg-black duration-500 dark:bg-white"></span>
      </p>
    );
  }
  switch (type) {
    case "ideas":
      try {
        let json: string[] = JSON.parse(content);
        return (
          <div id="contentp">
            {json.map((el, i) => (
              <li
                className="my-2 grid grid-cols-[auto_1fr] space-x-2 rounded-md bg-slate-200 p-1 dark:bg-slate-800"
                key={i}
              >
                <Check className="w-6" /> <p>{el}</p>
              </li>
            ))}
          </div>
        );
      } catch {
        return (
          <div id="contentp" className="edit">
            {parse(
              content.replaceAll("<body>", "").replaceAll("</body>", ""),
              options,
            )}
          </div>
        );
      }
    case "table":
      return (
        <p
          className="edit max-w-[100vw] overflow-auto p-4 print:text-black"
          id="contentp"
        >
          {parse(
            content
              .replaceAll("<body>", "")
              .replaceAll("</body>", "")
              .replaceAll("<html>", "")
              .replaceAll("</html>", "")
              .replaceAll("<!DOCTYPE html>", ""),
            options,
          )}
          {is_generating && (
            <span className="inline-block h-[14px] w-[7px] animate-pulse self-baseline bg-black duration-500 dark:bg-white"></span>
          )}
        </p>
      );
    case "ph_visual_outline":
      try {
        const outline: OutlineItem[] = JSON.parse(content);
        return (
          <div>
            {outline.map((el, i) => (
              <div
                className="m-2 rounded-md border p-2 print:border-0 print:p-0"
                key={i}
              >
                <p className="text-lg font-bold">{el.name}</p>
                {el.child.map((child, j) => (
                  <p
                    className="m-2 rounded-md border bg-slate-200/20 p-2 transition-all hover:bg-slate-200/50 dark:bg-slate-700/20 dark:hover:bg-slate-700/50 print:ml-6 print:border-0 print:p-0"
                    key={j}
                  >
                    {child}
                  </p>
                ))}
              </div>
            ))}
          </div>
        );
      } catch {
        return (
          <p className="edit p-4 print:text-black" id="contentp">
            {parse(
              content
                .replaceAll("<body>", "")
                .replaceAll("</body>", "")
                .replaceAll("<html>", "")
                .replaceAll("</html>", "")
                .replaceAll("<!DOCTYPE html>", "")
                .replaceAll("\n\n", "<br>")
                .replaceAll("\n", "<br>"),
              options,
            )}
            {is_generating && (
              <span className="inline-block h-[14px] w-[7px] animate-pulse self-baseline bg-black duration-500 dark:bg-white"></span>
            )}
          </p>
        );
      }
    default:
      return (
        <div className={font !== "default" ? `font-${font}` : ""}>
          <TailwindEditor
            lng={lng}
            id={-1}
            content={generateJSON(
              content
                .replaceAll("<body>", "")
                .replaceAll("</body>", "")
                .replaceAll("<html>", "")
                .replaceAll("</html>", "")
                .replaceAll("<!DOCTYPE html>", "")
                .replaceAll("\n\n", "<br>")
                .replaceAll("\n\n\n", "\n")
                .replaceAll("\n    \n", "<br>")
                .replaceAll("\n", "<br>")
                .replaceAll("```html", "")
                .replaceAll("```", "")
                .replaceAll("<br><br>", ""),
              defaultExtensions,
            )}
            enabled={false}
            editorOnly
          />
        </div>
      );
  }
}
