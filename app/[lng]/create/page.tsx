"use client";
import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hand } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Settings } from "@/lib/settings";
import { Template, sendToGpt } from "@/lib/ai-completions";

export default function CreatePage({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const { t } = useTranslation(lng, "common");

  const [type, setType] = useState("para");

  let s: Settings = { key: "" };
  if (typeof window !== undefined) {
    s = JSON.parse(localStorage.getItem("quark_settings") ?? "{}");
  }

  const [welcome, setWelcome] = useState(s.key === undefined);
  const [keyTxt, setKeyTxt] = useState(s.key);
  const [res, setRes] = useState<string | null>("");
  const [prompt, setPrompt] = useState("");

  function setKey() {
    s.key = keyTxt;
    localStorage.setItem("quark_settings", JSON.stringify(s));
    setWelcome(false);
  }

  async function create() {
    let r = await sendToGpt(prompt, s.key, type, lng);
    setRes(r);
  }

  return (
    <main>
      <section className="mx-2">
        <h2 className="font-bold text-2xl">{t("create")}</h2>
        <p>{t("create-desc")}</p>
      </section>
      {!welcome ? (
        <section className="bg-white dark:bg-slate-900 p-2 flex items-center rounded-md space-x-2 shadow-md m-2">
          <Input onChange={(v) => setPrompt(v.target.value)} />
          <Select onValueChange={(v) => setType(v)} defaultValue={type}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("content-type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="para">{t("paragraph")}</SelectItem>
              <SelectItem value="email">{t("email")}</SelectItem>
              <SelectItem value="blog">{t("blog-post")}</SelectItem>
              <SelectItem value="ideas">{t("ideas")}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={create}>{t("create")}</Button>
        </section>
      ) : (
        <section className="flex flex-col items-center">
          <Hand size={64} />
          <h2 className="font-bold text-2xl">{t("welcome")}</h2>
          <p>{t("welcome-desc")}</p>
          <Input
            type="password"
            onChange={(v) => setKeyTxt(v.target.value)}
            className="max-w-[350px] my-2"
          />
          <Button onClick={setKey}>{t("confirm")}</Button>
        </section>
      )}
      <section>{res}</section>
    </main>
  );
}
