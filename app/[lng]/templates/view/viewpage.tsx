"use client";
import { useTranslation } from "@/app/i18n/client";
import { Card } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { getComplexEssayGlobalRecipe } from "@/lib/recipes/complex-essay-global";
import { getComplexEssayRecipe } from "@/lib/recipes/complex-essay-literrature";
import { getComplexEssayPhiloRecipe } from "@/lib/recipes/complex-essay-philo";
import { getPhiloAnalysisRecipe } from "@/lib/recipes/complex-philo-analysis";
import { getTemplates, Recipe, StepType } from "@/lib/recipe";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HighlightedVariable } from "@/components/variable-highlight";
import { use, useState } from "react";
import Link from "next/link";
import { DefaultLanguageParams } from "@/lib/languages";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ViewTemplatePage({
  params,
}: {
  params: DefaultLanguageParams;
}) {
  const { lng } = use(params);
  const { t } = useTranslation(lng, "common");
  const searchParams = useSearchParams();
  const id: string | number = searchParams.get("id") || 0;
  const defaultTemplates: { [key: string]: Recipe } = {
    "essay-global": getComplexEssayGlobalRecipe(lng, "none"),
    philosophy: getComplexEssayPhiloRecipe(lng, "none"),
    essay: getComplexEssayRecipe(lng, "none"),
    "text-philosophy": getPhiloAnalysisRecipe(lng, "none"),
  };

  const templates = getTemplates();

  const [recipe] = useState(
    Number.isFinite(+id) ? templates[+id] : defaultTemplates[id],
  );

  function getTypeColor(type: StepType, bg: boolean = false) {
    if (bg) {
      switch (type) {
        case "utility":
          return "bg-purple-500";
        case "dynamic":
          return "bg-blue-500";
        default:
          return "bg-green-500";
      }
    } else {
      switch (type) {
        case "utility":
          return "border-purple-500";
        case "dynamic":
          return "border-blue-500";
        default:
          return "border-green-500";
      }
    }
  }
  return (
    <main className="flex min-h-[calc(100vh-(--spacing(16)))] flex-1 flex-col gap-4 bg-slate-100/40 p-4 pb-16 sm:pb-0 md:gap-8 md:p-10 dark:bg-transparent print:mt-0 print:bg-white">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mx-auto grid w-full justify-start gap-2 print:hidden">
          <h1 className="text-3xl font-semibold">{t("template-view")}</h1>
          <Link href={`/${lng}/templates`} className="flex">
            <Button variant="link" className="space-x-2">
              <ArrowLeft size={14} />
              <span>{t("back")}</span>
            </Button>
          </Link>
        </div>
        <Card className="mt-6 flex flex-col gap-6 p-6 md:p-8">
          <div className="grid gap-2">
            <h4 className="font-bold">{t("name")}</h4>
            <p className="text-muted-foreground">{t(recipe?.name)}</p>
            <h4 className="font-bold">{t("prompt")}</h4>
            <p className="text-muted-foreground">{recipe?.systemPrompt}</p>
          </div>
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">{t("steps")}</h3>
            <div className="grid gap-4">
              {recipe?.steps.map((step, i) => (
                <Card key={i} className="grid grid-cols-[1fr_auto] gap-2 p-4">
                  <div className="flex flex-col gap-4">
                    <h4 className="font-medium">{t(step.name)}</h4>
                    <p className="text-muted-foreground text-sm">
                      <HighlightedVariable lng={lng} text={step.userPrompt} />
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger>
                      <Button variant="outline">
                        <NotepadText size={14} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t("information")}</DialogTitle>
                      </DialogHeader>
                      <div>
                        <div className="my-2">
                          <h4>{t("name")}</h4>
                          <p>{t(step.name)}</p>
                        </div>
                        <div className="my-2">
                          <h4>{t("output-var")}</h4>
                          <p className="text-muted-foreground w-fit rounded-full border px-2 transition hover:border-indigo-500 hover:bg-indigo-500/20 hover:text-indigo-500">
                            {step.outputVar}
                          </p>
                        </div>
                        <div className="my-2">
                          <h4>{t("user-prompt")}</h4>
                          <HighlightedVariable
                            lng={lng}
                            text={step.userPrompt}
                          />
                        </div>
                        <div className="my-2">
                          <h4>{t("sys-prompt")}</h4>
                          <HighlightedVariable
                            lng={lng}
                            text={step.systemPrompt || t("none")}
                          />
                        </div>
                        <div className="my-2 space-y-2">
                          <h4>{t("type-gen")}</h4>
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger className="cursor-auto select-text">
                                <span
                                  className={`inline-block rounded-full border px-2 font-bold select-none ${getTypeColor(step.type ?? "dynamic")}`}
                                >
                                  <span
                                    className={`mr-2 inline-block size-3 rounded-full ${getTypeColor(step.type ?? "dynamic", true)}`}
                                  />
                                  {t(step.type ?? "dynamic")}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[350px] p-2">
                                <p className="flex items-center font-bold">
                                  <span
                                    className={`mr-1 inline-block size-3 rounded-full ${getTypeColor("dynamic", true)}`}
                                  />
                                  {t("dynamic")}
                                </p>
                                <p className="text-muted-foreground">
                                  {t("dynamic-desc")}
                                </p>
                                <p className="flex items-center font-bold">
                                  <span
                                    className={`mr-1 inline-block size-3 rounded-full ${getTypeColor("static", true)}`}
                                  />
                                  {t("static")}
                                </p>
                                <p className="text-muted-foreground">
                                  {t("static-desc")}
                                </p>
                                <p className="flex items-center font-bold">
                                  <span
                                    className={`mr-1 inline-block size-3 rounded-full ${getTypeColor("utility", true)}`}
                                  />
                                  {t("utility")}
                                </p>
                                <p className="text-muted-foreground">
                                  {t("utility-desc")}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
