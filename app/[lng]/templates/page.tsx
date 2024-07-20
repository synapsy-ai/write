"use client";
import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getComplexEssayGlobalRecipe } from "@/lib/recipes/complex-essay-global";
import { getComplexEssayRecipe } from "@/lib/recipes/complex-essay-literrature";
import { getComplexEssayPhiloRecipe } from "@/lib/recipes/complex-essay-philo";
import { getPhiloAnalysisRecipe } from "@/lib/recipes/complex-philo-analysis";
import Link from "next/link";

export default function TemplatesPage({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const { t } = useTranslation(lng, "common");
  const defaultTemplates = [
    getComplexEssayGlobalRecipe(lng, "none"),
    getComplexEssayPhiloRecipe(lng, "none"),
    getComplexEssayRecipe(lng, "none"),
    getPhiloAnalysisRecipe(lng, "none"),
  ];
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-slate-100/40 p-4 pb-16 dark:bg-transparent sm:mt-16 sm:pb-0 md:gap-8 md:p-10 print:mt-0 print:bg-white">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mx-auto grid w-full gap-2 print:hidden">
          <h1 className="text-3xl font-semibold">{t("templates")}</h1>
          <p className="text-muted-foreground">{t("template-desc")}</p>
        </div>
        <Separator className="mt-4" />
        <div>
          <h2 className="my-4 text-2xl">{t("default-templates")}</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {defaultTemplates.map((templateItem, i) => (
              <Card key={i}>
                <CardContent
                  key={i}
                  className="flex h-full flex-col justify-between p-6"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">
                      {t(templateItem.name)}
                    </h3>
                  </div>
                  <Link href={`/${lng}/templates/view?id=${templateItem.name}`}>
                    <Button variant="outline" className="w-full">
                      {t("template-view")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
