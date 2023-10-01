"use client";
import { useTranslation } from "@/app/i18n/client";
import { GenerationItem } from "@/components/generation-item";
import { HistoryItem } from "@/lib/history";
import { Eraser } from "lucide-react";
import { useState } from "react";

export default function Creations({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const { t } = useTranslation(lng, "common");

  let history: HistoryItem[] = [];
  if (typeof window !== "undefined") {
    history = JSON.parse(
      localStorage.getItem("rativegen_write_history") ?? "[]"
    );
  }

  const [noItems, setNoItems] = useState(history.length == 0);

  return (
    <main className="m-2">
      <header>
        <h2 className="font-bold text-2xl">{t("generations")}</h2>
        <p>{t("no-gen-text")}</p>
      </header>
      {!noItems ? (
        <section className="flex flex-wrap justify-center p-5 md:justify-start">
          {history.map((el, i) => (
            <GenerationItem key={i} item={el} lng={lng} />
          ))}
        </section>
      ) : (
        <section className="flex flex-col justify-center items-center min-h-[50vh]">
          <Eraser height={48} width={48} />
          <p>{t("no-gen")}</p>
        </section>
      )}
    </main>
  );
}
