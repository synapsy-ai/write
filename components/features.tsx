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
  return (
    <div className="mt-8 grid grid-cols-[auto,1fr] items-center gap-x-2  dark:text-slate-300">
      <Check size={16} />
      <p>{t("feature-ai")}</p>
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
    </div>
  );
}
