"use client";
import { useTranslation } from "../i18n/client";

export default function Home({ params: { lng } }: { params: { lng: any } }) {
  const { t } = useTranslation(lng, "common");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>{t("title")}</p>
    </main>
  );
}
