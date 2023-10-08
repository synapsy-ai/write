import { Template } from "@/lib/ai-completions";
import { Check } from "lucide-react";
import parse from "html-react-parser";

export default function ResultDisplayer(props: {
  res: string;
  type: Template | string;
}) {
  switch (props.type) {
    case "ideas":
      try {
        let json: string[] = JSON.parse(props.res);
        return (
          <div>
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
        return <p>{parse(props.res)}</p>;
      }

    default:
      return <p>{parse(props.res)}</p>;
  }
}
