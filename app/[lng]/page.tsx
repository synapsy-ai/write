"use client";
import Image from "next/image";
import { useTranslation } from "../i18n/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BrainCircuit,
  Building,
  Github,
  MousePointerClick,
  PenSquare,
  Rocket,
} from "lucide-react";
import Footer from "@/components/footer";
import { useTheme } from "next-themes";
import { useRef } from "react";

export default function Home({ params: { lng } }: { params: { lng: any } }) {
  const { t } = useTranslation(lng, "common");
  const sectionRef = useRef<HTMLElement | null>(null);
  const handleClick = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      <main>
        <section className="bg-mesh flex min-h-screen flex-col items-center justify-center rounded-lg p-4 text-center">
          <div className="rounded-2xl border bg-white/50 p-12 shadow-lg backdrop-blur-md transition hover:border-slate-400 hover:bg-white/70 hover:shadow-xl dark:bg-slate-800/20 dark:shadow-violet-500/20 dark:hover:border-slate-500 dark:hover:bg-slate-400/20">
            <Image
              height={96}
              width={96}
              alt="Synapsy Logo"
              src={
                useTheme().theme === "light" ? "logolight.svg" : "logodark.svg"
              }
            />
          </div>
          <h2 className="mt-8 text-3xl font-bold">
            {t("introducing-synapsy")}
          </h2>
          <p>{t("introducing-synapsy-text")}</p>
          <div className="flex items-center">
            <Link href={lng + "/create"}>
              <Button className="group m-2 space-x-1 overflow-hidden font-bold">
                <Rocket
                  className="group-hover:animate-rocket"
                  height={16}
                  width={16}
                />
                <p>{t("launch")}</p>
              </Button>
            </Link>
            <Button onClick={handleClick} variant="link">
              {t("learn-more")}
            </Button>
          </div>
        </section>
        <section
          id="features"
          ref={sectionRef}
          className="flex min-h-[50vh] flex-col justify-center"
        >
          <h2 className="text-center text-3xl font-bold">{t("features")}</h2>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            <div className="flex h-[200px] flex-col justify-center rounded-xl border border-slate-200 p-4 shadow-md dark:border-slate-700 sm:col-span-2">
              <BrainCircuit height={24} className="mb-2" />
              <h3 className="text-xl font-bold">{t("feature-ai")}</h3>
              <p>{t("feature-ai-desc")}</p>
            </div>
            <div className="flex h-[200px] flex-col justify-center rounded-xl border border-slate-200 p-4 shadow-md dark:border-slate-700">
              <PenSquare height={24} className="mb-2" />
              <h3 className="text-xl font-bold">{t("feature-versatile")}</h3>
              <p>{t("feature-versatile-desc")}</p>
            </div>
            <div className="flex min-h-[200px] flex-col justify-center rounded-xl border border-slate-200 p-4 shadow-md dark:border-slate-700">
              <MousePointerClick height={24} className="mb-2" />
              <h3 className="text-xl font-bold">{t("feature-easy")}</h3>
              <p>{t("feature-easy-desc")}</p>
            </div>
          </div>
        </section>
        <section className="grid min-h-[50vh] grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col justify-center p-4">
            <h2 className="text-center text-3xl font-bold">
              {t("open-source")}
            </h2>
            <p>{t("open-source-desc")}</p>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Link
              href={"https://github.com/synapsy-ai/write/"}
              className="flex h-[200px] w-[200px] items-center justify-center rounded-md border border-slate-200 p-4 shadow-md transition hover:-translate-y-2 hover:shadow-lg dark:border-slate-700"
            >
              <Github />
              <p>/write</p>
            </Link>
            <Link
              href={"https://github.com/synapsy-ai/"}
              className="flex h-[200px] w-[200px] items-center justify-center rounded-md border border-slate-200 p-4 shadow-md transition hover:-translate-y-2 hover:shadow-lg dark:border-slate-700"
            >
              <Building />
              <p>@synapsy-ai</p>
            </Link>
          </div>
        </section>
      </main>
      <Footer params={{ lng: lng }} />
    </>
  );
}
