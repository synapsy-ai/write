"use client";
import { useTranslation } from "@/app/i18n/client";
import { GenerationItem } from "@/components/generation-item";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { typesToString } from "@/lib/formats";
import { groupAndSortHistoryItems, HistoryItem } from "@/lib/history";
import { DefaultLanguageParams } from "@/lib/languages";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Download,
  Eraser,
  Filter,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";

export default function GenerationsPage({
  params,
}: {
  params: DefaultLanguageParams;
}) {
  const { lng } = use(params);
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
  const formats = Array.from(new Set(histo.map((e) => e.template)));
  const [selectedFormats, setSelectedFormats] = useState([...formats]);

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
    <main className="flex min-h-[calc(100vh-(--spacing(16)))] flex-1 flex-col gap-4 bg-slate-100/40 p-4 pb-16 dark:bg-transparent sm:pb-0 md:gap-8 md:p-10 print:mt-0 print:bg-white">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mx-auto grid w-full gap-2 print:hidden">
          <h1 className="z-60 text-3xl font-semibold">{t("generations")}</h1>
        </div>
        <header className="bg-white-25 sticky top-0 z-50 w-full p-2 shadow-xs backdrop-blur-md dark:bg-slate-900/25 sm:static sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none sm:dark:bg-transparent">
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
            <Dialog>
              <DialogTrigger>
                <Button variant="outline">
                  <Filter size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("filter")}</DialogTitle>
                  <DialogDescription>{t("filter-desc")}</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[200px]">
                  {formats.map((format, i) => (
                    <div className="flex items-center space-x-2 py-2" key={i}>
                      <Checkbox
                        onCheckedChange={() => {
                          if (selectedFormats.includes(format)) {
                            setSelectedFormats(
                              selectedFormats.filter((item) => item != format),
                            );
                          } else {
                            setSelectedFormats([...selectedFormats, format]);
                          }
                        }}
                        checked={selectedFormats.includes(format)}
                        id={format}
                      />
                      <label htmlFor={format}>{t(typesToString(format))}</label>
                    </div>
                  ))}
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </span>
        </header>
        {!(history.length === 0) ? (
          <section className="flex flex-col justify-center p-5 pt-0 sm:px-0 md:justify-start">
            {history.map((el, i) => {
              const filteredItems = el.items.filter((historyItem) =>
                historyItem.prompt.toLowerCase().includes(query.toLowerCase()),
              );
              return filteredItems.length > 0 &&
                selectedFormats.includes(el.template) ? (
                <div className="p-2" key={i}>
                  <span className="flex items-center space-x-2">
                    <h3>{t(typesToString(el.template))}</h3>
                    <p className="rounded-full border bg-slate-100 px-2 text-sm dark:bg-slate-900">
                      {filteredItems.length}
                    </p>
                  </span>
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
      </div>
    </main>
  );
}
