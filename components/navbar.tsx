"use client";
import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { Settings } from "lucide-react";
import { useTheme } from "next-themes";

export default function NavBar(props: { lng: string }) {
  const { t } = useTranslation(props.lng, "common");
  const { setTheme } = useTheme();
  return (
    <div className="fixed top-0 z-50 flex w-full items-center justify-center print:hidden">
      <nav className="m-2 flex items-center rounded-full bg-white/50 px-4 py-2 shadow-md backdrop-blur-md dark:bg-slate-900/50">
        <Link className="mr-2 flex space-x-2" href={"/" + props.lng}>
          <Image alt="SynapsyLogo" height={25} width={25} src={"/logo.svg"} />
          <h2 className="font-bold">{t("title")}</h2>
        </Link>
        <Link href={"/" + props.lng + "/create"}>
          <Button variant="ghost">{t("create")}</Button>
        </Link>
        <Link href={"/" + props.lng + "/generations"}>
          <Button variant="ghost">{t("generations")}</Button>
        </Link>
        <Link href={"/" + props.lng + "/settings"} className="group">
          <Button variant="ghost" size="icon">
            <Settings className="h-[1.2rem] w-[1.2rem] transition-all group-hover:rotate-90" />
          </Button>
        </Link>
      </nav>
    </div>
  );
}
