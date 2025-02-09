import { cn } from "@/lib/utils";
import { SigmaIcon } from "lucide-react";
import { useEditor } from "novel";
import { Button } from "../ui/button";

export const MathSelector = () => {
  const { editor } = useEditor();

  if (!editor) return null;

  return (
    <Button
      variant="ghost"
      className="w-12"
      onClick={(evt) => {
        if (editor.isActive("math")) {
          editor.chain().focus().unsetLatex().run();
        } else {
          const { from, to } = editor.state.selection;
          const latex = editor.state.doc.textBetween(from, to);

          if (!latex) return;

          editor.chain().focus().setLatex({ latex }).run();
        }
      }}
    >
      <SigmaIcon
        className={cn("size-4", { "text-indigo-500": editor.isActive("math") })}
        strokeWidth={2.3}
      />
    </Button>
  );
};
