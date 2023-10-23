"use client";

import ResultDisplayer from "@/components/result-displayer";
import { HistoryItem } from "@/lib/history";
import { useSearchParams } from "next/navigation";
import { encode } from "gpt-token-utils";
import { Button } from "@/components/ui/button";
import { Copy, Printer } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [nbTokens, setNbTokens] = useState(0);
  const [nbWords, setNbWords] = useState(el.content.split(" ").length);
  const [nbChars, setNbChars] = useState(el.content.length);
  const [price, setPrice] = useState("$0");
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        let e = encode(el.content);
        let price = `\$${((e.length / 1000) * 0.06).toFixed(4)}`;
        setNbTokens(e.length);
        setPrice(price.toString());
      }
    } catch (error) {}
  }, []);
  return (
    <main className="mt-16">
      <section className="flex flex-col items-center justify-center">
        <section
          className="m-2 max-w-[800px] rounded-md p-4 text-justify shadow-lg dark:bg-slate-900 print:text-black print:shadow-none"
          id="ct"
        >
          <ResultDisplayer res={el.content} type={el.template} />
          <div className="mt-2 flex justify-center space-x-2 print:hidden">
            <Button
              className="group flex space-x-2 font-bold"
              onClick={() => window.print()}
            >
              <Printer
                className="transition group-hover:scale-125"
                height={16}
                width={16}
              />
              <p>Imprimer</p>
            </Button>
            <Button
              variant="outline"
              className="flex space-x-2"
              onClick={() =>
                navigator.clipboard.writeText(
                  document.getElementById("contentp")?.innerText ?? "",
                )
              }
            >
              <Copy size={16} />
            </Button>
          </div>
        </section>
        <section className="m-2 flex flex-wrap items-center justify-center print:hidden">
          <div className="m-2 w-48 rounded-lg bg-white p-4 shadow-md dark:bg-slate-900">
            <h2 className="font-bold">Prix</h2>
            <p id="price" className="text-2xl font-bold">
              {price}
            </p>
          </div>
          <div className="m-2 w-48 rounded-lg bg-white p-4 shadow-md dark:bg-slate-900">
            <h2 className="font-bold">Tokens</h2>
            <p id="price" className="text-2xl font-bold">
              {nbTokens}
            </p>
          </div>
          <div className="m-2 w-48 rounded-lg bg-white p-4 shadow-md dark:bg-slate-900">
            <h2 className="font-bold">Mots</h2>
            <p className="text-2xl font-bold">{nbWords}</p>
          </div>
          <div className="m-2 w-48 rounded-lg bg-white p-4 shadow-md dark:bg-slate-900">
            <h2 className="font-bold">Caractères</h2>
            <p className="text-2xl font-bold">{nbChars}</p>
          </div>
        </section>
      </section>
    </main>
  );
}
