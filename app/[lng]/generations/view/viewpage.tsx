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
import { Settings } from "@/lib/settings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type } from "os";

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

  let s: Settings = { key: "" };
  s = JSON.parse(localStorage.getItem("synapsy_settings") ?? "{}");

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
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-slate-100/40 p-4 pb-16 dark:bg-transparent sm:mt-16 sm:pb-0 md:gap-8 md:p-10 print:mt-0 print:bg-white">
      <header className="mx-auto grid w-full max-w-6xl gap-2 print:hidden">
        <h1 className="text-3xl font-semibold">{t("generation")}</h1>
        <div className="mt-2 flex justify-center sm:justify-start print:hidden">
          <Button
            className="group mr-3 flex space-x-2 font-bold"
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
            variant="link"
            className="flex space-x-2"
            onClick={() =>
              navigator.clipboard.writeText(
                document.getElementById("contentp")?.innerText ?? "",
              )
            }
          >
            <span>
              <Copy size={16} />
            </span>
            <span>{t("copy")}</span>
          </Button>
          {el.template !== "ideas" && el.template !== "ph_visual_outline" && (
            <Link href={`/${params.lng}/generations/edit?id=${id}`}>
              <Button className="flex space-x-2" variant="link">
                <span>
                  <Edit size={16} />
                </span>
                <span>{t("edit")}</span>
              </Button>
            </Link>
          )}
        </div>
      </header>
      <section className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_350px]">
        <div
          className="max-w-[800px] rounded-md border bg-white pb-4 text-justify shadow-sm dark:bg-slate-900 dark:bg-slate-900/50 print:border-0 print:text-black print:shadow-none"
          id="ct"
        >
          <ResultDisplayer
            is_generating={false}
            res={content}
            type={el.template}
            font={s.gen_font ?? "default"}
          />
        </div>

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
          <Card>
            <CardHeader>
              <CardTitle>{t("information")}</CardTitle>
            </CardHeader>
            <CardContent>
              <section className="flex w-full flex-col items-center justify-center gap-2 px-2 pb-5 md:p-0">
                <div className="w-full">
                  <h2 className="text-sm font-normal text-slate-400 dark:text-slate-500">
                    {t("price")}
                  </h2>
                  <p id="price" className="text-xl font-semibold">
                    {price}
                  </p>
                </div>
                <div className="hover:bg-whit w-full">
                  <h2 className="text-sm font-normal text-slate-400 dark:text-slate-500">
                    {t("tokens")}
                  </h2>
                  <p id="price" className="text-xl font-semibold">
                    {nbTokens}
                  </p>
                </div>
                <div className="hover:bg-whit w-full">
                  <h2 className="text-sm font-normal text-slate-400 dark:text-slate-500">
                    {t("words")}
                  </h2>
                  <p className="text-xl font-semibold">{nbWords}</p>
                </div>
                <div className="hover:bg-whit w-full">
                  <h2 className="text-sm font-normal text-slate-400 dark:text-slate-500">
                    {t("characters")}
                  </h2>
                  <p className="text-xl font-semibold">{nbChars}</p>
                </div>
              </section>
            </CardContent>
          </Card>

          {el.template !== "ideas" &&
          el.template !== "ph_visual_outline" &&
          variables &&
          variables.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("variables")} ({variables.length})
                </CardTitle>
                <CardDescription>{t("variables-desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-2 w-full max-w-[800px] rounded-md border pb-4 text-justify dark:bg-slate-900/50 print:hidden">
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
                </div>
              </CardContent>
            </Card>
          ) : (
            <></>
          )}
        </div>
      </section>
    </main>
  );
}
