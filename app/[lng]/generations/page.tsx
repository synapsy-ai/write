"use client";
import { useTranslation } from "@/app/i18n/client";
import { GenerationItem } from "@/components/generation-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HistoryItem } from "@/lib/history";
import { Download, Eraser, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Creations({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const { t } = useTranslation(lng, "common");

  let history: HistoryItem[] = [];
  if (typeof window !== "undefined") {
    history = JSON.parse(localStorage.getItem("synapsy_write_history") ?? "[]");
  }

  const [noItems, setNoItems] = useState(history.length == 0);
  function Import(event: any) {
    let file = event.target.files[0]; // get the selected file
    let reader = new FileReader(); // create a FileReader object
    reader.onload = function (event) {
      let text: string = event.target?.result as string; // get the file content as text
      localStorage.setItem("synapsy_write_history", text);
    };
    reader.readAsText(file); // read the file as text
  }
  return (
    <main className="m-2 mt-16">
      <header>
        <h2 className="text-2xl font-bold">{t("generations")}</h2>
        <p>{t("no-gen-text")}</p>
        <Input
          type="file"
          id="FileSelector"
          accept="application/json"
          className="hidden"
          onChange={Import}
        ></Input>
        <div className="flex">
          <Link
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
            <Button variant="link" className="space-x-2">
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
            className="space-x-2"
          >
            <Download height={16} /> <p>{t("import")}</p>
          </Button>
        </div>
      </header>
      {!noItems ? (
        <section className="flex flex-wrap justify-center p-5 md:justify-start">
          {history.map((el, i) => (
            <GenerationItem id={i} key={i} item={el} lng={lng} />
          ))}
        </section>
      ) : (
        <section className="flex min-h-[50vh] flex-col items-center justify-center">
          <Eraser height={48} width={48} />
          <p>{t("no-gen")}</p>
        </section>
      )}
    </main>
  );
}
