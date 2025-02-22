"use client";
import { useTranslation } from "@/app/i18n/client";
import { Check } from "lucide-react";

interface Props {
  lng: string;
  productName: string;
}
export default function PricingFeatures(props: Props) {
  const { t } = useTranslation(props.lng, "common");
  if (!props.productName.toLowerCase().includes("synapsy write")) {
    return <></>;
  }
  if (props.productName.toLowerCase().includes("premium")) {
    return (
      <div className="mt-8 grid grid-cols-[auto_1fr] items-center gap-x-2 dark:text-slate-300">
        <Check size={16} />
        <p>
          {t("feature-ai")} (20/{t("month")})
        </p>
        <Check size={16} />
        <p>{t("advanced-instructions")}</p>
        <Check size={16} />
        <p>{t("table-generator")}</p>
        <Check size={16} />
        <p>{t("essays")}</p>
        <Check size={16} />
        <p>{t("text-analysis")}</p>
        <Check size={16} />
        <p>{t("variable-editor")}</p>
        <span className="h-[24px]"></span>
      </div>
    );
  }

  if (props.productName.toLowerCase().includes("pro")) {
    return (
      <div className="mt-8 grid grid-cols-[auto_1fr] items-center gap-x-2 dark:text-slate-300">
        <Check size={16} />
        <p>
          {t("feature-ai")} ({t("unlimited")})
        </p>
        <Check size={16} />
        <p>{t("unlimited-access")}</p>
        <Check size={16} />
        <p>{t("advanced-instructions")}</p>
        <Check size={16} />
        <p>{t("table-generator")}</p>
        <Check size={16} />
        <p>{t("essays")}</p>
        <Check size={16} />
        <p>{t("text-analysis")}</p>
        <Check size={16} />
        <p>{t("variable-editor")}</p>
        {props.lng === "fr" && <span className="h-[24px]"></span>}
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-[auto_1fr] items-center gap-x-2 dark:text-slate-300">
      <Check size={16} />
      <p>
        {t("feature-ai")} (10/{t("month")})
      </p>
      <Check size={16} />
      <p>{t("advanced-instructions")}</p>
      <Check size={16} />
      <p>{t("table-generator")}</p>
      <Check size={16} />
      <p>{t("essays")}</p>
      <Check size={16} />
      <p>{t("text-analysis")}</p>
      <Check size={16} />
      <p>{t("variable-editor")}</p>
      <span className="h-[24px]"></span>
    </div>
  );
}
