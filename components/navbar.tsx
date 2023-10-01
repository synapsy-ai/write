"use client";
import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

export default function NavBar(props: { lng: string }) {
  const { t } = useTranslation(props.lng, "common");
  return (
    <div className="flex items-center justify-center sticky top-0">
      <nav className="flex items-center space-x-2 dark:bg-slate-950/80 bg-white/80 backdrop-blur-lg shadow-md px-4 py-2 m-2 rounded-full">
        <Image alt="RativeGenLogo" height={25} width={25} src={"/logo.svg"} />
        <h2 className="font-bold">{t("title")}</h2>
        <Link href={"/" + props.lng}>
          <Button variant="ghost">{t("home")}</Button>
        </Link>
        <Link href={"/" + props.lng + "/generations"}>
          <Button variant="ghost">{t("generations")}</Button>
        </Link>
      </nav>
    </div>
  );
}
