"use client";

import ResultDisplayer from "@/components/result-displayer";
import { HistoryItem } from "@/lib/history";
import { useSearchParams } from "next/navigation";
import { encode } from "gpt-token-utils";
import { Button } from "@/components/ui/button";
import { Book, Calendar, Copy, Edit, Printer, Text } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { Separator } from "@/components/ui/separator";
import { typesToString } from "@/lib/formats";
import VariableItem from "@/components/variable-item";
import { Variable } from "@/lib/variable";
import VariableItemView from "@/components/variable-item-view";
import Link from "next/link";

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

  const [nbTokens, setNbTokens] = useState(0);
  const [nbWords, setNbWords] = useState(el.content.split(" ").length);
  const [nbChars, setNbChars] = useState(el.content.length);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [price, setPrice] = useState("$0");
  const [content, setContent] = useState(el.content);
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        let e = encode(el.content);
        let price = `\$${((e.length / 1000) * 0.06).toFixed(4)}`;
        setNbTokens(e.length);
        setPrice(price.toString());
      }
      getVariables();
    } catch (error) {}
  }, []);

  function getVariables() {
    let regex = /\[(.*?)\]/g;
    let matches = el.content.match(regex);
    setVariables(
      matches?.map((m) => {
        return {
          name: m.replaceAll("[", "").replaceAll("]", ""),
          id: m,
          value: "",
        };
      }) || [],
    );
  }

  function editVariable(i: number, variable: Variable) {
    variables[i] = variable;
    setVariables([...variables]);
  }

  function updateVariables() {
    let c = el.content;
    for (let i = 0; i < variables.length; i++) {
      c = c.replaceAll(`[${variables[i].name}]`, variables[i].value);
      console.log(`[${variables[i].name}]`);
    }
    console.log(c);
    setContent(c);
  }
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
        <section
          className="m-2 max-w-[800px] rounded-md border pb-4 text-justify shadow-sm dark:bg-slate-900/50 print:border-0 print:text-black print:shadow-none"
          id="ct"
        >
          <ResultDisplayer
            is_generating={false}
            res={content}
            type={el.template}
          />
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
              <p>{t("print")}</p>
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
            <Link href={`/${params.lng}/generations/edit?id=${id}`}>
              <Button variant="outline">
                <Edit size={16} />
              </Button>
            </Link>
          </div>
        </section>
        {el.template !== "ideas" &&
        el.template !== "ph_visual_outline" &&
        variables &&
        variables.length > 0 ? (
          <span className="flex w-full justify-center px-2">
            <section className="mb-2 w-full max-w-[800px] rounded-md border pb-4 text-justify shadow-sm dark:bg-slate-900/50 print:hidden">
              <p className="m-4 mb-0 text-sm font-normal text-slate-400 dark:text-slate-500">
                {t("variables")} ({variables && variables.length})
              </p>
              <div>
                {variables &&
                  variables.length > 0 &&
                  variables?.map((el, i) => (
                    <VariableItemView
                      functions={{
                        setVar: editVariable,
                      }}
                      key={i}
                      lng={params.lng}
                      index={i}
                      item={el}
                    />
                  ))}
              </div>
              <span className="flex justify-center">
                <Button onClick={updateVariables} variant="outline">
                  {t("apply")}
                </Button>
              </span>
            </section>
          </span>
        ) : (
          <></>
        )}

        <section className="grid w-full max-w-[800px] grid-cols-2 items-center justify-center gap-2 px-2 pb-5 md:grid-cols-4 md:p-0 print:hidden">
          <div className="rounded-lg border bg-white/50 p-4 shadow-sm transition-all hover:bg-slate-100/75 dark:bg-slate-900/50 dark:hover:bg-slate-900/90">
            <h2 className="text-sm font-normal text-slate-400 dark:text-slate-500">
              {t("price")}
            </h2>
            <p id="price" className="text-xl font-semibold">
              {price}
            </p>
          </div>
          <div className="hover:bg-whit rounded-lg border bg-white/50 p-4 shadow-sm transition-all hover:bg-slate-100/75 dark:bg-slate-900/50 dark:hover:bg-slate-900/90">
            <h2 className="text-sm font-normal text-slate-400 dark:text-slate-500">
              {t("tokens")}
            </h2>
            <p id="price" className="text-xl font-semibold">
              {nbTokens}
            </p>
          </div>
          <div className="hover:bg-whit rounded-lg border bg-white/50 p-4 shadow-sm transition-all hover:bg-slate-100/75 dark:bg-slate-900/50 dark:hover:bg-slate-900/90">
            <h2 className="text-sm font-normal text-slate-400 dark:text-slate-500">
              {t("words")}
            </h2>
            <p className="text-xl font-semibold">{nbWords}</p>
          </div>
          <div className="hover:bg-whit rounded-lg border bg-white/50 p-4 shadow-sm transition-all hover:bg-slate-100/75 dark:bg-slate-900/50 dark:hover:bg-slate-900/90">
            <h2 className="text-sm font-normal text-slate-400 dark:text-slate-500">
              {t("characters")}
            </h2>
            <p className="text-xl font-semibold">{nbChars}</p>
          </div>
        </section>
      </section>
    </main>
  );
}
