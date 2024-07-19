"use client";
import { useTranslation } from "@/app/i18n/client";
import { GenerationItem } from "@/components/generation-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { typesToString } from "@/lib/formats";
import { groupAndSortHistoryItems, HistoryItem } from "@/lib/history";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Download,
  Eraser,
  List,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Creations({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const { t } = useTranslation(lng, "common");
  let histo: HistoryItem[] = [];
  if (typeof window !== "undefined") {
    histo = JSON.parse(localStorage.getItem("synapsy_write_history") ?? "[]");
  }
  const [query, setQuery] = useState("");
  const [ascend, setAscend] = useState(false);
  const [history, setHistory] = useState(
    groupAndSortHistoryItems(histo, ascend),
  );

  function Import(event: any) {
    let file = event.target.files[0]; // get the selected file
    let reader = new FileReader(); // create a FileReader object
    reader.onload = function (event) {
      let text: string = event.target?.result as string; // get the file content as text
      localStorage.setItem("synapsy_write_history", text);
      refresh();
    };
    reader.readAsText(file); // read the file as text
  }

  function refresh() {
    setHistory(
      groupAndSortHistoryItems(
        JSON.parse(localStorage.getItem("synapsy_write_history") ?? "[]"),
        ascend,
      ),
    );
  }
  return (
    <main className="pb-14 pt-0 sm:mb-2 sm:mt-16 sm:p-2 sm:pb-0 sm:pt-0">
      <header className="bg-white-25 fixed z-50 w-full p-2 shadow-sm backdrop-blur-md dark:bg-slate-900/25 sm:static sm:bg-transparent sm:p-0 sm:shadow-none sm:dark:bg-transparent">
        <section className="flex items-center space-x-2">
          <List />
          <span>
            <h2 className="text-2xl font-bold">{t("generations")}</h2>
            <p>{t("no-gen-text")}</p>
          </span>
        </section>
        <Input
          type="file"
          id="FileSelector"
          accept="application/json"
          className="hidden"
          onChange={Import}
        ></Input>
        <div className="flex space-x-2">
          <Link
            target="_blank"
            href={
              "data:text/plain;charset=UTF-8," +
              encodeURIComponent(
                typeof window !== "undefined"
                  ? JSON.stringify(history)
                  : "{msg: 'an error occurred'}",
              )
            }
            download={"generations.json"}
          >
            <Button variant="link" className="space-x-2 px-0">
              <Upload height={16} /> <p>{t("export")}</p>
            </Button>
          </Link>
          <Button
            variant="link"
            onClick={() =>
              (
                document.getElementById("FileSelector") as HTMLInputElement
              ).click()
            }
            className="space-x-2 px-0"
          >
            <Download height={16} /> <p>{t("import")}</p>
          </Button>
        </div>

        <Separator className="my-2" />
        <span className="flex justify-center space-x-2 sm:justify-start">
          <Input
            className="bg-transparent sm:max-w-[350px]"
            placeholder={t("search-history")}
            value={query}
            onChange={(v) => setQuery(v.target.value)}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  className="bg-transparent"
                  onClick={() => {
                    setAscend(!ascend);
                    setHistory(history.reverse());
                  }}
                  variant="outline"
                >
                  {ascend ? (
                    <ArrowDownNarrowWide size={14} />
                  ) : (
                    <ArrowUpNarrowWide size={14} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{ascend ? t("most-recent") : t("oldest")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
      </header>

      {!(history.length === 0) ? (
        <section className="flex flex-col justify-center p-5 pt-44 sm:pt-0 md:justify-start">
          {history.map((el, i) => {
            const filteredItems = el.items.filter((historyItem) =>
              historyItem.prompt.toLowerCase().includes(query.toLowerCase()),
            );

            return filteredItems.length > 0 ? (
              <div className="p-2" key={i}>
                <h3>{t(typesToString(el.template))}</h3>
                <div className="flex flex-wrap justify-center md:justify-start">
                  {el.items.map((historyItem, j) => (
                    <>
                      {historyItem.prompt
                        .toLowerCase()
                        .includes(query.toLowerCase()) ? (
                        <GenerationItem
                          refresh={refresh}
                          id={historyItem.index ?? 0}
                          key={j}
                          item={historyItem}
                          lng={lng}
                        />
                      ) : (
                        <></>
                      )}
                    </>
                  ))}
                </div>
              </div>
            ) : null;
          })}
        </section>
      ) : (
        <section className="flex min-h-[50vh] flex-col items-center justify-center pt-48 sm:pt-0">
          <Eraser height={48} width={48} />
          <p>{t("no-gen")}</p>
        </section>
      )}
    </main>
  );
}
