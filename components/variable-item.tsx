"use client";
import { Variable } from "@/lib/variable";
import { Input } from "./ui/input";
import { useTranslation } from "@/app/i18n/client";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function VariableItem(props: {
  lng: string;
  item: Variable;
  index: number;
  functions: { setVar: Function; removeVar: Function };
  small?: boolean;
}) {
  const { t } = useTranslation(props.lng, "common");
  const [name, setName] = useState<string>();
  const [value, setValue] = useState<string>();
  useEffect(() => {
    setName(props.item.name);
    setValue(props.item.value);
  }, [props.item, setName, setValue]);
  return (
    <div className="m-2 grid grid-cols-[1fr_auto] items-center space-x-2 rounded-md border border-slate-200 p-2 dark:border-slate-800">
      <div
        className={
          props.small
            ? "items-center space-y-2"
            : "items-center sm:flex sm:space-x-2"
        }
      >
        <p>{t("name")}</p>
        <Input
          className="h-auto"
          value={name}
          onChange={(v) => {
            const newName = v.target.value;
            setName(newName);
            props.functions.setVar(props.index, {
              name: newName,
              value: value,
            });
          }}
        />
        <p>{t("value")}</p>
        <Input
          className="h-auto"
          value={value}
          onChange={(v) => {
            const newValue = v.target.value;
            setValue(newValue);
            props.functions.setVar(props.index, {
              name: name,
              value: newValue,
            });
          }}
        />
      </div>
      <Button
        onClick={() => {
          props.functions.removeVar(props.index);
        }}
        className="border-0"
        variant="outline"
      >
        <Trash2 height={16} />
      </Button>
    </div>
  );
}
