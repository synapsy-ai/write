"use client";
import { useTranslation } from "@/app/i18n/client";
import { Settings } from "@/lib/settings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Close } from "@radix-ui/react-dialog";
import { useState } from "react";

export default function SystemTemplateCreator(props: {
  lng: string;
  setTemplates: Function;
}) {
  const { t } = useTranslation(props.lng, "common");
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  let s: Settings = { key: "" };
  if (typeof window !== "undefined") {
    s = JSON.parse(localStorage.getItem("synapsy_settings") ?? "{}");
    s.models ??= ["gpt-3.5-turbo"];
    s.system_templates ??= [];
    localStorage.setItem("synapsy_settings", JSON.stringify(s));
  }

  function createTemplate() {
    s.system_templates?.push({ name: name, prompt: prompt });
    localStorage.setItem("synapsy_settings", JSON.stringify(s));
    props.setTemplates([...(s.system_templates ?? [])]);
    setName("");
    setPrompt("");
  }
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button variant="link">{t("create-template")}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("system-template-creator")}</DialogTitle>
            <DialogDescription>
              {t("system-template-creator-desc")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-2">
            <p>{t("name")}</p>
            <Input value={name} onChange={(v) => setName(v.target.value)} />
            <p>{t("prompt")}</p>
            <Textarea
              value={prompt}
              onChange={(v) => setPrompt(v.target.value)}
            />
          </div>
          <DialogFooter>
            <Close>
              <Button disabled={!(name && prompt)} onClick={createTemplate}>
                {t("create")}
              </Button>
            </Close>
            <Close>
              <Button variant="outline">{t("cancel")}</Button>
            </Close>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
