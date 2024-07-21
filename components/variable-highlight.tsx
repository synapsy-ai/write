"use client";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useTranslation } from "@/app/i18n/client";

export const HighlightedVariable = ({
  text,
  lng,
}: {
  text: string;
  lng: string;
}) => {
  const { t } = useTranslation("fr", "common");
  const splitStringWithSpans = (text: string) => {
    const regex = /\[\[([^\]]+)\]\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add the text before the match
      if (match.index > lastIndex) {
        parts.push({ text: text.slice(lastIndex, match.index), isSpan: false });
      }
      // Add the matched text
      parts.push({ text: match[1], isSpan: true });
      lastIndex = regex.lastIndex;
    }
    // Add any remaining text after the last match
    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex), isSpan: false });
    }

    return parts;
  };
  const parts = splitStringWithSpans(text);

  return (
    <p>
      {parts.map((part, index) =>
        part.isSpan ? (
          <TooltipProvider key={index} delayDuration={0}>
            <Tooltip>
              <TooltipTrigger className="cursor-auto select-text">
                <span className="rounded-full border px-2 text-muted-foreground transition hover:border-indigo-500 hover:bg-indigo-500/20 hover:text-indigo-500">
                  {part.text}
                </span>
              </TooltipTrigger>
              <TooltipContent className="p-1">
                <div className="rounded-sm border-l-4 border-indigo-500 px-4">
                  <p className="font-bold">{part.text}</p>
                  <p className="max-w-[150px] text-muted-foreground">
                    {part.text === "PROMPT" ? t("prompt-var") : t("var-usage")}{" "}
                    {part.text !== "PROMPT" && (
                      <span className="font-mono">[[{part.text}]]</span>
                    )}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <React.Fragment key={index}>{part.text}</React.Fragment>
        ),
      )}
    </p>
  );
};
