"use client";
import Image from "next/image";
import { useTranslation } from "../i18n/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home({ params: { lng } }: { params: { lng: any } }) {
  const { t } = useTranslation(lng, "common");

  return (
    <main>
      <section className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <Image
          alt="The logo of Synapsy Write"
          src="logo.svg"
          width={256}
          height={256}
        />
        <h2 className="mt-8 text-3xl font-bold">{t("introducing-synapsy")}</h2>
        <p>{t("introducing-synapsy-text")}</p>
        <Link href={lng + "/create"}>
          <Button className="m-2">{t("launch")}</Button>
        </Link>
      </section>
    </main>
  );
}
