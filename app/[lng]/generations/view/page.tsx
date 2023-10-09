"use client";

import ResultDisplayer from "@/components/result-displayer";
import { HistoryItem } from "@/lib/history";
import { useSearchParams } from "next/navigation";
import { encode } from "gpt-token-utils";

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

  function getPrice() {
    try {
      if (typeof window !== "undefined") {
        let e = encode(
          JSON.parse(localStorage.getItem("synapsy_write_history") ?? "[]")[id]
            .content,
        );
        let price = `\$${((e.length / 1000) * 0.06).toFixed(4)}`;
        return price.toString();
      }
      return "$0";
    } catch (error) {
      return "$0";
    }
  }
  function countWords() {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("synapsy_write_history") ?? "[]")[
        id
      ].content.split(" ").length;
    }
  }

  function countChars() {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("synapsy_write_history") ?? "[]")[
        id
      ].content.length;
    }
  }
  return (
    <main>
      <section className="flex flex-col items-center justify-center">
        <section
          className="m-2 max-w-[800px] rounded-md p-4 text-justify shadow-lg dark:bg-slate-900 print:text-black print:shadow-none"
          id="ct"
        >
          <ResultDisplayer res={el.content} type={el.template} />
        </section>
        <section className="m-2 flex flex-wrap items-center justify-center print:hidden">
          <div className="m-2 w-48 rounded-lg bg-white p-4 shadow-md dark:bg-slate-900">
            <h2 className="font-bold">Prix</h2>
            <p id="price" className="text-2xl font-bold">
              {getPrice()}
            </p>
          </div>
          <div className="m-2 w-48 rounded-lg bg-white p-4 shadow-md dark:bg-slate-900">
            <h2 className="font-bold">Mots</h2>
            <p className="text-2xl font-bold">{countWords()}</p>
          </div>
          <div className="m-2 w-48 rounded-lg bg-white p-4 shadow-md dark:bg-slate-900">
            <h2 className="font-bold">Caractères</h2>
            <p className="text-2xl font-bold">{countChars()}</p>
          </div>
        </section>
      </section>
    </main>
  );
}
