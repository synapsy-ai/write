import React from "react";

export const HighlightedVariable = ({ text }: { text: string }) => {
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
          <span
            key={index}
            className="rounded-full border px-2 text-muted-foreground"
          >
            {part.text}
          </span>
        ) : (
          <React.Fragment key={index}>{part.text}</React.Fragment>
        ),
      )}
    </p>
  );
};
