"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslation } from "@/app/i18n/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import formats, { Format } from "@/lib/formats";
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  Book,
  BookOpen,
  BrainCircuit,
  CalendarRangeIcon,
  MessageCircle,
  Pen,
  Presentation,
} from "lucide-react";
export default function FormatDialog(props: {
  lng: string;
  setVal: Function;
  setCategory: Function;
}) {
  const { t } = useTranslation(props.lng, "common");
  const [value, setValue] = useState("");
  const colors = [
    "border-blue-400 dark:border-blue-700 dark:hover:border-blue-600 hover:bg-blue-100 hover:border-blue-500 dark:hover:bg-blue-950/60",
    "border-sky-400 dark:border-sky-700 dark:hover:border-sky-600 hover:bg-sky-100 hover:border-sky-500 dark:hover:bg-sky-950/50",
    "border-cyan-400 dark:border-cyan-700 dark:hover:border-cyan-600 hover:bg-cyan-100 hover:border-cyan-500 dark:hover:bg-cyan-950/60",
    "border-lime-400 dark:border-lime-700 dark:hover:border-lime-600 hover:bg-lime-100 hover:border-lime-500 dark:hover:bg-lime-950/60",
    "border-violet-400 dark:border-violet-700 dark:hover:border-violet-600 hover:bg-violet-100 hover:border-violet-500 dark:hover:bg-violet-950/60",
    "border-pink-400 dark:border-pink-700 dark:hover:border-pink-600 hover:bg-pink-100 hover:border-pink-500 dark:hover:bg-pink-950/60",
    "border-orange-400 dark:border-orange-700 dark:hover:border-orange-600 hover:bg-orange-100 hover:border-orange-500 dark:hover:bg-orange-950/60",
  ];

  const icons = [
    <Pen key="pen" />,
    <Book key="book" />,
    <BookOpen key="bookopen" />,
    <MessageCircle key="msg" />,
    <BrainCircuit key="brain" />,
    <Presentation key="pres" />,
    <CalendarRangeIcon key="calendar" />,
  ];

  const [selectedFormat, setSelectedFormat] = useState<Format | undefined>();

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          onClick={() => setSelectedFormat(undefined)}
          className="w-full"
          variant="outline"
        >
          {t("format")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("select-format")}</DialogTitle>
          <DialogDescription>{t("format-desc")}</DialogDescription>
        </DialogHeader>
        {selectedFormat && (
          <div>
            <Button
              variant="link"
              onClick={() => setSelectedFormat(undefined)}
              className="m-0 -mt-4 flex h-auto space-x-2 p-2"
            >
              <ArrowLeft size={14} />
              <p>{t("go-back")}</p>
            </Button>
            <Input
              value={value}
              onChange={(v) => setValue(v.target.value)}
              placeholder={t("search-formats")}
            />
            <ScrollArea className="h-[200px]">
              <div className="flex flex-col">
                {selectedFormat.options.map((format, j) => (
                  <>
                    {t(format.text).toLowerCase().match(value.toLowerCase()) ? (
                      <DialogClose className="items-stretch" tabIndex={-1}>
                        <Button
                          className="w-full justify-start"
                          key={j}
                          onClick={() => {
                            props.setVal(format.val),
                              props.setCategory(selectedFormat.category);
                          }}
                          variant="ghost"
                        >
                          {t(format.text)}
                        </Button>
                      </DialogClose>
                    ) : (
                      <></>
                    )}
                  </>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
        {!selectedFormat && (
          <ScrollArea className="h-[240px]">
            <div className="flex flex-col gap-2">
              {formats.map((category, i) => (
                <Button
                  key={i}
                  onClick={() => setSelectedFormat(category)}
                  variant="ghost"
                  className={`flex flex-row space-x-2 p-8 ${colors[category.colorId]}`}
                >
                  {icons[i]}
                  <p>{t(category.category)}</p>
                </Button>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
