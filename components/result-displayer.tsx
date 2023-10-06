import { Template } from "@/lib/ai-completions";

export default function ResultDisplayer(props: {
  res: string;
  type: Template | string;
}) {
  switch (props.type) {
    case "ideas":
      return <div>{props.res}</div>;
    default:
      return <div>{props.res}</div>;
  }
}
