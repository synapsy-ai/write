"use client";
import {
  ArrowUpRightFromSquare,
  Laptop,
  Moon,
  RefreshCcw,
  Settings as SettingsLogo,
  Sun,
  Trash,
} from "lucide-react";
import { useTranslation } from "../../i18n/client";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { FontType, Settings } from "@/lib/settings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { use, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { getModelString, ModelList } from "@/lib/models";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getModels } from "@/lib/ai-completions";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { version } from "@/lib/version";
import SystemTemplateCreator from "@/components/system-template-creator";
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
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DefaultLanguageParams } from "@/lib/languages";

export default function SettingsPage({
  params,
}: {
  params: DefaultLanguageParams;
}) {
  const { lng } = use(params);
  const { t } = useTranslation(lng, "common");
  const { setTheme } = useTheme();
  let s: Settings = { key: "" };
  if (typeof window !== "undefined") {
    s = JSON.parse(localStorage.getItem("synapsy_settings") ?? "{}");
    s.system_templates ??= [];
    s.gen_font ??= "default";
    s.aiModels ??= {
      openAiModels: ["gpt-4o-mini", "gpt-3.5-turbo"],
      mistralModels: [],
      anthropicModels: [],
    };
    localStorage.setItem("synapsy_settings", JSON.stringify(s));
  }
  const [models, setModels] = useState(
    s.aiModels ?? {
      openAiModels: ["gpt-4o-mini", "gpt-3.5-turbo"],
      mistralModels: [],
      anthropicModels: [],
    },
  );
  const [modelQuery, setModelQuery] = useState("");
  const [templates, setTemplates] = useState(s.system_templates ?? []);
  const [anchor, setAnchor] = useState("general");
  async function refreshModels() {
    let m: ModelList = await getModels();
    setModels(m);
    if (typeof window !== "undefined") {
      s.aiModels = m;
      localStorage.setItem("synapsy_settings", JSON.stringify(s));
    }
  }

  function resetData() {
    s = {
      aiModels: {
        openAiModels: ["gpt-4o-mini", "gpt-3.5-turbo"],
        mistralModels: [
          "mistral-large-latest",
          "mistral-medium",
          "mistral-small",
          "codestral-latest",
          "codestral-mamba-latest",
        ],
        anthropicModels: [],
      },
      gen_font: "default",
      key: "",
      system_templates: [],
    };
    localStorage.setItem("synapsy_settings", JSON.stringify(s));
    window.location.reload();
  }

  const router = useRouter();
  return (
    <main className="flex min-h-[calc(100vh-(--spacing(16)))] flex-1 flex-col gap-4 bg-slate-100/40 p-4 px-2 pb-20 dark:bg-transparent sm:pb-0 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="mx-2 text-3xl font-semibold">{t("settings")}</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 p-2 text-sm text-muted-foreground">
          <Link
            href="#"
            onClick={() => setAnchor("general")}
            className={anchor === "general" ? "font-semibold text-primary" : ""}
            prefetch={false}
          >
            {t("general")}
          </Link>
          <Link
            href="#models"
            className={anchor === "models" ? "font-semibold text-primary" : ""}
            onClick={() => setAnchor("models")}
            prefetch={false}
          >
            {t("models")}
          </Link>
          <Link
            href="#templates"
            className={
              anchor === "templates" ? "font-semibold text-primary" : ""
            }
            onClick={() => setAnchor("templates")}
            prefetch={false}
          >
            {t("system-templates")}
          </Link>
          <Link
            href="#misc"
            className={anchor === "misc" ? "font-semibold text-primary" : ""}
            onClick={() => setAnchor("misc")}
            prefetch={false}
          >
            {t("misc")}
          </Link>
        </nav>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("theme")}</CardTitle>
              <CardDescription>{t("theme-desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-stretch space-y-2 sm:grid sm:grid-cols-3 sm:space-x-2 sm:space-y-0">
                <Button
                  onClick={() => setTheme("light")}
                  variant="outline"
                  className="px-10 py-8"
                >
                  <div className="my-2 grid grid-cols-[auto_1fr] items-center space-x-2">
                    <Sun />
                    <p>{t("light")}</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="px-10 py-8"
                  onClick={() => setTheme("dark")}
                >
                  <div className="my-2 grid grid-cols-[auto_1fr] items-center space-x-2">
                    <Moon />
                    <p>{t("dark")}</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="px-10 py-8"
                  onClick={() => setTheme("system")}
                >
                  <div className="my-2 grid grid-cols-[auto_1fr] items-center space-x-2">
                    <Laptop />
                    <p>{t("system")}</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("generation-font")}</CardTitle>
              <CardDescription>{t("generation-font-desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                defaultValue={s.gen_font ?? "default"}
                onValueChange={(v: FontType) => {
                  s.gen_font = v;
                  localStorage.setItem("synapsy_settings", JSON.stringify(s));
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("generation-font")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">{t("font-default")}</SelectItem>
                  <SelectItem value="sans">{t("font-sans")}</SelectItem>
                  <SelectItem value="serif">{t("font-serif")}</SelectItem>
                  <SelectItem value="mono">{t("font-mono")}</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("language")}</CardTitle>
              <CardDescription>{t("language-desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                defaultValue={lng}
                onValueChange={(v) => {
                  router.push(`/${v}/settings`);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("language")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Card id="models">
            <CardHeader>
              <CardTitle>{t("models")}</CardTitle>
              <CardDescription>{t("models-desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder={t("search-models")}
                    value={modelQuery}
                    onChange={(v) => setModelQuery(v.target.value)}
                  />
                  <Button onClick={refreshModels} variant="outline">
                    <RefreshCcw height={14} />
                  </Button>
                </div>
                <Tabs defaultValue="openAI">
                  <TabsList>
                    <TabsTrigger value="openAI">OpenAI</TabsTrigger>
                    <TabsTrigger value="mistral">Mistral</TabsTrigger>
                    <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
                  </TabsList>
                  <ScrollArea className="h-[200px]">
                    <TabsContent value="openAI">
                      <div>
                        {models.openAiModels
                          ?.filter(
                            (s) =>
                              s.toLowerCase().startsWith("gpt") ||
                              s.toLowerCase().startsWith("o1"),
                          )
                          .filter((s) =>
                            s.toLowerCase().includes(modelQuery.toLowerCase()),
                          )
                          .map((m, i) => (
                            <p
                              key={i}
                              className="m-1 rounded-md border border-transparent p-2 hover:border-slate-300 hover:bg-slate-200/50 dark:hover:border-accent dark:hover:bg-slate-800/50"
                            >
                              {getModelString(m)}
                            </p>
                          ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="mistral">
                      <div>
                        {models.mistralModels
                          ?.filter(
                            (s) => !s.toLowerCase().startsWith("pixtral"),
                          )
                          .filter((s) =>
                            s.toLowerCase().includes(modelQuery.toLowerCase()),
                          )
                          .map((m, i) => (
                            <p
                              key={i}
                              className="m-1 rounded-md border border-transparent p-2 hover:border-slate-300 hover:bg-slate-200/50 dark:hover:border-accent dark:hover:bg-slate-800/50"
                            >
                              {getModelString(m)}
                            </p>
                          ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="anthropic">
                      <div>
                        {models.anthropicModels
                          ?.filter((s) =>
                            s.toLowerCase().includes(modelQuery.toLowerCase()),
                          )
                          .map((m, i) => (
                            <p
                              key={i}
                              className="m-1 rounded-md border border-transparent p-2 hover:border-slate-300 hover:bg-slate-200/50 dark:hover:border-accent dark:hover:bg-slate-800/50"
                            >
                              {getModelString(m)}
                            </p>
                          ))}
                      </div>
                    </TabsContent>
                  </ScrollArea>
                </Tabs>
              </div>
            </CardContent>
          </Card>
          <Card id="templates">
            <CardHeader>
              <CardTitle>{t("system-templates")}</CardTitle>
              <CardDescription>{t("system-templates-desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <SystemTemplateCreator setTemplates={setTemplates} lng={lng} />
              {templates.length > 0 && (
                <div className="mt-2 rounded-md border p-2">
                  <ScrollArea className="h-[200px]">
                    {templates.map((template, i) => (
                      <div
                        className="m-1 grid grid-cols-[1fr_auto] rounded-md border border-transparent p-2 hover:border-slate-300 hover:bg-slate-200/50 dark:hover:border-accent dark:hover:bg-slate-800/50"
                        key={i}
                      >
                        <span>
                          <h4>{template.name}</h4>
                          <p className="text-slate-400">
                            {template.prompt.substring(0, 50) +
                              (template.prompt.length > 50 ? "..." : "")}
                          </p>
                        </span>
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                onClick={() => {
                                  s.system_templates?.splice(i, 1);
                                  localStorage.setItem(
                                    "synapsy_settings",
                                    JSON.stringify(s),
                                  );
                                  setTemplates([...(s.system_templates ?? [])]);
                                }}
                                className="mt-1 h-auto p-2"
                                variant="ghost"
                              >
                                <Trash size={12} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t("delete")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
          <Card id="misc">
            <CardHeader>
              <CardTitle>{t("misc")}</CardTitle>
              <CardDescription>{t("other-settings")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-start">
              <Dialog>
                <DialogTrigger>
                  <Button variant="link" className="space-x-2">
                    <ArrowUpRightFromSquare size={16} />
                    <span>{t("about")}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("about-long")}</DialogTitle>
                    <p>
                      Version {version} <br />© {new Date().getFullYear()}{" "}
                      Synapsy by GRP
                    </p>
                    <p>
                      NextJS - MIT License - © 2024 Vercel, Inc.
                      <br />
                      RadixUI - MIT License - © 2022 WorkOS
                      <br />
                      shadcn/ui - MIT License - © 2023 shadcn
                      <br />
                      Lucide - ISC License - © 2024 Lucide Contributors
                    </p>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose>
                      <Button variant="outline">{t("close")}</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger>
                  <Button variant="link" className="space-x-2">
                    <ArrowUpRightFromSquare size={16} />
                    <span>{t("reset-data")}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("reset-data")}</DialogTitle>
                  </DialogHeader>
                  <p>{t("reset-data-desc")}</p>
                  <DialogFooter>
                    <DialogClose>
                      <Button onClick={resetData} variant="destructive">
                        {t("delete")}
                      </Button>
                    </DialogClose>
                    <DialogClose>
                      <Button variant="outline">{t("close")}</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
