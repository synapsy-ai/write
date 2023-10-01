"use client";
import Image from "next/image";
import { useTranslation } from "../i18n/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home({ params: { lng } }: { params: { lng: any } }) {
  const { t } = useTranslation(lng, "common");

  return (
    <main>
      <section className="flex flex-col min-h-screen justify-center items-center p-4 text-center">
        <Image
          alt="The logo of RativeGen Write"
          src="logo.svg"
          width={256}
          height={256}
        />
        <h2 className="font-bold text-3xl mt-8">
          {t("introducing-rativegen")}
        </h2>
        <p>{t("introducing-rativegen-text")}</p>
        <Link href={lng + "/create"}>
          <Button className="m-2">{t("launch")}</Button>
        </Link>
      </section>
    </main>
  );
}
