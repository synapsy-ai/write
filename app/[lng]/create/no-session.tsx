"use client";
import { useTranslation } from "@/app/i18n/client";
import PeyronnetLogo from "@/components/peyronnet-logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
export default function NoSession(props: { lng: string }) {
  const { t } = useTranslation(props.lng, "common");
  return (
    <main className="mt-2 flex min-h-full flex-col justify-center pb-16 sm:mt-16 sm:pb-0">
      <section className="m-4 flex flex-col items-center space-y-2">
        <div className="flex items-center">
          <div className="rounded-2xl border bg-white/50 p-8 shadow-lg backdrop-blur-md transition hover:border-slate-400 hover:bg-white/70 hover:shadow-xl dark:bg-slate-800/20 dark:shadow-violet-500/20 dark:hover:border-slate-500 dark:hover:bg-slate-400/20">
            <Image
              height={48}
              width={48}
              alt="Synapsy Logo"
              src={
                useTheme().theme === "light"
                  ? "/logolight.svg"
                  : "/logodark.svg"
              }
            />
          </div>
          <PeyronnetLogo width={250} />
        </div>
        <span className="rounded-full border border-violet-600 px-2 text-sm font-bold text-violet-600 dark:bg-violet-600/10">
          {t("new")}
        </span>
        <h2 className="text-center">{t("unlock-power-ai")}</h2>
        <p className="max-w-3xl text-center">{t("account-desc")}</p>
      </section>
      <section className="flex justify-center space-x-2">
        <Link href="https://account.peyronnet.group/login">
          <Button>{t("sign-up")}</Button>
        </Link>
        <Link href="login">
          <Button variant="outline">{t("sign-in")}</Button>
        </Link>
      </section>
    </main>
  );
}
