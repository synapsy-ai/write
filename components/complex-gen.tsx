"use client";
import { useTranslation } from "@/app/i18n/client";
import GenerationStep from "@/lib/generation-step";
import { Check, Loader2, PencilLineIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface ComplexGenItemProps {
  lng: string;
  steps: GenerationStep[];
}

export default function ComplexGenItem(props: ComplexGenItemProps) {
  const { t } = useTranslation(props.lng, "common");
  const [steps, setSteps] = useState(props.steps);

  useEffect(() => {
    setSteps(props.steps);
  }, [props.steps]);

  return (
    <section className="m-2 flex flex-col items-center rounded-md border border-green-700 bg-green-100 p-2 text-green-700 dark:border-green-500 dark:bg-green-900/70 dark:text-green-500 sm:block">
      <div>
        <p className="flex flex-col items-center font-bold sm:flex-row sm:space-x-1 sm:space-y-0">
          <PencilLineIcon size={16} className="hidden sm:block" />
          <PencilLineIcon className="sm:hidden" />
          <span>{t("complex-gen")}</span>
        </p>
        <p className="text-center sm:text-left">{t("complex-gen-desc")}</p>
      </div>
      <div className="grid grid-cols-[auto,1fr] items-center gap-x-2">
        {steps &&
          steps.map((s, i) => (
            <>
              {s.done ? (
                <Check key={i} size={16} />
              ) : (
                <Loader2 key={i} size={16} className="animate-spin" />
              )}
              <p key={i}>{t(s.i18nname)}</p>
            </>
          ))}
      </div>
    </section>
  );
}
