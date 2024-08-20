"use client";

import { HistoryItem } from "@/lib/history";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { typesToString } from "@/lib/formats";
import TailwindEditor from "@/components/tailwind-editor";
import { generateJSON } from "@tiptap/html";
import { defaultExtensions } from "@/lib/editor-extensions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function GenerationEditPage({
  params,
}: {
  params: { lng: string };
}) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? 0;
  let el: HistoryItem = {
    date: new Date(),
    prompt: "",
    content: "",
    template: "para",
  };
  if (typeof window !== "undefined") {
    el = JSON.parse(localStorage.getItem("synapsy_write_history") ?? "[]")[id];
  }

  const { t } = useTranslation(params.lng, "common");
  const [content, setContent] = useState(el.content);
  const c = generateJSON(content, [...defaultExtensions]);
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-slate-100/40 p-4 pb-16 dark:bg-transparent sm:pb-0 md:gap-8 md:p-10 print:mt-0 print:bg-white">
      <header className="mx-auto grid w-full max-w-6xl gap-2 print:hidden">
        <h1 className="text-3xl font-semibold">{t("edit")}</h1>
      </header>

      <section className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_350px]">
        <TailwindEditor id={+id} lng={params.lng} content={c} />
        <div className="grid gap-6 print:hidden">
          <Card>
            <CardHeader>
              <CardTitle>{t("overview")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span>{t("format")}</span>
                  <span className="font-medium">
                    {t(typesToString(el.template))}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t("date")}</span>
                  <span className="font-medium">
                    {new Date(el.date).toLocaleString()}
                  </span>
                </div>
                {el.template !== "manual" && (
                  <div className="flex flex-col">
                    <span>{t("prompt")}</span>
                    <span className="rounded-md bg-slate-100 p-2 font-medium dark:bg-slate-900">
                      {el.prompt}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
