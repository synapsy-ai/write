"use client";
import { useTranslation } from "@/app/i18n/client";
import { ChatMessage } from "@/lib/ai-completions";
import ResultDisplayer from "./result-displayer";
import { useEffect, useState } from "react";
import { Copy, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ChatBoxProps {
  lng: string;
  messages: ChatMessage[];
  isLoading: boolean;
}
export default function ChatBox(props: ChatBoxProps) {
  const lng: any = props.lng;
  const { t } = useTranslation(lng, "common");
  const [msg, setMsg] = useState(props.messages);
  const [loading, setLoading] = useState(props.isLoading);

  useEffect(() => {
    setMsg(props.messages);
    setLoading(props.isLoading);
  }, [props.messages, props.isLoading]);

  return (
    <div>
      {msg.map((m, i) => (
        <div
          key={i}
          className="group rounded-md border border-transparent p-2 py-4 transition-all duration-100 hover:border-slate-200 hover:bg-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-900"
        >
          <p
            className={`text-md mb-1 flex items-center space-x-2 font-bold ${m.role === "assistant" ? "text-indigo-500" : ""}`}
          >
            <span>
              {t(m.role === "assistant" ? "synapsy-assistant" : "you")}
            </span>
            {m.role === "assistant" && <Sparkles size={14} color="#6366f1" />}
          </p>
          <ResultDisplayer
            lng={lng}
            type="para"
            is_generating={i === msg.length - 1 && loading}
            res={m.content}
            no_padding
          />
          <div className="hidden group-hover:block">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={() =>
                      navigator.clipboard.writeText(m.content ?? "")
                    }
                    className="mt-1 h-auto p-2"
                    variant="ghost"
                  >
                    <Copy size={12} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("copy")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      ))}
    </div>
  );
}
