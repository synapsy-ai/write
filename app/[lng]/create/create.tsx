"use client";
import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";

import {
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
import { tones, typesToString } from "@/lib/formats";

import { Skeleton } from "@/components/ui/skeleton";
import ResultDisplayer from "@/components/result-displayer";
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
import { Database } from "@/types_db";
import { Session, User } from "@supabase/supabase-js";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import PeyronnetLogo from "@/components/peyronnet-logo";
import { Checkbox } from "@/components/ui/checkbox";
import { useSupabase } from "@/app/supabase-provider";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];
type Price = Database["public"]["Tables"]["prices"]["Row"];
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}
interface Props {
  session: Session | null;
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscriptions: SubscriptionWithProduct[] | null;
  lng: string;
  quotas: number;
}
export default function Create(props: Props) {
  const lng: any = props.lng;
  const { t } = useTranslation(lng, "common");
  const [type, setType] = useState("para");
  const [cat, setCat] = useState("regular-category");

  let s: Settings = { key: "" };
  const apiKey: string = process?.env?.OPENAI_API_KEY || "";
  if (typeof window !== "undefined") {
    s = JSON.parse(localStorage.getItem("synapsy_settings") ?? "{}");
    s.models ??= ["gpt-3.5-turbo", "gpt-4"];
    localStorage.setItem("synapsy_settings", JSON.stringify(s));
  }

  const [res, setRes] = useState<string | null>("");
  const [prompt, setPrompt] = useState("");
  const [inProgress, setInProgress] = useState(false);
  const [progressBarVis, setProgressBarVis] = useState(false);
  const [progress, setProgress] = useState(0);
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [errorMsg, setErrorMsg] = useState<any>({ message: "", name: "" });
  const [errorVis, setErrorVis] = useState(false);
  const [temp, setTemp] = useState(1);
  const [topp, setTopP] = useState(1);
  const [freqP, setFreqP] = useState(0);
  const [presP, setPresP] = useState(0);
  const [isGen, setIsGen] = useState(false);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [tone, setTone] = useState("tones-none");
  const [textToAnalyse, setTextToAnalyse] = useState("");
  const [expandInput, setExpandInput] = useState(false);
  const defaultModels = () =>
    hasGpt4Access() ? ["gpt-3.5-turbo", "gpt-4"] : ["gpt-3.5-turbo"];
  const [avModels, setAvModels] = useState(
    getAvailableModels(s.models) ?? defaultModels(),
  );
  const [gpt4Quotas, setGpt4Quotas] = useState(props.quotas);
  const supabase = useSupabase();
  function getAvailableModels(
    availableModels: string[] | undefined,
  ): string[] | undefined {
    if (!availableModels) return [];
    let models = [];
    let gpt4 = hasGpt4Access();
    for (let i = 0; i < availableModels.length; i++) {
      if (availableModels[i].includes("gpt-4") && !gpt4) continue;
      models?.push(availableModels[i]);
    }
    return models;
  }

  async function getMs() {
    let m = await getModels();
    let avm: string[] = [];
    for (let i = 0; i < m.length; i++) {
      if (m[i].id.startsWith("gpt")) {
        if (m[i].id.includes("gpt-4") && !hasGpt4Access()) continue;
        avm.push(m[i].id);
      }
    }
    setAvModels(avm);
    if (typeof window !== "undefined") {
      s.models = avm;
      localStorage.setItem("synapsy_settings", JSON.stringify(s));
    }
  }

  async function create() {
    setInProgress(false);
    setErrorVis(false);
    setProgressBarVis(false);
    setIsGen(true);
    let r = await sendToGpt(
      prompt + getVariableString(variables),
      apiKey,
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
      apiKey,
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
  async function createButton() {
    setRes("");
    if (model.includes("gpt-4")) {
      if (gpt4Quotas <= 0) return;
      if (props.session && props.session.user && gpt4Quotas > 0) {
        let q = gpt4Quotas - 1;
        setGpt4Quotas(gpt4Quotas - 1);
        try {
          const { error } = await supabase.supabase
            .from("users")
            .update({ write_gpt4_quota: q })
            .eq("id", props.session.user.id);
          if (error) throw error;
        } catch (error) {
          console.error("Error:", error);
          return null;
        }
      }
    }
    if (type === "es_complex") {
      createComplexEssay();
    } else if (type == "g_es_complex") {
      createComplexEssayGlobal();
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
      apiKey,
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
        apiKey,
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
      apiKey,
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
      apiKey,
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

  async function createComplexEssayGlobal() {
    setInProgress(true);
    setErrorVis(false);
    setIsGen(false);
    const outline = await getStandardGeneration(
      getSystem("g_es_complex_outline", lng, tone),
      getPrompt("g_es_outline", lng, prompt),
      apiKey,
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
        getSystem("g_es_intro", lng, tone),
        getPrompt("g_es_intro", lng, prompt + usingPlan(lng) + outline),
        apiKey,
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
      getSystem("g_es_basic", lng, tone),
      getComplexEssayPrompts(1, outline, lng),
      apiKey,
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
      getSystem("g_es_basic", lng, tone),
      getComplexEssayPrompts(2, outline, lng),
      apiKey,
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
      getSystem("g_es_basic", lng, tone),
      getComplexEssayPrompts(3, outline, lng),
      apiKey,
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
      getSystem("g_es_conclusion", lng, tone),
      getPrompt("g_es_conclusion", lng, prompt + usingPlan(lng) + outline),
      apiKey,
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

  async function createComplexEssay() {
    setInProgress(true);
    setErrorVis(false);
    setIsGen(false);
    const outline = await getStandardGeneration(
      getSystem("es_complex_outline", lng, tone),
      getPrompt("es_outline", lng, prompt),
      apiKey,
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
        apiKey,
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
      apiKey,
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
      apiKey,
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
      apiKey,
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
      apiKey,
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
      getSystem("ph_visual_outline", lng, tone),
      getPrompt("ph_visual_outline", lng, prompt),
      apiKey,
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
        apiKey,
        model,
        {
          temp: temp,
          presP: presP,
          topP: topp,
          freqP: freqP,
        },
        "",
        { setContent: setRes },
      )) + "\n" ?? "";
    setProgress(32);

    const p1 = await sendToGptCustom(
      getSystem("ph_basic", lng, tone),
      getComplexEssayPrompts(1, outline, lng),
      apiKey,
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
    const p2 =
      (await sendToGptCustom(
        getSystem("ph_basic", lng, tone),
        getComplexEssayPrompts(2, outline, lng),
        apiKey,
        model,
        {
          temp: temp,
          presP: presP,
          topP: topp,
          freqP: freqP,
        },
        intro + p1 || "",
        { setContent: setRes },
      )) + "\n";
    setProgress(64);
    const p3 =
      (await sendToGptCustom(
        getSystem("ph_basic", lng, tone),
        getComplexEssayPrompts(3, outline, lng),
        apiKey,
        model,
        {
          temp: temp,
          presP: presP,
          topP: topp,
          freqP: freqP,
        },
        intro + p1 + p2 || "",
        { setContent: setRes },
      )) + "\n";
    setProgress(82);
    const ccl = await sendToGptCustom(
      getSystem("ph_conclusion", lng, tone),
      getPrompt("ph_conclusion", lng, prompt + usingPlan(lng) + outline),
      apiKey,
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

  function isSubscribed(): boolean {
    if (!props.session || !props.subscriptions) return false;
    for (let i = 0; i < props.subscriptions?.length; i++) {
      if (
        props.subscriptions[i].prices?.products?.name
          ?.toLowerCase()
          .includes("write")
      ) {
        return true;
      }
    }
    return false;
  }

  function hasGpt4Access(): boolean {
    if (!props.session || !props.subscriptions) return false;
    for (let i = 0; i < props.subscriptions?.length; i++) {
      if (
        props.subscriptions[i].prices?.products?.name
          ?.toLowerCase()
          .includes("write")
      ) {
        return props.subscriptions[i].status === "active";
      }
    }
    return false;
  }

  return (
    <main className="mt-2 flex min-h-full flex-col pb-16 sm:mt-16 sm:pb-0 print:mt-0">
      <section className="ml-2 flex items-center space-x-2 print:hidden">
        <PenBox />
        <span>
          <h2 className="text-2xl font-bold">{t("create")}</h2>
          <p>{t("create-desc")}</p>
        </span>
      </section>
      <Separator className="my-2" />

      <section>
        <p className="m-2 font-bold print:hidden">{t("prompt")}</p>
        <p className="m-2 font-bold print:hidden">{gpt4Quotas}</p>
        <div className="m-2 flex flex-col items-stretch space-y-1 sm:flex-row sm:items-start sm:space-x-2 sm:space-y-0 print:hidden">
          {expandInput ? (
            <Textarea
              value={prompt}
              onChange={(v) => setPrompt(v.target.value)}
            />
          ) : (
            <Input value={prompt} onChange={(v) => setPrompt(v.target.value)} />
          )}

          <div className="grid grid-cols-[1fr,auto] space-x-1 sm:flex sm:space-x-2">
            <FormatDialog lng={lng} setVal={setType} setCategory={setCat} />

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
          {isSubscribed() ? (
            <>
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
            </>
          ) : (
            <Dialog>
              <DialogTrigger className="w-auto">
                <Button className="group w-full space-x-1 disabled:cursor-not-allowed sm:w-auto">
                  <Sparkles
                    className="group-hover:animate-pulse group-hover:duration-700"
                    height={16}
                    width={16}
                  />
                  <p className="font-bold">{t("create")}</p>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  {props.session ? (
                    <section className="m-4">
                      <div className="flex justify-center">
                        <PeyronnetLogo width={250} />
                      </div>
                      <h2 className="text-center">{t("products-desc")}</h2>
                      <p className="max-w-3xl text-center">
                        {t("pricing-desc")}
                      </p>
                    </section>
                  ) : (
                    <section className="m-4 flex flex-col items-center space-y-2">
                      <div className="flex items-center">
                        <PeyronnetLogo width={250} />
                      </div>
                      <span className="rounded-full border border-violet-600 px-2 text-sm font-bold text-violet-600 dark:bg-violet-600/10">
                        {t("new")}
                      </span>
                      <h2 className="text-center">{t("unlock-power-ai")}</h2>
                      <p className="max-w-3xl text-center">
                        {t("account-desc")}
                      </p>
                    </section>
                  )}
                </DialogHeader>
                <DialogFooter>
                  <section className="flex flex-col-reverse space-x-2 sm:flex-row">
                    <DialogClose>
                      <Button variant="link">{t("close")}</Button>
                    </DialogClose>
                    {props.session ? (
                      <Link href={`/${lng}/pricing`}>
                        <Button>{t("see-pricing")}</Button>
                      </Link>
                    ) : (
                      <div className="flex justify-center space-x-2">
                        {" "}
                        <Link href="login">
                          <Button variant="outline">{t("sign-in")}</Button>
                        </Link>
                        <Link href="https://account.peyronnet.group/login">
                          <Button>{t("sign-up")}</Button>
                        </Link>
                      </div>
                    )}
                  </section>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="flex items-center space-x-2 px-2 print:hidden">
          <Checkbox
            id="expandChk"
            checked={expandInput}
            onCheckedChange={() => setExpandInput(!expandInput)}
          />
          <label htmlFor="expandChk">{t("expand-input")}</label>
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
            <span>
              {t(cat)} - {t(typesToString(type))}
            </span>
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

      {!errorVis && res && (
        <section
          className={
            "m-2 grow rounded-md border bg-white p-2 text-justify shadow-sm dark:bg-slate-900/50 print:border-0 print:shadow-none"
          }
        >
          <ResultDisplayer is_generating={isGen} res={res} type={type} />
        </section>
      )}
      {!errorVis && !res && (
        <section
          className={
            "m-2 flex grow items-center justify-center rounded-md border bg-white p-2 shadow-sm dark:bg-slate-900/50 print:text-black print:shadow-none"
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
