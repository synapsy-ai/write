"use client";
import { useTranslation } from "@/app/i18n/client";
import {
  Home,
  Lightbulb,
  List,
  MessageCircleMore,
  MoreHorizontal,
  Pen,
  Settings,
  Sheet,
  User2,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Spotlight, { SpotlightCard } from "./spotlight";
import { Close } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function MobileNavBar(props: { lng: string }) {
  const { t } = useTranslation(props.lng, "common");
  const { push } = useRouter();
  return (
    <div className="fixed bottom-0 z-50 block w-full sm:hidden print:hidden">
      <nav className="grid grid-cols-5 items-center rounded-t-md bg-white/50 shadow-[0px_-5px_20px_1px_#00000012] backdrop-blur-md dark:bg-slate-900/50">
        <Link
          className="flex items-center justify-center rounded-md border border-transparent p-5 hover:border-slate-200 hover:bg-slate-100/25 dark:hover:border-slate-700 dark:hover:bg-slate-800/25"
          href={"/" + props.lng}
        >
          <Home />
        </Link>
        <Link
          className="flex items-center justify-center rounded-md border border-transparent p-5 hover:border-slate-200 hover:bg-slate-100/25 dark:hover:border-slate-700 dark:hover:bg-slate-800/25"
          href={"/" + props.lng + "/generations"}
        >
          <List />
        </Link>
        <div className="flex justify-center">
          <Dialog>
            <DialogTrigger>
              <div className="group flex w-16 -translate-y-2 items-center justify-center rounded-full border border-violet-400 bg-linear-to-r from-violet-500 to-indigo-500 p-5 shadow-md shadow-violet-500/50 hover:from-violet-500 hover:to-violet-500">
                <Pen
                  className="transition-all ease-in-out group-hover:scale-125"
                  color="white"
                />
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>{t("new-creation")}</DialogTitle>
              <Spotlight>
                <div className="space-y-2">
                  <SpotlightCard className="border-2 border-indigo-500/10">
                    <Close>
                      <button
                        onClick={() => push(`/${props.lng}/create`)}
                        className="grid grid-cols-[auto_1fr] items-center space-x-2 p-2"
                      >
                        <Lightbulb size={48} className="mx-2 h-16" />
                        <div className="text-left">
                          <h3>{t("ai")}</h3>
                          <p>{t("ai-desc")}</p>
                        </div>
                      </button>
                    </Close>
                  </SpotlightCard>
                  <SpotlightCard className="border-2 border-indigo-500/10">
                    <Close>
                      <button
                        onClick={() => push(`/${props.lng}/chat`)}
                        className="grid grid-cols-[auto_1fr] items-center space-x-2 p-2"
                      >
                        <MessageCircleMore size={48} className="mx-2 h-16" />
                        <div className="text-left">
                          <h3>{t("chat")}</h3>
                          <p>{t("chat-desc")}</p>
                        </div>
                      </button>
                    </Close>
                  </SpotlightCard>
                </div>
              </Spotlight>
            </DialogContent>
          </Dialog>
        </div>
        <Link
          className="flex items-center justify-center rounded-md border border-transparent p-5 hover:border-slate-200 hover:bg-slate-100/25 dark:hover:border-slate-700 dark:hover:bg-slate-800/25"
          href={"/" + props.lng + "/me"}
        >
          <User2 />
        </Link>

        <Dialog>
          <DialogTrigger className="flex items-center justify-center rounded-md border border-transparent p-5 hover:border-slate-200 hover:bg-slate-100/25 dark:hover:border-slate-700 dark:hover:bg-slate-800/25">
            <MoreHorizontal />
          </DialogTrigger>
          <DialogContent>
            <Close>
              <Button
                onClick={() => push(`/${props.lng}/settings`)}
                className="flex w-full items-center justify-start space-x-2"
                variant="ghost"
              >
                <span>
                  <Settings />
                </span>
                <span className="text-lg font-bold">{t("settings")}</span>
              </Button>
            </Close>
            <Close>
              <Button
                onClick={() => push(`/${props.lng}/templates`)}
                className="flex w-full items-center justify-start space-x-2"
                variant="ghost"
              >
                <span>
                  <Sheet />
                </span>
                <span className="text-lg font-bold">{t("templates")}</span>
              </Button>
            </Close>
          </DialogContent>
        </Dialog>
      </nav>
    </div>
  );
}
