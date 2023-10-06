"use client";
import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

export default function NavBar(props: { lng: string }) {
  const { t } = useTranslation(props.lng, "common");
  return (
    <div className="sticky top-0 z-50 flex items-center justify-center">
      <nav className="m-2 flex items-center space-x-2 rounded-full bg-white/80 px-4 py-2 shadow-md backdrop-blur-md dark:bg-slate-950/80">
        <Image alt="SynapsyLogo" height={25} width={25} src={"/logo.svg"} />
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
