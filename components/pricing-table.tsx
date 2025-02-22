"use client";
import { useTranslation } from "@/app/i18n/client";
import formats from "@/lib/formats";
import { Check, X } from "lucide-react";
import React from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export default function PricingFeatureTable(props: { lng: string }) {
  const { t } = useTranslation(props.lng, "common");

  return (
    <ScrollArea className="mb-2 w-screen max-w-6xl sm:mx-auto">
      <table className="features text-slate-700 dark:text-slate-400">
        <tbody>
          <tr>
            <td className="text-lg font-bold text-black dark:text-white">
              {t("features")}
            </td>
            <td className="text-lg font-bold text-black dark:text-white">
              Free
            </td>
            <td className="text-lg font-bold text-black dark:text-white">
              Basic
            </td>
            <td className="text-lg font-bold text-black dark:text-white">
              Premium
            </td>
            <td className="text-lg font-bold text-black dark:text-white">
              Pro
            </td>
          </tr>
          <tr>
            <td className="font-bold text-slate-900 dark:text-slate-300">
              {t("variables")}
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>{t("variable-editor")}</td>
            <td>
              <span className="flex justify-center">
                <X size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
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
                <X size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
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
            <td></td> <td></td>
            <td></td> <td></td>
          </tr>
          <tr>
            <td>{t("history")}</td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
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
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
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
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
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
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
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
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
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
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>OpenAI GPT-4 + GPT-4o + o1</td>
            <td>
              <span className="flex justify-center">
                <X size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">10/{t("month")}</span>
            </td>
            <td>
              <span className="flex justify-center">20/{t("month")}</span>
            </td>
            <td>
              <span className="flex justify-center">{t("unlimited")}</span>
            </td>
          </tr>
          <tr>
            <td>OpenAI GPT-4o Mini</td>
            <td>
              <span className="flex justify-center">
                <X size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">{t("unlimited")}</span>
            </td>
            <td>
              <span className="flex justify-center">{t("unlimited")}</span>
            </td>
            <td>
              <span className="flex justify-center">{t("unlimited")}</span>
            </td>
          </tr>
          <tr>
            <td>OpenAI GPT-3.5</td>
            <td>
              <span className="flex justify-center">
                <X size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
          </tr>
          <tr>
            <td>Mistral AI</td>
            <td>
              <span className="flex justify-center">
                <X size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
          </tr>

          <tr>
            <td>Claude 3.5 Haiku</td>
            <td>
              <span className="flex justify-center">
                <X size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">{t("unlimited")}</span>
            </td>
            <td>
              <span className="flex justify-center">{t("unlimited")}</span>
            </td>
            <td>
              <span className="flex justify-center">{t("unlimited")}</span>
            </td>
          </tr>
          <tr>
            <td>Claude 3.5 Sonnet</td>
            <td>
              <span className="flex justify-center">
                <X size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <span className="flex justify-center">
                  <X size={16} />
                </span>
              </span>
            </td>
            <td>
              <span className="flex justify-center">{t("unlimited")}</span>
            </td>
            <td>
              <span className="flex justify-center">{t("unlimited")}</span>
            </td>
          </tr>
          <tr>
            <td>Claude 3 Opus</td>
            <td>
              <span className="flex justify-center">
                <X size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <span className="flex justify-center">
                  <X size={16} />
                </span>
              </span>
            </td>
            <td>
              <span className="flex justify-center">{t("unlimited")}</span>
            </td>
            <td>
              <span className="flex justify-center">{t("unlimited")}</span>
            </td>
          </tr>
          <tr>
            <td className="font-bold text-slate-900 dark:text-slate-300">
              {t("chat")}
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>{t("synapsy-assistant")}</td>
            <td>
              <span className="flex justify-center">
                <X size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
          </tr>
          <tr>
            <td>{t("conv-management")}</td>
            <td>
              <span className="flex justify-center">
                <X size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
            <td>
              <span className="flex justify-center">
                <Check size={16} />
              </span>
            </td>
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
            <td></td> <td></td>
            <td></td>
            <td></td>
          </tr>
          {formats.map((category) => (
            <React.Fragment key={category.category}>
              <tr>
                <td className="font-bold text-slate-900 dark:text-slate-300">
                  {t(category.category)}
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              {category.options.map((option) => (
                <tr key={option.val}>
                  <td>{t(option.text)}</td>
                  <td>
                    <span className="flex justify-center">
                      <X size={16} />
                    </span>
                  </td>
                  <td>
                    <span className="flex justify-center">
                      <Check size={16} />
                    </span>
                  </td>
                  <td>
                    <span className="flex justify-center">
                      <Check size={16} />
                    </span>
                  </td>
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
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
