"use client";
import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { Rocket, Settings, UserCircle2 } from "lucide-react";
import { useTheme } from "next-themes";

export default function NavBar(props: { lng: string }) {
  const { t } = useTranslation(props.lng, "common");
  const { setTheme } = useTheme();
  return (
    <nav className="fixed top-0 z-50 hidden w-full grid-cols-[auto,1fr,auto] bg-white/50 px-4 py-1 shadow-sm saturate-[1.1] backdrop-blur-md dark:bg-slate-900/30 sm:grid print:hidden">
      <div className="m-2 flex items-center">
        <Link className="mr-2 flex space-x-2" href={"/" + props.lng}>
          <Image alt="SynapsyLogo" height={25} width={25} src={"/logo.svg"} />
          <h2 className="text-lg font-normal">{t("title")}</h2>
        </Link>
        <Link href={"/" + props.lng + "/pricing"}>
          <Button variant="ghost">{t("pricing")}</Button>
        </Link>

        <Link href={"/" + props.lng + "/generations"}>
          <Button variant="ghost">{t("generations")}</Button>
        </Link>
      </div>
      <span></span>
      <div className="m-2 flex items-center">
        <Link href={"/" + props.lng + "/create"}>
          <Button className="group mx-2 h-auto space-x-2 overflow-hidden px-2 py-1">
            <Rocket
              className="group-hover:animate-rocket"
              height={14}
              width={14}
            />
            <p>{t("create")}</p>
          </Button>
        </Link>
        <Link href={"/" + props.lng + "/me"} className="group">
          <Button variant="ghost" size="icon">
            <UserCircle2 className="h-[1.2rem] w-[1.2rem] transition-all group-hover:scale-105" />
          </Button>
        </Link>
        <Link href={"/" + props.lng + "/settings"} className="group">
          <Button variant="ghost" size="icon">
            <Settings className="h-[1.2rem] w-[1.2rem] transition-all group-hover:rotate-90" />
          </Button>
        </Link>
      </div>
    </nav>
  );
}
