"use client";
import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { addToTemplates, getTemplates, Recipe } from "@/lib/recipe";
import { getComplexEssayGlobalRecipe } from "@/lib/recipes/complex-essay-global";
import { getComplexEssayRecipe } from "@/lib/recipes/complex-essay-literrature";
import { getComplexEssayPhiloRecipe } from "@/lib/recipes/complex-essay-philo";
import { getPhiloAnalysisRecipe } from "@/lib/recipes/complex-philo-analysis";
import { Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

  const { push } = useRouter();

  const [templates, setTemplates] = useState(getTemplates());
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");

  function createTemplate() {
    let template: Recipe = { name: name, systemPrompt: prompt, steps: [] };
    addToTemplates(template);
    setTemplates([...templates, template]);
    push(`/${lng}/templates/edit?id=${templates.length}`);
  }

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
          <div>
            <h2 className="my-4 text-2xl">{t("user-templates")}</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((templateItem, i) => (
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
                    <div className="flex w-full items-center space-x-2">
                      <Link href={`/${lng}/templates/edit?id=${i}`}>
                        <Button variant="outline" className="w-full">
                          {t("template-edit")}
                        </Button>
                      </Link>
                      <Link href={`/${lng}/templates/view?id=${i}`}>
                        <Button variant="outline">
                          <Eye size={14} />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {templates.length === 0 && (
              <div className="flex flex-col items-center rounded-md border p-8">
                <h3>{t("no-user-templates")}</h3>
                <p>{t("no-user-templates-desc")}</p>

                <Dialog>
                  <DialogTrigger>
                    <Button className="space-x-2" variant="link">
                      <Plus />
                      <span>{t("create")}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("template-new")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                      <p>{t("name")}</p>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <p>{t("sys-prompt")}</p>
                      <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                      <div className="flex justify-center">
                        <Button
                          onClick={createTemplate}
                          disabled={!name || !prompt}
                        >
                          {t("create")}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
