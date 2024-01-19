"use client";
import {
  Laptop,
  Moon,
  RefreshCcw,
  Settings as SettingsLogo,
  Sun,
} from "lucide-react";
import { useTranslation } from "../../i18n/client";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Settings } from "@/lib/settings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { changeLanguage } from "i18next";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { getModelString } from "@/lib/models";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getModels } from "@/lib/ai-completions";

export default function SettingsPage({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const { t } = useTranslation(lng, "common");
  const { setTheme } = useTheme();
  let s: Settings = { key: "" };
  if (typeof window !== "undefined") {
    s = JSON.parse(localStorage.getItem("synapsy_settings") ?? "{}");
    s.models ??= ["gpt-3.5-turbo", "gpt-4"];
    localStorage.setItem("synapsy_settings", JSON.stringify(s));
  }
  const [keyTxt, setKeyTxt] = useState(s.key);
  const [models, setModels] = useState(
    s.models?.map((m) => {
      return getModelString(m);
    }),
  );
  const [modelQuery, setModelQuery] = useState("");

  function setKey() {
    s.key = keyTxt;
    localStorage.setItem("synapsy_settings", JSON.stringify(s));
  }

  async function refreshModels() {
    let m = await getModels(s.key);
    let avm: string[] = [];
    let avm2: string[] = [];
    for (let i = 0; i < m.length; i++) {
      if (m[i].id.startsWith("gpt")) avm.push(getModelString(m[i].id));
      if (m[i].id.startsWith("gpt")) avm2.push(m[i].id);
    }
    setModels(avm);
    if (typeof window !== "undefined") {
      s.models = avm2;
      localStorage.setItem("synapsy_settings", JSON.stringify(s));
    }
  }

  const router = useRouter();
  return (
    <main className="mt-2 min-h-full space-y-2 px-2 pb-20 sm:mt-16 sm:pb-0">
      <section className="flex items-center space-x-2">
        <SettingsLogo />
        <span>
          <h2 className="text-2xl font-bold">{t("settings")}</h2>
          <p>{t("settings-desc")}</p>
        </span>
      </section>
      <Separator className="my-2" />
      <section>
        <h3 className="text-xl font-semibold">{t("theme")}</h3>
        <p>{t("theme-desc")}</p>
        <Separator className="my-2" />

        <div className="sm:flex">
          <div className="flex flex-col items-stretch space-y-2 sm:grid sm:grid-cols-3 sm:space-x-2 sm:space-y-0">
            <Button
              onClick={() => setTheme("light")}
              variant="outline"
              className="px-10 py-8"
            >
              <div className="my-2 grid grid-cols-[auto,1fr] items-center space-x-2">
                <Sun />
                <p>{t("light")}</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="px-10 py-8"
              onClick={() => setTheme("dark")}
            >
              <div className="my-2 grid grid-cols-[auto,1fr] items-center space-x-2">
                <Moon />
                <p>{t("dark")}</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="px-10 py-8"
              onClick={() => setTheme("system")}
            >
              <div className="my-2 grid grid-cols-[auto,1fr] items-center space-x-2">
                <Laptop />
                <p>{t("system")}</p>
              </div>
            </Button>
          </div>
        </div>
      </section>
      <section>
        <h3 className="text-xl font-semibold">{t("language")}</h3>
        <p>{t("language-desc")}</p>
        <Separator className="my-2" />
        <div className="flex items-center space-x-2">
          <p>{t("language")}</p>
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
              <SelectItem value="fr">Français</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>
      <section>
        <h3 className="text-xl font-semibold">{t("openai-options")}</h3>
        <p>{t("openai-options-desc")}</p>
        <Separator className="my-2" />
        <div className="flex items-center space-x-2">
          <p>{t("api-key")}</p>
          <Input
            type="password"
            onChange={(v) => setKeyTxt(v.target.value)}
            className="max-w-[350px]"
          />
          <Button variant="outline" onClick={setKey}>
            {t("confirm")}
          </Button>
        </div>
        <p className="mt-2">
          {t("models")} ({models?.length})
        </p>
        <div className="mt-2 max-w-[550px] rounded-md border p-2">
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
          <ScrollArea className="h-[200px]">
            <div>
              {models
                ?.filter((s) =>
                  s.toLowerCase().includes(modelQuery.toLowerCase()),
                )
                .map((m, i) => (
                  <p
                    key={i}
                    className="m-1 rounded-md p-2 hover:bg-slate-200 dark:hover:bg-slate-800"
                  >
                    {m}
                  </p>
                ))}
            </div>
          </ScrollArea>
        </div>
      </section>
    </main>
  );
}
