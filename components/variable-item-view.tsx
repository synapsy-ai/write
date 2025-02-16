"use client";
import { Variable } from "@/lib/variable";
import { Input } from "./ui/input";
import { useTranslation } from "@/app/i18n/client";
import { Button } from "./ui/button";
import { Delete, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function VariableItemView(props: {
  lng: string;
  item: Variable;
  index: number;
  functions: { setVar: Function };
}) {
  const { t } = useTranslation(props.lng, "common");
  useEffect(() => {
    setName(props.item.name);
    setValue(props.item.value);
  });
  const [name, setName] = useState<string>();
  const [value, setValue] = useState<string>();
  return (
    <div className="m-2 grid grid-cols-[1fr_auto] items-center space-x-2 rounded-md p-2">
      <div className="items-cente">
        <p>{t("name")}</p>
        <Input className="h-auto" disabled value={name} />
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
    </div>
  );
}
