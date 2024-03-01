import { useTranslation } from "@/app/i18n";
import formats from "@/lib/formats";
import { Check } from "lucide-react";
import React from "react";

export default async function PricingFeatureTable(props: { lng: string }) {
  const { t } = await useTranslation(props.lng, "common");

  return (
    <table className="features mx-auto max-w-6xl text-slate-700 dark:text-slate-400">
      <tbody>
        <tr>
          <td className="text-lg font-bold text-black dark:text-white">
            {t("features")}
          </td>
          <td className="text-lg font-bold text-black dark:text-white">
            Premium
          </td>
        </tr>
        <tr>
          <td className="font-bold text-slate-900 dark:text-slate-300">
            {t("variables")}
          </td>
          <td></td>
        </tr>
        <tr>
          <td>{t("variable-editor")}</td>
          <td>
            <span className="flex justify-center">
              <Check size={16} />
            </span>
          </td>
        </tr>
        <tr>
          <td>{t("dynamic-gens")}</td>
          <td>
            <span className="flex justify-center">
              <Check size={16} />
            </span>
          </td>
        </tr>
        <tr>
          <td className="font-bold text-slate-900 dark:text-slate-300">
            {t("gens")}
          </td>
          <td></td>
        </tr>
        <tr>
          <td>{t("history")}</td>
          <td>
            <span className="flex justify-center">
              <Check size={16} />
            </span>
          </td>
        </tr>
        <tr>
          <td>{t("gen-editor")}</td>
          <td>
            <span className="flex justify-center">
              <Check size={16} />
            </span>
          </td>
        </tr>
        <tr>
          <td>{t("export-gens")}</td>
          <td>
            <span className="flex justify-center">
              <Check size={16} />
            </span>
          </td>
        </tr>
        <tr>
          <td>{t("import-gens")}</td>
          <td>
            <span className="flex justify-center">
              <Check size={16} />
            </span>
          </td>
        </tr>
        <tr>
          <td>{t("print-generations")}</td>
          <td>
            <span className="flex justify-center">
              <Check size={16} />
            </span>
          </td>
        </tr>
        <tr>
          <td className="font-bold text-slate-900 dark:text-slate-300">
            {t("models")}
          </td>
          <td></td>
        </tr>
        <tr>
          <td>OpenAI GPT-4</td>
          <td>
            <span className="flex justify-center">
              <Check size={16} />
            </span>
          </td>
        </tr>
        <tr>
          <td>OpenAI GPT-3.5</td>
          <td>
            <span className="flex justify-center">
              <Check size={16} />
            </span>
          </td>
        </tr>

        <tr>
          <td className="text-lg font-bold text-black dark:text-white">
            {t("formats")}
          </td>
          <td></td>
        </tr>
        {formats.map((category) => (
          <React.Fragment key={category.category}>
            <tr>
              <td className="font-bold text-slate-900 dark:text-slate-300">
                {t(category.category)}
              </td>
              <td></td>
            </tr>
            {category.options.map((option) => (
              <tr key={option.val}>
                <td>{t(option.text)}</td>
                <td>
                  <span className="flex justify-center">
                    <Check size={16} />
                  </span>
                </td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}
