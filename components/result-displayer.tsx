import { Template } from "@/lib/ai-completions";
import { Check } from "lucide-react";
import parse, { HTMLReactParserOptions, Element } from "html-react-parser";

export default function ResultDisplayer(props: {
  res: string;
  type: Template | string;
}) {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.tagName === "body") {
        return null;
      }
    },
  };
  switch (props.type) {
    case "ideas":
      try {
        let json: string[] = JSON.parse(props.res);
        return (
          <div id="contentp">
            {json.map((el, i) => (
              <li
                className="my-2 grid grid-cols-[auto,1fr] space-x-2 rounded-md bg-slate-200 p-1 dark:bg-slate-800"
                key={i}
              >
                <Check className="w-6" /> <p>{el}</p>
              </li>
            ))}
          </div>
        );
      } catch {
        return (
          <div id="contentp">
            {parse(
              props.res.replaceAll("<body>", "").replaceAll("</body>", ""),
              options,
            )}
          </div>
        );
      }

    default:
      return (
        <p id="contentp">
          {parse(
            props.res
              .replaceAll("<body>", "")
              .replaceAll("</body>", "")
              .replaceAll("<html>", "")
              .replaceAll("</html>", "")
              .replaceAll("<!DOCTYPE html>", "")
              .replaceAll("\n\n", "<br>")
              .replaceAll("\n", "<br>"),
            options,
          )}
        </p>
      );
  }
}
