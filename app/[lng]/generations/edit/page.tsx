"use client";

import ResultDisplayer from "@/components/result-displayer";
import { HistoryItem } from "@/lib/history";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Book, Calendar, Copy, Edit, Printer, Text } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { Separator } from "@/components/ui/separator";
import { typesToString } from "@/lib/formats";
import VariableItem from "@/components/variable-item";
import { Variable } from "@/lib/variable";
import VariableItemView from "@/components/variable-item-view";
import TailwindEditor from "@/components/tailwind-editor";
import { generateJSON } from "@tiptap/html";
import { defaultExtensions } from "@/lib/editor-extensions";

export default function GenerationViewPage({
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
    <main className="mt-2 pb-16 sm:mt-16 sm:pb-0 print:mt-0">
      <section className="mx-2 flex items-center space-x-2 print:hidden">
        <Book />
        <span>
          <h2 className="text-2xl font-bold">{t("generation")}</h2>
          <p>{t("generation-desc")}</p>
        </span>
      </section>
      <Separator className="my-2 print:hidden" />
      <section className="mx-2 grid grid-cols-[auto,1fr] items-center gap-2 print:hidden">
        <Text size={16} />
        <p>{el.prompt}</p>

        <Edit size={16} />
        <p>{t(typesToString(el.template))}</p>

        <Calendar size={16} />
        <p>{new Date(el.date).toLocaleString()}</p>
      </section>
      <Separator className="my-2 print:hidden" />
      <section className="flex flex-col items-center justify-center">
        <TailwindEditor id={+id} lng={params.lng} content={c} />
      </section>
    </main>
  );
}
