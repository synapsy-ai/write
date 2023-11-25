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
import formats from "@/lib/formats";
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
export default function FormatDialog(props: { lng: string; setVal: Function }) {
  const { t } = useTranslation(props.lng, "common");
  const [value, setValue] = useState("");

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="w-full" variant="outline">
          {t("format")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("select-format")}</DialogTitle>
          <DialogDescription>{t("format-desc")}</DialogDescription>
        </DialogHeader>
        <div>
          <Input
            value={value}
            onChange={(v) => setValue(v.target.value)}
            placeholder={t("search-formats")}
          />
          <ScrollArea className="h-[200px]">
            {formats.map((category, i) => (
              <div className="mt-2" key={i}>
                <p className="text-sm text-muted-foreground">
                  {t(category.category)}
                </p>
                <div className="flex flex-col">
                  {category.options.map((format, j) => (
                    <>
                      {t(format.text)
                        .toLowerCase()
                        .match(value.toLowerCase()) ? (
                        <DialogClose className="items-stretch">
                          <Button
                            className="w-full justify-start"
                            key={j}
                            onClick={() => props.setVal(format.val)}
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
              </div>
            ))}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
