"use client";
import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";

import {
  Info,
  Loader2,
  LucideFileWarning,
  Settings as SettingsLogo,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Settings } from "@/lib/settings";
import {
  getStaticAiGeneration,
  getDynamicAiGeneration,
  getDynamicAiGenerationCustom,
} from "@/lib/ai-completions";
import { addToHistory } from "@/lib/history";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { tones } from "@/lib/formats";

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
import { Tables } from "@/types_db";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import PeyronnetLogo from "@/components/peyronnet-logo";
import { Checkbox } from "@/components/ui/checkbox";
import ComplexGenItem from "@/components/complex-gen";
import GenerationStep from "@/lib/generation-step";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTemplates, migrateRecipes, Recipe } from "@/lib/recipe";
import { getPhiloAnalysisRecipe } from "@/lib/recipes/complex-philo-analysis";
import { getComplexEssayGlobalRecipe } from "@/lib/recipes/complex-essay-global";
import { getComplexEssayRecipe } from "@/lib/recipes/complex-essay-literrature";
import { getComplexEssayPhiloRecipe } from "@/lib/recipes/complex-essay-philo";
import ModelSelector from "@/components/model-selector";
import { getModelProvider, ModelList } from "@/lib/models";
import updateQuotas from "@/utils/update-quotas";
import { Plans } from "@/utils/helpers";

type Subscription = Tables<"subscriptions">;
type Product = Tables<"products">;
type Price = Tables<"prices">;
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
    s.aiModels ??= {
      openAiModels: ["gpt-4o-mini", "gpt-3.5-turbo"],
      mistralModels: [
        "mistral-large-latest",
        "mistral-medium",
        "mistral-small",
        "codestral-latest",
        "codestral-mamba-latest",
      ],
      anthropicModels: ["claude-3-5-haiku-20241022"],
    };
    localStorage.setItem("synapsy_settings", JSON.stringify(s));
  }

  const [res, setRes] = useState<string | null>("");
  const [prompt, setPrompt] = useState("");
  const [inProgress, setInProgress] = useState(false);
  const [progressBarVis, setProgressBarVis] = useState(false);
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
    getSubscriptionPlan() !== "free"
      ? {
          openAiModels: ["gpt-3.5-turbo", "gpt-4"],
          mistralModels: ["mistral-small"],
          anthropicModels: ["claude-3-5-haiku-20241022"],
        }
      : {
          openAiModels: ["gpt-3.5-turbo", "gpt-4o-mini"],
          mistralModels: ["mistral-small"],
          anthropicModels: ["claude-3-5-haiku-20241022"],
        };
  const [avModels, setAvModels] = useState(
    getAvailableModels(s.aiModels) ?? defaultModels(),
  );

  const [templateId, setTemplateId] = useState<number | undefined>();

  const [complexSteps, setComplexSteps] = useState<GenerationStep[]>([]);
  const [complexSectionVis, setComplexSectionVis] = useState(false);

  const [gpt4Quotas, setGpt4Quotas] = useState(props.quotas);
  const [unlimited, setUnlimited] = useState(getSubscriptionPlan() === "pro");
  function getAvailableModels(
    availableModels: ModelList | undefined,
  ): ModelList {
    if (!availableModels)
      return { openAiModels: [], mistralModels: [], anthropicModels: [] };
    let models: ModelList = {
      openAiModels: [],
      mistralModels: [],
      anthropicModels: [],
    };
    let gpt4 = getSubscriptionPlan() !== "free";
    for (let i = 0; i < availableModels.openAiModels.length; i++) {
      if (
        (availableModels.openAiModels[i].includes("gpt-4") ||
          availableModels.openAiModels[i].includes("o1")) &&
        !gpt4 &&
        !availableModels.openAiModels[i].includes("mini")
      )
        continue;
      models.openAiModels.push(availableModels.openAiModels[i]);
    }
    models.mistralModels = availableModels.mistralModels;
    models.anthropicModels = availableModels.anthropicModels;
    return models;
  }

  async function create() {
    setInProgress(false);
    setErrorVis(false);
    setProgressBarVis(false);
    setIsGen(true);
    let r = await getDynamicAiGeneration(
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
      getModelProvider(model, avModels),
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
    let r = await getDynamicAiGeneration(
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
      getModelProvider(model, avModels),
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

    // If the user has selected GPT-4, check if they have access to the model
    if (
      (model.includes("gpt-4") && !model.includes("mini")) ||
      model.includes("o1")
    ) {
      if (gpt4Quotas <= 0) return;
      if (props.user && props.user && gpt4Quotas > 0) {
        let q = gpt4Quotas - 1;
        setGpt4Quotas(gpt4Quotas - 1);
        try {
          await updateQuotas(q, props.user.id);
        } catch (error) {
          console.error("Error:", error);
          return null;
        }
      }
    }

    // If the user has selected its own template
    if (templateId !== undefined) {
      executeRecipe(getTemplates()[templateId]);
      return;
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

  async function executeRecipe(recipe: Recipe) {
    migrateRecipes(getTemplates());
    setInProgress(true);
    setErrorVis(false);
    setIsGen(true);
    setComplexSectionVis(true);

    const context: { [key: string]: string } = {};
    setComplexSteps(
      recipe.steps.map((step) => ({ i18nname: step.name, done: false })),
    );
    let final = "";

    for (let i = 0; i < recipe.steps.length; i++) {
      const step = recipe.steps[i];
      step.userPrompt = step.userPrompt.replace(
        "[[PROMPT]]",
        (type === "ph_analysis_complex" ? textToAnalyse : prompt) +
          getVariableString(variables),
      );
      for (let j = 0; j < Object.keys(context).length; j++) {
        step.userPrompt = step.userPrompt.replace(
          `[[${Object.keys(context)[j]}]]`,
          context[Object.keys(context)[j]],
        );
      }
      if (!step.hide || step.type !== "utility") setInProgress(false);
      let result;
      if (step.type === "utility" || step.type === "static" || step.hide) {
        result = await getStaticAiGeneration(
          step.systemPrompt ?? recipe.systemPrompt,
          step.userPrompt,
          apiKey,
          model,
          {
            temp: temp,
            presP: presP,
            topP: topp,
            freqP: freqP,
          },
          getModelProvider(model, avModels),
        );
      } else {
        result = await getDynamicAiGenerationCustom(
          step.systemPrompt ?? recipe.systemPrompt,
          step.userPrompt,
          apiKey,
          model,
          {
            temp: temp,
            presP: presP,
            topP: topp,
            freqP: freqP,
          },
          final,
          { setContent: step.hide ? () => {} : setRes },
          getModelProvider(model, avModels),
        );
      }

      if (result instanceof OpenAI.APIError) {
        setErrorMsg(result);
        setErrorVis(true);
        setInProgress(false);
        return;
      }
      if (!step.hide && step.type !== "utility") final += result;

      // Store the result in the context
      if (step.outputVar) context[step.outputVar] = result;

      setComplexSteps(
        recipe.steps.map((step, index) => ({
          i18nname: step.name,
          done: index <= i,
        })),
      );
      setRes(final);
    }

    addToHistory({
      prompt: type === "ph_analysis_complex" ? textToAnalyse : prompt,
      content: final || Object.values(context).join("\n") || "",
      template: type,
      date: new Date(),
    });

    setIsGen(false);
    setInProgress(false);
    setComplexSectionVis(false);
  }

  async function createComplexPhiloAnalysis() {
    executeRecipe(getPhiloAnalysisRecipe(lng, tone));
  }

  async function createComplexEssayGlobal() {
    executeRecipe(getComplexEssayGlobalRecipe(lng, tone));
  }

  async function createComplexEssay() {
    executeRecipe(getComplexEssayRecipe(lng, tone));
  }

  async function createComplexPhiloEssay() {
    executeRecipe(getComplexEssayPhiloRecipe(lng, tone));
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

  function getSubscriptionPlan(): Plans {
    if (!props.user || !props.subscriptions) return "free";
    for (let i = 0; i < props.subscriptions?.length; i++) {
      if (
        props.subscriptions[i].prices?.products?.name
          ?.toLowerCase()
          .includes("write")
      ) {
        if (
          props.subscriptions[i].prices?.products?.name
            ?.toLowerCase()
            .includes("pro")
        ) {
          return "pro";
        } else if (
          props.subscriptions[i].prices?.products?.name
            ?.toLowerCase()
            .includes("premium")
        ) {
          return "premium";
        } else if (
          props.subscriptions[i].prices?.products?.name
            ?.toLowerCase()
            .includes("basic")
        ) {
          return "basic";
        }
        return "free";
      }
    }
    return "free";
  }

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-slate-100/40 p-4 pb-16 dark:bg-transparent sm:pb-0 md:gap-8 md:p-10 print:mt-0 print:bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-2 print:hidden">
        <h1 className="text-3xl font-semibold">{t("create")}</h1>
        <p className="text-muted-foreground">{t("create-desc")}</p>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_350px]">
        <div className="grid gap-6">
          {!unlimited &&
            (model.includes("gpt-4") || model.includes("o1")) &&
            !model.includes("mini") && (
              <Card className="border-violet-500 bg-violet-500/20 print:hidden">
                <div className="m-2 flex items-center space-x-2">
                  <Info size={16} color="#8b5cf6" />
                  <p className="font-bold text-violet-500">
                    {t("gpt-4-remaining-quotas")} {gpt4Quotas}
                  </p>
                </div>
              </Card>
            )}
          <Card className="print:hidden">
            <CardHeader>
              <CardTitle>{t("prompt")}</CardTitle>
              <CardDescription>{t("prompt-desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {expandInput ? (
                  <Textarea
                    value={prompt}
                    onChange={(v) => setPrompt(v.target.value)}
                  />
                ) : (
                  <Input
                    value={prompt}
                    onChange={(v) => setPrompt(v.target.value)}
                  />
                )}
              </div>
              <div className="mt-2 flex items-center space-x-2 px-2 print:hidden">
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
            </CardContent>
          </Card>
          {getSubscriptionPlan() !== "free" ? (
            <>
              {!inProgress ? (
                <Button
                  disabled={
                    (!unlimited &&
                      model.includes("gpt-4") &&
                      gpt4Quotas <= 0) ||
                    type.startsWith("ph_analysis_")
                      ? textToAnalyse.replace(" ", "") == ""
                      : prompt.replace(" ", "") == ""
                  }
                  className="group space-x-1 print:hidden"
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
              <DialogTrigger>
                <Button className="group w-full space-x-1 disabled:cursor-not-allowed">
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
                  {props.user ? (
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
                    {props.user ? (
                      <Link href={`/${lng}/pricing`}>
                        <Button>{t("see-pricing")}</Button>
                      </Link>
                    ) : (
                      <div className="flex justify-center space-x-2">
                        <Link href="login">
                          <Button variant="outline">{t("sign-in")}</Button>
                        </Link>
                        <Link href="https://account.peyronnet.group/signin/signup">
                          <Button>{t("sign-up")}</Button>
                        </Link>
                      </div>
                    )}
                  </section>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {complexSectionVis && (
            <ComplexGenItem steps={complexSteps} lng={lng} />
          )}
          <Card className="print:border-0 print:shadow-none">
            <CardHeader className="print:hidden">
              <CardTitle>{t("generation")}</CardTitle>
            </CardHeader>
            <CardContent>
              {!errorVis && res && (
                <section className={"grow text-justify"}>
                  <ResultDisplayer
                    font={s.gen_font ?? "default"}
                    is_generating={isGen}
                    lng={lng}
                    res={res}
                    type={type}
                  />
                </section>
              )}
              {!errorVis && !res && (
                <section
                  className={
                    "m-2 flex grow items-center justify-center rounded-md border bg-white p-2 py-[34px] shadow-sm dark:bg-slate-900/50 print:text-black print:shadow-none"
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
                  <p className="mb-2 text-xl font-bold">
                    {t("gen-in-progress")}
                  </p>
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
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 text-sm text-muted-foreground print:hidden">
          <Card>
            <CardHeader>
              <CardTitle>{t("options")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="model">{t("model")}</label>
                  <div className="flex items-center space-x-2">
                    <ModelSelector
                      placeholder={t("model")}
                      avModels={avModels}
                      plan={getSubscriptionPlan()}
                      model={model}
                      setModel={setModel}
                      lng={lng}
                    />

                    <Sheet>
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger>
                            <SheetTrigger asChild>
                              <Button variant="outline">
                                <SettingsLogo height={16} />
                              </Button>
                            </SheetTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t("settings")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>{t("options")}</SheetTitle>
                          <SheetDescription>
                            {t("model-options")}
                          </SheetDescription>
                        </SheetHeader>
                        <div className="py-4">
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
                            <HoverCardContent>
                              {t("temp-desc")}
                            </HoverCardContent>
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
                            <HoverCardContent>
                              {t("top-p-desc")}
                            </HoverCardContent>
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
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="format">Format</label>
                  <FormatDialog
                    setTemplateId={setTemplateId}
                    lng={lng}
                    setVal={setType}
                    setCategory={setCat}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="tone">{t("tone")}</label>
                  <Select defaultValue={tone} onValueChange={(v) => setTone(v)}>
                    <SelectTrigger>
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
            </CardContent>
          </Card>
          {type !== "ph_complex" && type !== "es_complex" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>{t("variables")}</span>
                  <span className="rounded-full border bg-muted/40 px-2 text-sm text-muted-foreground">
                    {variables.length}
                  </span>
                </CardTitle>
                <CardDescription>{t("variables-desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="print:hidden">
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

                  <div className="">
                    {variables.length > 0 &&
                      variables.map((el, i) => (
                        <VariableItem
                          small
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>
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
