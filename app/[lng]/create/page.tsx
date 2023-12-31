"use client";
import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";

import {
  Hand,
  Info,
  Lightbulb,
  Loader2,
  LucideFileWarning,
  PenBox,
  PencilRuler,
  RefreshCcw,
  Settings as SettingsLogo,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Settings } from "@/lib/settings";
import {
  getComplexEssayPrompts,
  getModels,
  getPrompt,
  getPromptComplexAnalysis,
  getStandardGeneration,
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
import formats, { tones, typesToString } from "@/lib/formats";
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
import { Separator } from "@/components/ui/separator";
import OpenAI from "openai";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getModelString } from "@/lib/models";
import { FormatSelector } from "@/components/format-selector";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Slider } from "@/components/ui/slider";
import { Variable, getVariableString } from "@/lib/variable";
import VariableItem from "@/components/variable-item";
import FormatDialog from "@/components/format-dialog";
import { Textarea } from "@/components/ui/textarea";

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
    s.models ??= ["gpt-3.5-turbo", "gpt-4"];
    localStorage.setItem("synapsy_settings", JSON.stringify(s));
  }

  const [welcome, setWelcome] = useState(s.key === undefined);
  const [keyTxt, setKeyTxt] = useState(s.key);
  const [res, setRes] = useState<string | null>("");
  const [prompt, setPrompt] = useState("");
  const [inProgress, setInProgress] = useState(false);
  const [progressBarVis, setProgressBarVis] = useState(false);
  const [progress, setProgress] = useState(0);
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [errorMsg, setErrorMsg] = useState<any>({ message: "", name: "" });
  const [errorVis, setErrorVis] = useState(false);
  const [avModels, setAvModels] = useState(
    s.models ?? ["gpt-3.5-turbo", "gpt-4"],
  );
  const [temp, setTemp] = useState(1);
  const [topp, setTopP] = useState(1);
  const [freqP, setFreqP] = useState(0);
  const [presP, setPresP] = useState(0);
  const [isGen, setIsGen] = useState(false);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [tone, setTone] = useState("tones-none");
  const [textToAnalyse, setTextToAnalyse] = useState("");

  async function getMs() {
    let m = await getModels(s.key);
    let avm: string[] = [];
    for (let i = 0; i < m.length; i++) {
      if (m[i].id.startsWith("gpt")) avm.push(m[i].id);
    }
    setAvModels(avm);
    if (typeof window !== "undefined") {
      s.models = avm;
      localStorage.setItem("synapsy_settings", JSON.stringify(s));
    }
  }

  function setKey() {
    s.key = keyTxt;
    localStorage.setItem("synapsy_settings", JSON.stringify(s));
    setWelcome(false);
  }

  async function create() {
    setInProgress(false);
    setErrorVis(false);
    setProgressBarVis(false);
    setIsGen(true);
    let r = await sendToGpt(
      prompt + getVariableString(variables),
      s.key,
      type,
      lng,
      model,
      {
        temp: temp,
        presP: presP,
        topP: topp,
        freqP: freqP,
      },
      { setContent: setRes, setLoading: setInProgress },
      tone,
    );
    if (r instanceof OpenAI.APIError) {
      setErrorMsg(r);
      setErrorVis(true);
      setInProgress(false);
      setIsGen(false);

      return;
    }

    addToHistory({
      prompt: prompt,
      content: r ?? res ?? "An error occurred when saving the generation",
      template: type,
      date: new Date(),
    });
    setIsGen(false);
  }

  async function createAnalysis() {
    setInProgress(false);
    setErrorVis(false);
    setProgressBarVis(false);
    setIsGen(true);
    let r = await sendToGpt(
      textToAnalyse + "\n" + prompt + getVariableString(variables),
      s.key,
      type,
      lng,
      model,
      {
        temp: temp,
        presP: presP,
        topP: topp,
        freqP: freqP,
      },
      { setContent: setRes, setLoading: setInProgress },
      tone,
    );
    if (r instanceof OpenAI.APIError) {
      setErrorMsg(r);
      setErrorVis(true);
      setInProgress(false);
      setIsGen(false);

      return;
    }

    addToHistory({
      prompt: textToAnalyse,
      content: r ?? res ?? "An error occurred when saving the generation",
      template: type,
      date: new Date(),
    });
    setIsGen(false);
  }

  function createButton() {
    setRes("");
    if (type === "es_complex") {
      createComplexEssay();
    } else if (type == "ph_complex") {
      createComplexPhiloEssay();
    } else if (type === "ph_analysis_complex") {
      createComplexPhiloAnalysis();
    } else if (type.startsWith("ph_analysis_")) {
      createAnalysis();
    } else {
      create();
    }
  }

  async function createComplexPhiloAnalysis() {
    setInProgress(true);
    setErrorVis(false);
    setIsGen(false);

    // 1. Generate the outline
    const outline = await getStandardGeneration(
      getSystem("ph_analysis_outline", lng, tone),
      getPrompt("ph_analysis_outline", lng, textToAnalyse) + "\n" + prompt,
      s.key,
      model,
      {
        temp: temp,
        presP: presP,
        topP: topp,
        freqP: freqP,
      },
    );

    if (outline instanceof OpenAI.APIError) {
      setErrorMsg(outline);
      setErrorVis(true);
      setInProgress(false);
      return;
    }

    setIsGen(true);
    setInProgress(false);
    setRes("");

    // 2. Generate the intro
    const intro =
      (await sendToGptCustom(
        getSystem("ph_analysis_outline", lng, tone),
        getPromptComplexAnalysis(
          textToAnalyse,
          outline,
          "ph_analysis_intro",
          lng,
        ),
        s.key,
        model,
        {
          temp: temp,
          presP: presP,
          topP: topp,
          freqP: freqP,
        },
        "",
        { setContent: setRes },
      )) ?? "";

    if (intro instanceof OpenAI.APIError) {
      setErrorMsg(intro);
      setErrorVis(true);
      setInProgress(false);
      return;
    }

    // 3. Generate dev part
    const p1 = await sendToGptCustom(
      getSystem("ph_analysis_outline", lng, tone),
      getPromptComplexAnalysis(textToAnalyse, outline, "ph_analysis_dev", lng),
      s.key,
      model,
      {
        temp: temp,
        presP: presP,
        topP: topp,
        freqP: freqP,
      },
      intro + "\n" || "",
      { setContent: setRes },
    );

    // 4. Generate conclusion
    const ccl = await sendToGptCustom(
      getSystem("ph_analysis_outline", lng, tone),
      getPromptComplexAnalysis(
        textToAnalyse,
        outline,
        "ph_analysis_conclusion",
        lng,
      ),
      s.key,
      model,
      {
        temp: temp,
        presP: presP,
        topP: topp,
        freqP: freqP,
      },
      intro + "\n" + p1 + "\n" || "",
      { setContent: setRes },
    );
    setRes(intro + p1 + ccl);
    addToHistory({
      prompt: textToAnalyse,
      content: intro + "\n" + p1 + "\n" + ccl ?? "",
      template: type,
      date: new Date(),
    });
    setIsGen(false);
    setInProgress(false);
  }

  async function createComplexEssay() {
    setInProgress(true);
    setErrorVis(false);
    setIsGen(false);
    const outline = await getStandardGeneration(
      getSystem("es_complex_outline", lng, tone),
      getPrompt("es_outline", lng, prompt),
      s.key,
      model,
      {
        temp: temp,
        presP: presP,
        topP: topp,
        freqP: freqP,
      },
    );

    if (outline instanceof OpenAI.APIError) {
      setErrorMsg(outline);
      setErrorVis(true);
      setInProgress(false);
      return;
    }
    setIsGen(true);
    setInProgress(false);
    setRes("");
    setProgress(16);
    const intro =
      (await sendToGptCustom(
        getSystem("es_intro", lng, tone),
        getPrompt("es_intro", lng, prompt + usingPlan(lng) + outline),
        s.key,
        model,
        {
          temp: temp,
          presP: presP,
          topP: topp,
          freqP: freqP,
        },
        "",
        { setContent: setRes },
      )) ?? "";

    if (intro instanceof OpenAI.APIError) {
      setErrorMsg(intro);
      setErrorVis(true);
      setInProgress(false);
      return;
    }
    setProgress(32);

    const p1 = await sendToGptCustom(
      getSystem("es_basic", lng, tone),
      getComplexEssayPrompts(1, outline, lng),
      s.key,
      model,
      {
        temp: temp,
        presP: presP,
        topP: topp,
        freqP: freqP,
      },
      intro || "",
      { setContent: setRes },
    );
    if (p1 instanceof OpenAI.APIError) {
      setErrorMsg(p1);
      setErrorVis(true);
      setInProgress(false);
      return;
    }
    setProgress(48);
    const p2 = await sendToGptCustom(
      getSystem("es_basic", lng, tone),
      getComplexEssayPrompts(2, outline, lng),
      s.key,
      model,
      {
        temp: temp,
        presP: presP,
        topP: topp,
        freqP: freqP,
      },
      intro + p1 || "",
      { setContent: setRes },
    );
    if (p2 instanceof OpenAI.APIError) {
      setErrorMsg(p2);
      setErrorVis(true);
      setInProgress(false);
      return;
    }
    setProgress(64);
    const p3 = await sendToGptCustom(
      getSystem("es_basic", lng, tone),
      getComplexEssayPrompts(3, outline, lng),
      s.key,
      model,
      {
        temp: temp,
        presP: presP,
        topP: topp,
        freqP: freqP,
      },
      intro + p1 + p2 || "",
      { setContent: setRes },
    );
    if (p3 instanceof OpenAI.APIError) {
      setErrorMsg(p3);
      setErrorVis(true);
      setInProgress(false);
      return;
    }
    setProgress(82);
    const ccl = await sendToGptCustom(
      getSystem("es_conclusion", lng, tone),
      getPrompt("es_conclusion", lng, prompt + usingPlan(lng) + outline),
      s.key,
      model,
      {
        temp: temp,
        presP: presP,
        topP: topp,
        freqP: freqP,
      },
      intro + p1 + p2 + p3 || "",
      { setContent: setRes },
    );
    if (ccl instanceof OpenAI.APIError) {
      setErrorMsg(ccl);
      setErrorVis(true);
      setInProgress(false);
      return;
    }
    setProgress(100);
    setRes(intro + p1 + p2 + p3 + ccl);
    addToHistory({
      prompt: prompt,
      content: intro + p1 + p2 + p3 + ccl ?? "",
      template: type,
      date: new Date(),
    });
    setIsGen(false);
    setInProgress(false);
  }

  async function createComplexPhiloEssay() {
    setInProgress(true);
    setIsGen(false);
    setProgressBarVis(true);
    const outline = await getStandardGeneration(
      getSystem("ph_complex_outline", lng, tone),
      getPrompt("ph_outline", lng, prompt),
      s.key,
      model,
      {
        temp: temp,
        presP: presP,
        topP: topp,
        freqP: freqP,
      },
    );
    setProgress(16);
    setInProgress(false);
    setRes("");
    setIsGen(true);
    const intro =
      (await sendToGptCustom(
        getSystem("ph_intro", lng, tone),
        getPrompt("ph_intro", lng, prompt + usingPlan(lng) + outline),
        s.key,
        model,
        {
          temp: temp,
          presP: presP,
          topP: topp,
          freqP: freqP,
        },
        "",
        { setContent: setRes },
      )) ?? "";
    setProgress(32);

    const p1 = await sendToGptCustom(
      getSystem("ph_basic", lng, tone),
      getComplexEssayPrompts(1, outline, lng),
      s.key,
      model,
      {
        temp: temp,
        presP: presP,
        topP: topp,
        freqP: freqP,
      },
      intro || "",
      { setContent: setRes },
    );
    setProgress(48);
    const p2 = await sendToGptCustom(
      getSystem("ph_basic", lng, tone),
      getComplexEssayPrompts(2, outline, lng),
      s.key,
      model,
      {
        temp: temp,
        presP: presP,
        topP: topp,
        freqP: freqP,
      },
      intro + p1 || "",
      { setContent: setRes },
    );
    setProgress(64);
    const p3 = await sendToGptCustom(
      getSystem("ph_basic", lng, tone),
      getComplexEssayPrompts(3, outline, lng),
      s.key,
      model,
      {
        temp: temp,
        presP: presP,
        topP: topp,
        freqP: freqP,
      },
      intro + p1 + p2 || "",
      { setContent: setRes },
    );
    setProgress(82);
    const ccl = await sendToGptCustom(
      getSystem("ph_conclusion", lng, tone),
      getPrompt("ph_conclusion", lng, prompt + usingPlan(lng) + outline),
      s.key,
      model,
      {
        temp: temp,
        presP: presP,
        topP: topp,
        freqP: freqP,
      },
      intro + p1 + p2 + p3 || "",
      { setContent: setRes },
    );
    setProgress(100);
    setRes(intro + p1 + p2 + p3 + ccl);
    addToHistory({
      prompt: prompt,
      content: intro + p1 + p2 + p3 + ccl ?? "",
      template: type,
      date: new Date(),
    });
    setIsGen(false);
    setInProgress(false);
  }

  function removeVariable(i: number) {
    const updatedVariables = [...variables];
    updatedVariables.splice(i, 1);
    setVariables([...updatedVariables]);
    console.table(updatedVariables);
  }

  function editVariable(i: number, variable: Variable) {
    variables[i] = variable;
    setVariables([...variables]);
  }

  return (
    <main className="mt-16 flex min-h-full flex-col print:mt-0">
      <section className="mx-2 print:hidden">
        <h2 className="text-2xl font-bold">{t("create")}</h2>
        <p>{t("create-desc")}</p>
      </section>
      {!welcome ? (
        <section>
          <p className="m-2 font-bold print:hidden">{t("prompt")}</p>
          <div className="m-2 flex flex-col items-stretch space-y-1 print:hidden sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
            <Input onChange={(v) => setPrompt(v.target.value)} />
            <div className="grid grid-cols-[1fr,auto] space-x-1 sm:flex sm:space-x-2">
              <FormatDialog lng={lng} setVal={setType} />

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
                          <ScrollArea className="h-[200px]">
                            {avModels.map((el, i) => (
                              <SelectItem key={i} value={el}>
                                {getModelString(el)}
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" onClick={getMs}>
                        <RefreshCcw height={14} />
                      </Button>
                    </div>
                    <Separator className="my-2" />
                    <p>{t("api-key")}</p>
                    <div className="my-2 flex space-x-2">
                      <Input
                        type="password"
                        onChange={(v) => {
                          setKeyTxt(v.target.value);
                          setKey();
                        }}
                        className="w-full"
                        defaultValue={s.key}
                      />
                      <Button onClick={setKey}>{t("confirm")}</Button>
                    </div>
                    <Separator className="my-2" />
                    <p>{t("temp")}</p>
                    <HoverCard openDelay={200}>
                      <HoverCardTrigger className="flex space-x-2">
                        <Slider
                          onValueChange={(v) => setTemp(v[0])}
                          defaultValue={[temp]}
                          max={2}
                          step={0.01}
                        />
                        <p>{temp}</p>
                      </HoverCardTrigger>
                      <HoverCardContent>{t("temp-desc")}</HoverCardContent>
                    </HoverCard>
                    <p>{t("top-p")}</p>
                    <HoverCard openDelay={200}>
                      <HoverCardTrigger className="flex space-x-2">
                        <Slider
                          onValueChange={(v) => setTopP(v[0])}
                          defaultValue={[topp]}
                          max={1}
                          step={0.01}
                        />
                        <p>{topp}</p>
                      </HoverCardTrigger>
                      <HoverCardContent>{t("top-p-desc")}</HoverCardContent>
                    </HoverCard>
                    <p>{t("freq-penalty")}</p>
                    <HoverCard openDelay={200}>
                      <HoverCardTrigger className="flex space-x-2">
                        <Slider
                          onValueChange={(v) => setFreqP(v[0])}
                          defaultValue={[freqP]}
                          max={2}
                          step={0.01}
                        />
                        <p>{freqP}</p>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        {t("freq-penalty-desc")}
                      </HoverCardContent>
                    </HoverCard>
                    <p>{t("pres-penalty")}</p>
                    <HoverCard openDelay={200}>
                      <HoverCardTrigger className="flex space-x-2">
                        <Slider
                          onValueChange={(v) => setPresP(v[0])}
                          defaultValue={[presP]}
                          max={2}
                          step={0.01}
                        />
                        <p>{presP}</p>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        {t("pres-penalty-desc")}
                      </HoverCardContent>
                    </HoverCard>
                    <Separator className="my-2" />
                    <div className="flex items-center space-x-2">
                      <p>{t("tone")}</p>
                      <Select
                        defaultValue={tone}
                        onValueChange={(v) => setTone(v)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder={t("tone")} />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className="h-[200px]">
                            {tones.map((el, i) => (
                              <SelectItem key={i} value={el}>
                                {t(el)}
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            {!inProgress ? (
              <Button
                disabled={
                  type.startsWith("ph_analysis_")
                    ? textToAnalyse.replace(" ", "") == ""
                    : prompt.replace(" ", "") == ""
                }
                className="group space-x-1 disabled:cursor-not-allowed"
                onClick={createButton}
              >
                <Sparkles
                  className="group-hover:animate-pulse group-hover:duration-700"
                  height={16}
                  width={16}
                />
                <p className="font-bold">{t("create")}</p>
              </Button>
            ) : (
              <Button disabled className="cursor-not-allowed">
                {" "}
                <Loader2 className="mr-2 animate-spin" /> {t("please-wait")}
              </Button>
            )}
          </div>
          {type.startsWith("ph_analysis_") && (
            <div className="p-2">
              <p className="mb-2 font-bold print:hidden">
                {t("text-to-analyse")}
              </p>
              <Textarea
                className="print:hidden"
                value={textToAnalyse}
                onChange={(v) => setTextToAnalyse(v.target.value)}
              />
            </div>
          )}
          {type !== "ph_complex" && type !== "es_complex" && (
            <div className="print:hidden">
              <div>
                <p className="m-2 font-bold">
                  {t("variables")} ({variables.length})
                </p>
                <Button
                  className="h-auto"
                  variant="link"
                  onClick={() =>
                    setVariables([
                      ...variables,
                      { name: "", value: "", id: uuidv4() },
                    ])
                  }
                >
                  {t("add-variable")}
                </Button>
              </div>
              <div>
                {variables.length > 0 &&
                  variables.map((el, i) => (
                    <VariableItem
                      functions={{
                        setVar: editVariable,
                        removeVar: removeVariable,
                      }}
                      key={el.id}
                      lng={lng}
                      index={i}
                      item={el}
                    />
                  ))}
              </div>
            </div>
          )}
          <div className="m-2 print:hidden">
            <p className="font-bold">{t("gen-settings")}</p>
            <p className="flex items-center space-x-2">
              <PenBox height={14} />
              <span>{t(typesToString(type))}</span>
            </p>
            <p className="flex items-center space-x-2">
              <Lightbulb height={14} />
              <span>{getModelString(model)}</span>
            </p>
            <p className="flex items-center space-x-2">
              <PencilRuler height={14} />
              <span>{t(tone)}</span>
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

      {!errorVis && res && (
        <section
          className={
            "m-2 grow rounded-md bg-white p-2 text-justify shadow-md dark:bg-slate-900 print:shadow-none"
          }
        >
          <ResultDisplayer is_generating={isGen} res={res} type={type} />
        </section>
      )}
      {!errorVis && !res && (
        <section
          className={
            "m-2 flex grow items-center justify-center rounded-md bg-white p-2 shadow-md dark:bg-slate-900 print:text-black print:shadow-none"
          }
        >
          <div className="flex flex-col items-center justify-center">
            <Info height={48} width={48} />
            <p className="font-bold">{t("result-ph")}</p>
          </div>
        </section>
      )}
      {errorVis && (
        <section className="flex flex-col items-center">
          <LucideFileWarning height={48} width={48} />
          <p className="font-bold">{t("error-occured")}</p>
          <ErrorDisplayer err={errorMsg} />
        </section>
      )}
      {inProgress ? (
        <section className="flex min-h-[50vh] flex-col items-center justify-center">
          <p className="mb-2 text-xl font-bold">{t("gen-in-progress")}</p>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </section>
      ) : (
        <></>
      )}
    </main>
  );
}
function ErrorDisplayer(props: { err: any }) {
  return (
    <div className="text-center">
      <p>{props.err.name.toString()}</p>
      <p>{props.err.message.toString()}</p>
    </div>
  );
}
