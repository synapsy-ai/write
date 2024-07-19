"use client";
import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { HistoryItem, removeFromHistory } from "@/lib/history";
import { useTranslation } from "@/app/i18n/client";
import { Calendar, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export function GenerationItem(props: {
  item: HistoryItem;
  lng: string;
  id: number;
  refresh: Function;
}) {
  const { t } = useTranslation(props.lng, "common");
  function getRandomGradient() {
    const gradients = [
      "bg-gradient-to-r from-yellow-400 to-pink-500",
      "bg-gradient-to-r from-green-400 to-blue-500",
      "bg-gradient-to-r from-purple-400 to-red-500",
      "bg-gradient-to-r from-pink-400 to-blue-500",
      "bg-gradient-to-r from-indigo-500 to-purple-600",
      "bg-gradient-to-r from-pink-500 to-indigo-600",
      "bg-gradient-to-r from-red-500 to-yellow-500",
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            onClick={() => {}}
            className="m-2 flex w-[380px] flex-col overflow-hidden rounded-md border border-slate-200 shadow-md transition hover:-translate-y-2 hover:shadow-lg dark:border-slate-700"
          >
            <Link
              href={"generations/view?id=" + props.id.toString()}
              className={
                "flex h-16 items-start justify-start border-b border-slate-200 dark:border-slate-700 " +
                getRandomGradient()
              }
            ></Link>
            <span>
              <Link
                href={"generations/view?id=" + props.id.toString()}
                className="mx-1 mt-1 flex items-center text-sm text-slate-500 dark:text-slate-400"
              >
                <Calendar height={12} />
                <span>{new Date(props.item.date).toLocaleString()}</span>
              </Link>
              <span className="grid grid-cols-[1fr,auto]">
                <Link
                  href={"generations/view?id=" + props.id.toString()}
                  className="p-2 text-left font-bold"
                >
                  {props.item.prompt.length > 30
                    ? props.item.prompt.substring(0, 30) + "..."
                    : props.item.prompt}
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button className="h-auto" variant="ghost">
                      <MoreVertical width={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {props.item.template !== "ideas" &&
                    props.item.template !== "table" &&
                    props.item.template !== "ph_visual_outline" ? (
                      <Link
                        href={`/${props.lng}/generations/edit?id=${props.id}`}
                      >
                        <DropdownMenuItem>{t("edit")}</DropdownMenuItem>
                      </Link>
                    ) : (
                      <></>
                    )}
                    <DropdownMenuItem
                      onClick={() => {
                        removeFromHistory(props.id);
                        props.refresh();
                      }}
                    >
                      {t("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </span>
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-[380px]">
          {props.item.prompt}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
