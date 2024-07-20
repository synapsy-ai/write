"use client";
import { useTranslation } from "@/app/i18n/client";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { getComplexEssayGlobalRecipe } from "@/lib/recipes/complex-essay-global";
import { getComplexEssayRecipe } from "@/lib/recipes/complex-essay-literrature";
import { getComplexEssayPhiloRecipe } from "@/lib/recipes/complex-essay-philo";
import { getPhiloAnalysisRecipe } from "@/lib/recipes/complex-philo-analysis";
import { Recipe } from "@/lib/recipe";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { HighlightedVariable } from "@/components/variable-highlight";

export default function TemplatesPage({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const { t } = useTranslation(lng, "common");
  const searchParams = useSearchParams();
  const id: string | number = searchParams.get("id") || 0;
  const defaultTemplates: { [key: string]: Recipe } = {
    "essay-global": getComplexEssayGlobalRecipe(lng, "none"),
    philosophy: getComplexEssayPhiloRecipe(lng, "none"),
    essay: getComplexEssayRecipe(lng, "none"),
    "text-philosophy": getPhiloAnalysisRecipe(lng, "none"),
  };

  const recipe: Recipe =
    typeof id === "string" ? defaultTemplates[id] : defaultTemplates["essay"];

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-slate-100/40 p-4 pb-16 dark:bg-transparent sm:mt-16 sm:pb-0 md:gap-8 md:p-10 print:mt-0 print:bg-white">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mx-auto grid w-full gap-2 print:hidden">
          <h1 className="text-3xl font-semibold">{t("template-view")}</h1>
        </div>
        <Card className="mt-6 flex flex-col gap-6 p-6 md:p-8">
          <div className="grid gap-2">
            <h4 className="font-bold">{t("name")}</h4>
            <p className="text-muted-foreground">{t(recipe.name)}</p>
            <h4 className="font-bold">{t("prompt")}</h4>
            <p className="text-muted-foreground">{recipe.systemPrompt}</p>
          </div>
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">{t("steps")}</h3>
            <div className="grid gap-4">
              {recipe.steps.map((step, i) => (
                <Card className="grid grid-cols-[1fr,auto] gap-2 p-4">
                  <div className="flex flex-col gap-4">
                    <h4 className="font-medium">{t(step.name)}</h4>
                    <p className="text-sm text-muted-foreground">
                      <HighlightedVariable text={step.userPrompt} />
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
                          <p className="w-fit rounded-full border px-2 text-muted-foreground">
                            {step.outputVar}
                          </p>
                        </div>
                        <div className="my-2">
                          <h4>{t("user-prompt")}</h4>
                          <HighlightedVariable text={step.userPrompt} />
                        </div>
                        <div className="my-2">
                          <h4>{t("sys-prompt")}</h4>
                          <HighlightedVariable
                            text={step.systemPrompt || t("none")}
                          />
                        </div>
                        <div className="my-2 flex items-center space-x-2">
                          <Checkbox
                            disabled
                            checked={step.hide || false}
                            id="hideChk"
                          />
                          <label htmlFor="hideChk">{t("hide-content")}</label>
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
