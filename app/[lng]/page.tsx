"use client";
import Image from "next/image";
import { useTranslation } from "../i18n/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BrainCircuit,
  Building,
  Check,
  Dot,
  Github,
  MousePointerClick,
  PenSquare,
  PencilRulerIcon,
  Rocket,
  Table,
  TriangleAlert,
  Variable,
  X,
} from "lucide-react";
import Footer from "@/components/footer";
import { useTheme } from "next-themes";
import { useRef } from "react";
import Spotlight, { SpotlightCard } from "@/components/spotlight";
import { SpotlightEffect } from "@/components/ui/spotlight-effect";
import { BorderAnimation } from "@/components/ui/moving-border";
import ResultDisplayer from "@/components/result-displayer";
import { FlipWords } from "@/components/ui/flip-words";

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
        <section className="flex min-h-screen flex-col items-center justify-center rounded-lg p-4 text-center bg-grid-slate-300/[0.2] dark:bg-grid-slate-700/[0.2]">
          <SpotlightEffect
            className="-top-40 left-0 md:-top-20 md:left-60"
            fill="#7d54e0"
          />
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

            <Link href={lng + "/pricing"}>
              <Button variant="link">{t("pricing")}</Button>
            </Link>
          </div>
          <Button onClick={handleClick} variant="link">
            {t("learn-more")}
          </Button>
          <BorderAnimation>
            <div className="m-1 rounded-xl shadow-xl">
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
          </BorderAnimation>
        </section>
        <section
          id="features"
          className="w-full bg-muted py-12 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full border bg-muted px-3 py-1 text-sm dark:border-slate-700">
                  {t("key-features")}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {t("unlock-potential")}
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t("unlock-potential-desc")}
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="mx-auto hidden aspect-video max-w-96 items-center justify-center overflow-hidden rounded-xl border object-cover object-center dark:border-slate-700 sm:flex sm:w-full lg:order-last">
                <p className="text-5xl font-bold">
                  <FlipWords
                    words={[
                      t("create"),
                      t("ideas"),
                      t("essay-outline"),
                      t("tones-professional"),
                      t("generation"),
                    ]}
                  />
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        {t("effortless-text-gen")}
                      </h3>
                      <p className="text-muted-foreground">
                        {t("effortless-text-gen-desc")}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        {t("feature-versatile")}
                      </h3>
                      <p className="text-muted-foreground">
                        {t("feature-versatile-desc")}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">{t("feature-easy")}</h3>
                      <p className="text-muted-foreground">
                        {t("feature-easy-desc")}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                {t("productivity")}
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t("productivity-desc")}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
              <Link
                href="create"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                {t("try-synapsy")}
              </Link>
              <Link
                href="pricing"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-bold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                {t("learn-more")}
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full bg-muted py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full border bg-muted px-3 py-1 text-sm dark:border-slate-700">
                  Synapsy Write vs. ChatGPT 4
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {t("features-desc")}
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t("why-synapsy-desc")}
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6 sm:grid-cols-2">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        {t("advanced-instructions")}
                      </h3>
                      <p className="text-muted-foreground">
                        {t("advanced-instructions-desc")}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">{t("text-editor")}</h3>
                      <p className="text-muted-foreground">
                        {t("text-editor-desc")}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">{t("essays")}</h3>
                      <p className="text-muted-foreground">
                        {t("essays-desc")}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        {t("text-analysis")}
                      </h3>
                      <p className="text-muted-foreground">
                        {t("text-analysis-desc")}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">{t("variables")}</h3>
                      <p className="text-muted-foreground">
                        {t("variables-desc")}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">{t("tables")}</h3>
                      <p className="text-muted-foreground">
                        {t("tables-desc")}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-[50vh] flex-col items-center justify-center">
          <div className="flex flex-col justify-center p-4">
            <h2 className="mt-8 bg-gradient-to-br from-slate-500 to-slate-800 bg-clip-text text-center text-4xl font-normal text-transparent dark:from-slate-100 dark:to-slate-400 sm:text-5xl">
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
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium transition-colors duration-150 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 dark:focus-visible:ring-slate-600"
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
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium transition-colors duration-150 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 dark:focus-visible:ring-slate-600"
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
