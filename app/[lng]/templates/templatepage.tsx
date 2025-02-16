"use client";
import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  addToTemplates,
  getTemplates,
  Recipe,
  saveTemplates,
} from "@/lib/recipe";
import { getComplexEssayGlobalRecipe } from "@/lib/recipes/complex-essay-global";
import { getComplexEssayRecipe } from "@/lib/recipes/complex-essay-literrature";
import { getComplexEssayPhiloRecipe } from "@/lib/recipes/complex-essay-philo";
import { getPhiloAnalysisRecipe } from "@/lib/recipes/complex-philo-analysis";
import { Copy, Eye, MoreHorizontal, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Close } from "@radix-ui/react-dialog";
import { DefaultLanguageParams } from "@/lib/languages";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TemplatesPage({
  params,
}: {
  params: DefaultLanguageParams;
}) {
  const { lng } = use(params);
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
  const [duplicateName, setDuplicateName] = useState("");
  function createTemplate() {
    let template: Recipe = { name: name, systemPrompt: prompt, steps: [] };
    addToTemplates(template);
    setTemplates([...templates, template]);
    push(`/${lng}/templates/edit?id=${templates.length}`);
  }

  function remove(index: number) {
    templates.splice(index, 1);
    saveTemplates(templates);
    setTemplates([...templates]);
  }

  function duplicate(index: number, system: boolean = false) {
    if (system) {
      let template = defaultTemplates[index];
      template = { ...template, name: duplicateName };
      addToTemplates(template);
      setTemplates([...templates, template]);
    } else {
      let template = templates[index];
      template = {
        ...template,
        name:
          duplicateName === ""
            ? `${template.name} (${t("copy-title")})`
            : duplicateName,
      };
      addToTemplates(template);
      setTemplates([...templates, template]);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-(--spacing(16)))] flex-1 flex-col gap-4 bg-slate-100/40 p-4 pb-16 dark:bg-transparent sm:pb-0 md:gap-8 md:p-10 print:mt-0 print:bg-white">
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
                  <div className="grid w-full grid-cols-[1fr_auto_auto] items-center space-x-2">
                    <Link
                      href={`/${lng}/templates/view?id=${templateItem.name}`}
                    >
                      <Button variant="outline" className="w-full">
                        {t("template-view")}
                      </Button>
                    </Link>
                    <Dialog>
                      <DialogTrigger>
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                              <Button
                                onClick={() => {
                                  setDuplicateName(
                                    `${t(templateItem.name)} (${t("copy-title")})`,
                                  );
                                }}
                                variant="outline"
                              >
                                <Copy size={14} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{t("duplicate")}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t("duplicate")}</DialogTitle>
                          <DialogDescription>
                            {t("select-new-name")}
                          </DialogDescription>
                          <Input
                            value={duplicateName}
                            onChange={(e) => setDuplicateName(e.target.value)}
                          />
                        </DialogHeader>
                        <DialogFooter>
                          <Close>
                            <Button onClick={() => duplicate(i, true)}>
                              {t("duplicate")}
                            </Button>
                          </Close>
                          <Close>
                            <Button variant="outline">{t("cancel")}</Button>
                          </Close>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <h2 className="my-4 text-2xl">{t("user-templates")}</h2>
              {templates.length > 0 && (
                <Dialog>
                  <DialogTrigger>
                    <Button
                      className="h-auto space-x-2 p-0 px-2"
                      variant="link"
                    >
                      <Plus size={14} />
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
              )}
            </div>
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
                    <div className="grid w-full grid-cols-[1fr_auto_auto] items-center space-x-2">
                      <Link href={`/${lng}/templates/edit?id=${i}`}>
                        <Button variant="outline" className="w-full">
                          {t("template-edit")}
                        </Button>
                      </Link>
                      <Dialog>
                        <DialogTrigger>
                          <Button variant="outline">
                            <Trash size={14} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t("delete-confirm")}</DialogTitle>
                            <DialogDescription>
                              {t("delete-confirm-desc")}
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Close>
                              <Button
                                onClick={() => remove(i)}
                                variant="destructive"
                              >
                                {t("delete")}
                              </Button>
                            </Close>
                            <Close>
                              <Button variant="outline">{t("cancel")}</Button>
                            </Close>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="outline">
                            <MoreHorizontal size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <Link href={`/${lng}/templates/view?id=${i}`}>
                            <DropdownMenuItem className="w-full items-center space-x-2">
                              <Eye size={14} />
                              <span>{t("template-view")}</span>
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            onClick={() => {
                              setDuplicateName(
                                `${templateItem.name} (${t("copy-title")})`,
                              );
                              duplicate(i);
                            }}
                            className="w-full items-center space-x-2"
                          >
                            <Copy size={14} />
                            <span>{t("duplicate")}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
