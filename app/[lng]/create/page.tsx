"use client";
import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hand, Info, Loader2, Settings as SettingsLogo } from "lucide-react";
import { useState } from "react";
import { Settings } from "@/lib/settings";
import {
  getComplexEssayPrompts,
  getPrompt,
  getSystem,
  sendToGpt,
  sendToGptCustom,
  usingPlan,
} from "@/lib/ai-completions";
import { addToHistory } from "@/lib/history";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import formats, { typesToString } from "@/lib/formats";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import ResultDisplayer from "@/components/result-displayer";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [progressBarVis, setProgressBarVis] = useState(false);
  const [progress, setProgress] = useState(0);
  const [model, setModel] = useState("gpt-3.5-turbo");

  function setKey() {
    s.key = keyTxt;
    localStorage.setItem("synapsy_settings", JSON.stringify(s));
    setWelcome(false);
  }

  async function create() {
    setInProgress(true);
    setProgressBarVis(false);
    let r = await sendToGpt(prompt, s.key, type, lng, model);
    setRes(r);
    addToHistory({
      prompt: prompt,
      content: r ?? "",
      template: type,
      date: new Date(),
    });
    setInProgress(false);
  }

  function createButton() {
    if (type === "es_complex") {
      createComplexEssay();
    } else if (type == "ph_complex") {
      createComplexPhiloEssay();
    } else {
      create();
    }
  }

  async function createComplexEssay() {
    setInProgress(true);
    setProgressBarVis(true);
    const outline = await sendToGptCustom(
      getSystem("es_complex_outline", lng),
      getPrompt("es_outline", lng, prompt),
      s.key,
      model,
    );
    setProgress(16);
    const intro =
      (await sendToGptCustom(
        getSystem("es_intro", lng),
        getPrompt("es_intro", lng, prompt + usingPlan(lng) + outline),
        s.key,
        model,
      )) ?? "";
    setProgress(32);

    const p1 = await sendToGptCustom(
      getSystem("es_basic", lng),
      getComplexEssayPrompts(1, outline, lng),
      s.key,
      model,
    );
    setProgress(48);
    const p2 = await sendToGptCustom(
      getSystem("es_basic", lng),
      getComplexEssayPrompts(2, outline, lng),
      s.key,
      model,
    );
    setProgress(64);
    const p3 = await sendToGptCustom(
      getSystem("es_basic", lng),
      getComplexEssayPrompts(3, outline, lng),
      s.key,
      model,
    );
    setProgress(82);
    const ccl = await sendToGptCustom(
      getSystem("es_conclusion", lng),
      getPrompt("es_conclusion", lng, prompt + usingPlan(lng) + outline),
      s.key,
      model,
    );
    setProgress(100);
    setRes(intro + p1 + p2 + p3 + ccl);
    addToHistory({
      prompt: prompt,
      content: intro + p1 + p2 + p3 + ccl ?? "",
      template: type,
      date: new Date(),
    });
    console.log(intro);
    console.log(p1);
    console.log(p2);
    console.log(p3);
    console.log(ccl);
    setInProgress(false);
  }

  async function createComplexPhiloEssay() {
    setInProgress(true);
    setProgressBarVis(true);
    const outline = await sendToGptCustom(
      getSystem("ph_complex_outline", lng),
      getPrompt("ph_outline", lng, prompt),
      s.key,
      model,
    );
    setProgress(16);
    const intro =
      (await sendToGptCustom(
        getSystem("ph_intro", lng),
        getPrompt("ph_intro", lng, prompt + usingPlan(lng) + outline),
        s.key,
        model,
      )) ?? "";
    setProgress(32);

    const p1 = await sendToGptCustom(
      getSystem("ph_basic", lng),
      getComplexEssayPrompts(1, outline, lng),
      s.key,
      model,
    );
    setProgress(48);
    const p2 = await sendToGptCustom(
      getSystem("ph_basic", lng),
      getComplexEssayPrompts(2, outline, lng),
      s.key,
      model,
    );
    setProgress(64);
    const p3 = await sendToGptCustom(
      getSystem("ph_basic", lng),
      getComplexEssayPrompts(3, outline, lng),
      s.key,
      model,
    );
    setProgress(82);
    const ccl = await sendToGptCustom(
      getSystem("ph_conclusion", lng),
      getPrompt("ph_conclusion", lng, prompt + usingPlan(lng) + outline),
      s.key,
      model,
    );
    setProgress(100);
    setRes(intro + p1 + p2 + p3 + ccl);
    addToHistory({
      prompt: prompt,
      content: intro + p1 + p2 + p3 + ccl ?? "",
      template: type,
      date: new Date(),
    });
    console.log(intro);
    console.log(p1);
    console.log(p2);
    console.log(p3);
    console.log(ccl);
    setInProgress(false);
  }

  return (
    <main>
      <section className="mx-2 print:hidden">
        <h2 className="text-2xl font-bold">{t("create")}</h2>
        <p>{t("create-desc")}</p>
      </section>
      {!welcome ? (
        <section>
          <div className="m-2 flex items-center space-x-2 print:hidden">
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
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <SettingsLogo height={16} />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>{t("options")}</SheetTitle>
                    <SheetDescription>{t("model-options")}</SheetDescription>
                  </SheetHeader>
                  <div className="py-4">
                    <div className="flex items-center space-x-2">
                      <p>{t("model")}</p>
                      <Select
                        onValueChange={(e) => setModel(e)}
                        defaultValue={model}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder={t("model")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-3.5-turbo">
                            GPT-3.5 Turbo
                          </SelectItem>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </Sheet>
            {!inProgress ? (
              <Button onClick={createButton}>{t("create")}</Button>
            ) : (
              <Button disabled className="cursor-not-allowed">
                {" "}
                <Loader2 className="mr-2 animate-spin" /> {t("please-wait")}
              </Button>
            )}
          </div>
          <div className="m-2">
            <p>
              {t("format")} - {t(typesToString(type))}
            </p>
          </div>
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
      <section className="m-2 rounded-md bg-white p-2 shadow-md dark:bg-slate-900 print:shadow-none">
        {res ? (
          <ResultDisplayer res={res} type={type} />
        ) : (
          <div className="flex flex-col items-center">
            <Info height={48} width={48} />
            <p className="font-bold">{t("result-ph")}</p>
          </div>
        )}
      </section>
      {inProgress ? (
        <section className="flex min-h-[50vh] flex-col items-center justify-center">
          <p className="mb-2 text-xl font-bold">{t("gen-in-progress")}</p>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          {progressBarVis && (
            <Progress value={progress} className="m-4 w-[60%]" />
          )}
        </section>
      ) : (
        <></>
      )}
    </main>
  );
}
