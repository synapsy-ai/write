"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import formats from "@/lib/formats";
import { useTranslation } from "@/app/i18n/client";

export function FormatSelector(props: { lng: string; setVal: Function }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const { t } = useTranslation(props.lng, "common");

  let vals: [{ val: string; text: string }?] = [];
  formats.forEach((el) => {
    el.options.forEach((opt) => {
      vals.push({
        val: t(opt.text).toLowerCase() + opt.val,
        text: t(opt.text),
      });
    });
  });
  console.log(vals);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between sm:w-[200px]"
        >
          {value
            ? vals.find((v) => v !== undefined && v.val === value)?.text
            : t("search-formats")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 sm:w-[200px]">
        <Command>
          <CommandInput placeholder={t("search-formats")} />
          <CommandEmpty>{t("no-formats")}</CommandEmpty>
          <CommandList>
            {formats.map((cat) => (
              <CommandGroup heading={t(cat.category)}>
                {cat.options.map((f) => (
                  <CommandItem
                    key={f.val}
                    value={t(f.text).toLowerCase() + f.val}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      props.setVal(f.val);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === t(f.text).toLowerCase() + f.val
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {t(f.text)}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
