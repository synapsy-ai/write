"use client";
import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { Lightbulb, Pen, Rocket, Settings, UserCircle2 } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Spotlight, { SpotlightCard } from "./spotlight";
import { Input } from "./ui/input";
import { Close } from "@radix-ui/react-dialog";
import { addToHistory, getHistory } from "@/lib/history";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NavBar(props: { lng: string }) {
  const { t } = useTranslation(props.lng, "common");
  const { setTheme } = useTheme();
  const { push } = useRouter();
  const [title, setTitle] = useState("");
  const [manual, setManual] = useState(false);

  function createDoc() {
    addToHistory({
      template: "manual",
      content: "",
      date: new Date(),
      prompt: title,
    });
    let generations = getHistory();
    push(`/${props.lng}/generations/edit?id=${generations.length - 1}`);
  }
  return (
    <nav className="fixed top-0 z-50 hidden w-full grid-cols-[auto,1fr,auto] bg-white/50 px-4 py-1 shadow-sm saturate-[1.1] backdrop-blur-md dark:bg-slate-900/30 sm:grid print:hidden">
      <div className="m-2 flex items-center">
        <Link className="mr-2 flex space-x-2" href={"/" + props.lng}>
          <Image alt="SynapsyLogo" height={25} width={25} src={"/logo.svg"} />
          <h2 className="text-lg font-normal">{t("title")}</h2>
        </Link>
        <Link href={"/" + props.lng + "/pricing"}>
          <Button variant="ghost">{t("pricing")}</Button>
        </Link>

        <Link href={"/" + props.lng + "/generations"}>
          <Button variant="ghost">{t("generations")}</Button>
        </Link>
        <Link href={"/" + props.lng + "/chat"}>
          <Button variant="ghost">{t("chat")}</Button>
        </Link>
      </div>
      <span></span>
      <div className="m-2 flex items-center">
        <Link href={"/" + props.lng + "/create"}></Link>

        <Dialog>
          <DialogTrigger>
            <Button
              onClick={() => {
                setManual(false);
                setTitle("");
              }}
              className="group mx-2 h-auto space-x-2 overflow-hidden px-2 py-1"
            >
              <Rocket
                className="group-hover:animate-rocket"
                height={14}
                width={14}
              />
              <p>{t("create")}</p>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("new-creation")}</DialogTitle>
              {manual ? (
                <div>
                  <div className="flex items-center space-x-2">
                    <p>{t("doc-title")}</p>
                    <Input
                      onChange={(v) => setTitle(v.target.value)}
                      value={title}
                    />
                  </div>
                </div>
              ) : (
                <Spotlight>
                  <div className="grid grid-cols-2 gap-x-2">
                    <SpotlightCard className="border-2 border-indigo-500/10">
                      <Close>
                        <button
                          onClick={() => push(`/${props.lng}/create`)}
                          className="flex flex-col items-center p-2"
                        >
                          <Lightbulb size={48} className="my-2 h-16" />
                          <span className="text-center">
                            <h3>{t("ai")}</h3>
                            <p>{t("ai-desc")}</p>
                          </span>
                        </button>
                      </Close>
                    </SpotlightCard>
                    <SpotlightCard className="border-2 border-indigo-500/10">
                      <button
                        onClick={() => setManual(!manual)}
                        className="flex flex-col items-center p-2"
                      >
                        <Pen size={48} className="my-2 h-16" />
                        <span className="text-center">
                          <h3>{t("manual")}</h3>
                          <p>{t("manual-desc")}</p>
                        </span>
                      </button>
                    </SpotlightCard>
                  </div>
                </Spotlight>
              )}
            </DialogHeader>
            {manual && (
              <DialogFooter>
                <Close>
                  <Button
                    className="self-end"
                    onClick={createDoc}
                    disabled={!title}
                  >
                    {t("create")}
                  </Button>
                </Close>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
        <Link href={"/" + props.lng + "/me"} className="group">
          <Button variant="ghost" size="icon">
            <UserCircle2 className="h-[1.2rem] w-[1.2rem] transition-all group-hover:scale-105" />
          </Button>
        </Link>
        <Link href={"/" + props.lng + "/settings"} className="group">
          <Button variant="ghost" size="icon">
            <Settings className="h-[1.2rem] w-[1.2rem] transition-all group-hover:rotate-90" />
          </Button>
        </Link>
      </div>
    </nav>
  );
}
