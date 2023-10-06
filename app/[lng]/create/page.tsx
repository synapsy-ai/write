"use client";
import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hand, Info, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Settings } from "@/lib/settings";
import { Template, sendToGpt } from "@/lib/ai-completions";
import { addToHistory } from "@/lib/history";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@radix-ui/react-select";
import formats from "@/lib/formats";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function CreatePage({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const { t } = useTranslation(lng, "common");

  const [type, setType] = useState("para");

  let s: Settings = { key: "" };
  if (typeof window !== "undefined") {
    s = JSON.parse(localStorage.getItem("synapsy_settings") ?? "{}");
  }

  const [welcome, setWelcome] = useState(s.key === undefined);
  const [keyTxt, setKeyTxt] = useState(s.key);
  const [res, setRes] = useState<string | null>("");
  const [prompt, setPrompt] = useState("");
  const [inProgress, setInProgress] = useState(false);

  function setKey() {
    s.key = keyTxt;
    localStorage.setItem("synapsy_settings", JSON.stringify(s));
    setWelcome(false);
  }

  async function create() {
    setInProgress(true);
    let r = await sendToGpt(prompt, s.key, type, lng);
    setRes(r);
    addToHistory({
      prompt: prompt,
      content: r ?? "",
      template: type,
      date: new Date(),
    });
    setInProgress(false);
  }

  return (
    <main>
      <section className="mx-2">
        <h2 className="text-2xl font-bold">{t("create")}</h2>
        <p>{t("create-desc")}</p>
      </section>
      {!welcome ? (
        <section className="m-2 flex items-center space-x-2 rounded-md bg-white p-2 shadow-md dark:bg-slate-900">
          <Input onChange={(v) => setPrompt(v.target.value)} />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">{t("format")}</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{t("format")}</SheetTitle>
                <SheetDescription>{t("select-format")}</SheetDescription>
              </SheetHeader>
              <div className="py-4">
                {formats.map((el, i) => (
                  <Accordion key={i} type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>{t(el.category)}</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid">
                          {el.options.map((op, j) => (
                            <SheetClose className="grid" key={j}>
                              <Button
                                onClick={() => setType(op.val)}
                                variant="ghost"
                                className="justify-start"
                              >
                                {t(op.text)}
                              </Button>
                            </SheetClose>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {!inProgress ? (
            <Button onClick={create}>{t("create")}</Button>
          ) : (
            <Button disabled className="cursor-not-allowed">
              {" "}
              <Loader2 className="mr-2 animate-spin" /> {t("please-wait")}
            </Button>
          )}
        </section>
      ) : (
        <section className="flex flex-col items-center">
          <Hand size={64} />
          <h2 className="text-2xl font-bold">{t("welcome")}</h2>
          <p>{t("welcome-desc")}</p>
          <Input
            type="password"
            onChange={(v) => setKeyTxt(v.target.value)}
            className="my-2 max-w-[350px]"
          />
          <Button onClick={setKey}>{t("confirm")}</Button>
        </section>
      )}
      <section className="m-2 rounded-md bg-white p-2 shadow-md dark:bg-slate-900">
        {res ? (
          res
        ) : (
          <div className="flex flex-col items-center">
            <Info height={48} width={48} />
            <p className="font-bold">{t("result-ph")}</p>
          </div>
        )}
      </section>
      {inProgress ? (
        <section className="flex min-h-[50vh] flex-col items-center justify-center">
          <Loader2 height={48} width={48} className="animate-spin" />
          <p className="text-xl font-bold">{t("gen-in-progress")}</p>
        </section>
      ) : (
        <></>
      )}
    </main>
  );
}
