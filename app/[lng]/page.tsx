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
  PencilRulerIcon,
  Rocket,
  Table,
  Variable,
} from "lucide-react";
import Footer from "@/components/footer";
import { useTheme } from "next-themes";
import { useRef } from "react";
import Spotlight, { SpotlightCard } from "@/components/spotlight";

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
          <h2 className="mt-8 bg-gradient-to-br from-slate-500 to-slate-800 bg-clip-text text-4xl text-transparent dark:from-slate-100 dark:to-slate-400 sm:text-7xl">
            {t("introducing-synapsy")}
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            {t("introducing-synapsy-text")}
          </p>

          <div className="my-2 flex items-center">
            <Link href={lng + "/create"}>
              <Button className="group m-2 space-x-1 overflow-hidden font-bold transition ease-in-out hover:scale-105">
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

          <div className="m-5 inline-block animate-border rounded-[10px] bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:_400%_400%] p-[1px] shadow-xl [animation-duration:_3s;]">
            <picture>
              <source
                media="(prefers-color-scheme: dark)"
                srcSet="/images/app-dark.png"
              />
              <source
                media="(prefers-color-scheme: light)"
                srcSet="/images/app.png"
              />
              <img
                className="max-h-[600px] rounded-[9px]"
                alt="A isometric image representing all apps made by Léo Corporation."
                src="/images/app.png"
              />
            </picture>
          </div>
        </section>
        <section
          id="features"
          ref={sectionRef}
          className="flex min-h-[50vh] flex-col items-center justify-center"
        >
          <h2 className="mt-8 text-center text-4xl font-normal sm:text-5xl">
            {t("features")}
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            {t("features-desc")}
          </p>
          <Link href={`/${lng}/pricing`}>
            <Button variant="link">{t("pricing")}</Button>
          </Link>
          <Spotlight className="grid max-w-6xl grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            <SpotlightCard className="flex h-[200px] flex-col justify-center border border-slate-200 shadow-md dark:border-slate-700">
              <div className="p-4">
                <BrainCircuit height={24} className="mb-2" />
                <h3 className="text-xl font-bold">{t("feature-ai")}</h3>
                <p>{t("feature-ai-desc")}</p>
              </div>
            </SpotlightCard>
            <SpotlightCard className="flex h-[200px] flex-col justify-center border border-slate-200 shadow-md dark:border-slate-700">
              <div className="p-4">
                <PenSquare height={24} className="mb-2" />
                <h3 className="text-xl font-bold">{t("feature-versatile")}</h3>
                <p>{t("feature-versatile-desc")}</p>
              </div>
            </SpotlightCard>
            <SpotlightCard className="flex min-h-[200px] flex-col justify-center border border-slate-200 shadow-md dark:border-slate-700">
              <div className="p-4">
                <MousePointerClick height={24} className="mb-2" />
                <h3 className="text-xl font-bold">{t("feature-easy")}</h3>
                <p>{t("feature-easy-desc")}</p>
              </div>
            </SpotlightCard>
            <SpotlightCard className="flex min-h-[200px] flex-col justify-center border border-slate-200 shadow-md dark:border-slate-700">
              <div className="p-4">
                <Table height={24} className="mb-2" />
                <h3 className="text-xl font-bold">{t("tables")}</h3>
                <p>{t("tables-desc")}</p>
              </div>
            </SpotlightCard>
            <SpotlightCard className="flex min-h-[200px] flex-col justify-center border border-slate-200 shadow-md dark:border-slate-700">
              <div className="p-4">
                <PencilRulerIcon height={24} className="mb-2" />
                <h3 className="text-xl font-bold">{t("essays")}</h3>
                <p>{t("essays-desc")}</p>
              </div>
            </SpotlightCard>
            <SpotlightCard className="flex min-h-[200px] flex-col justify-center border border-slate-200 shadow-md dark:border-slate-700">
              <div className="p-4">
                <Variable height={24} className="mb-2" />
                <h3 className="text-xl font-bold">{t("variables")}</h3>
                <p>{t("variables-desc")}</p>
              </div>
            </SpotlightCard>
          </Spotlight>
        </section>
        <section className="flex min-h-[50vh] flex-col items-center justify-center">
          <div className="flex flex-col justify-center p-4">
            <h2 className="mt-8 text-center text-4xl font-normal sm:text-5xl">
              {t("open-source")}
            </h2>
            <p className="text-center text-lg text-slate-700 dark:text-slate-300">
              {t("open-source-desc")}
            </p>
          </div>
          <Spotlight className="grid items-center justify-center space-y-4 sm:grid-cols-2 sm:space-x-2 sm:space-y-0">
            <SpotlightCard className="h-full w-full max-w-sm border shadow-md">
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-white p-6 pb-8 dark:bg-slate-900">
                {/* Radial gradient */}
                <div
                  className="pointer-events-none absolute bottom-0 left-1/2 -z-10 aspect-square w-1/2 -translate-x-1/2 translate-y-1/2"
                  aria-hidden="true"
                >
                  <div className="translate-z-0 absolute inset-0 rounded-full bg-slate-200 blur-[80px] dark:bg-slate-800"></div>
                </div>
                <div className="flex h-full flex-col items-center text-center">
                  {/* Image */}
                  <div className="relative inline-flex">
                    <div
                      className="absolute inset-0 -z-10 m-auto h-[40%] w-[40%] -translate-y-[10%] rounded-full bg-indigo-600 blur-3xl"
                      aria-hidden="true"
                    ></div>
                    <span className="rounded-full border border-indigo-500/25 p-5">
                      <Building />
                    </span>
                  </div>
                  {/* Text */}
                  <div className="mb-5 grow">
                    <h2 className="mb-1 text-xl font-bold text-black dark:text-slate-200">
                      Synapsy
                    </h2>
                    <p className="text-sm text-slate-800 dark:text-slate-500">
                      {t("synapsy-browse")}
                    </p>
                  </div>
                  <Link
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium transition-colors duration-150   dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 dark:focus-visible:ring-slate-600"
                    href="https://github.com/synapsy-ai/"
                  >
                    <svg
                      className="mr-2 dark:fill-slate-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="14"
                    >
                      <path d="M12.82 8.116A.5.5 0 0 0 12 8.5V10h-.185a3 3 0 0 1-2.258-1.025l-.4-.457-1.328 1.519.223.255A5 5 0 0 0 11.815 12H12v1.5a.5.5 0 0 0 .82.384l3-2.5a.5.5 0 0 0 0-.768l-3-2.5ZM12.82.116A.5.5 0 0 0 12 .5V2h-.185a5 5 0 0 0-3.763 1.708L3.443 8.975A3 3 0 0 1 1.185 10H1a1 1 0 1 0 0 2h.185a5 5 0 0 0 3.763-1.708l4.609-5.267A3 3 0 0 1 11.815 4H12v1.5a.5.5 0 0 0 .82.384l3-2.5a.5.5 0 0 0 0-.768l-3-2.5ZM1 4h.185a3 3 0 0 1 2.258 1.025l.4.457 1.328-1.52-.223-.254A5 5 0 0 0 1.185 2H1a1 1 0 0 0 0 2Z" />
                    </svg>
                    <span>{t("learn-more")}</span>
                  </Link>
                </div>
              </div>
            </SpotlightCard>
            <SpotlightCard className="h-full w-full max-w-sm border shadow-md">
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-white p-6 pb-8 dark:bg-slate-900">
                {/* Radial gradient */}
                <div
                  className="pointer-events-none absolute bottom-0 left-1/2 -z-10 aspect-square w-1/2 -translate-x-1/2 translate-y-1/2"
                  aria-hidden="true"
                >
                  <div className="translate-z-0 absolute inset-0 rounded-full bg-slate-200 blur-[80px] dark:bg-slate-800"></div>
                </div>
                <div className="flex h-full flex-col items-center text-center">
                  {/* Image */}
                  <div className="relative inline-flex">
                    <div
                      className="absolute inset-0 -z-10 m-auto h-[40%] w-[40%] -translate-y-[10%] rounded-full bg-indigo-600 blur-3xl"
                      aria-hidden="true"
                    ></div>
                    <span className="rounded-full border border-indigo-500/25 p-5">
                      <Github />
                    </span>
                  </div>
                  {/* Text */}
                  <div className="mb-5 grow">
                    <h2 className="mb-1 text-xl font-bold text-black dark:text-slate-200">
                      GitHub
                    </h2>
                    <p className="text-sm text-slate-800 dark:text-slate-500">
                      {t("github-desc")}
                    </p>
                  </div>
                  <Link
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium transition-colors duration-150   dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 dark:focus-visible:ring-slate-600"
                    href="https://github.com/synapsy-ai/write/"
                  >
                    <svg
                      className="mr-2 dark:fill-slate-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="14"
                    >
                      <path d="M12.82 8.116A.5.5 0 0 0 12 8.5V10h-.185a3 3 0 0 1-2.258-1.025l-.4-.457-1.328 1.519.223.255A5 5 0 0 0 11.815 12H12v1.5a.5.5 0 0 0 .82.384l3-2.5a.5.5 0 0 0 0-.768l-3-2.5ZM12.82.116A.5.5 0 0 0 12 .5V2h-.185a5 5 0 0 0-3.763 1.708L3.443 8.975A3 3 0 0 1 1.185 10H1a1 1 0 1 0 0 2h.185a5 5 0 0 0 3.763-1.708l4.609-5.267A3 3 0 0 1 11.815 4H12v1.5a.5.5 0 0 0 .82.384l3-2.5a.5.5 0 0 0 0-.768l-3-2.5ZM1 4h.185a3 3 0 0 1 2.258 1.025l.4.457 1.328-1.52-.223-.254A5 5 0 0 0 1.185 2H1a1 1 0 0 0 0 2Z" />
                    </svg>
                    <span>{t("learn-more")}</span>
                  </Link>
                </div>
              </div>
            </SpotlightCard>
          </Spotlight>
        </section>
      </main>
      <Footer params={{ lng: lng }} />
    </>
  );
}
