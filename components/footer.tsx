"use client";
import Link from "next/link";

import Logo from "./logo";
import { useTranslation } from "@/app/i18n/client";

export default function SiteFooter({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const { t } = useTranslation(lng, "common");
  return (
    <footer className="flex flex-col justify-center space-y-2 px-5 py-10 sm:grid sm:grid-cols-3">
      <div className="flex items-center justify-center sm:justify-normal">
        <Link href="/">
          <Logo width={256} height={64} />
        </Link>
      </div>
      <div className="m-4 sm:m-0">
        <h3 className="text-lg">{t("links")}</h3>
        <div className="flex flex-col">
          <Link
            className="hover:underline"
            href={"https://blog.peyronnet.group"}
          >
            Blog
          </Link>
          <Link
            className="hover:underline"
            href={"https://peyronnet.group/privacy"}
          >
            Privacy policy
          </Link>
        </div>
      </div>
      <div className="m-4 sm:m-0">
        <h3 className="text-lg">{t("socials")}</h3>
        <div className="flex flex-col">
          <Link
            className="hover:underline"
            href={"https://twitter.com/PeyronnetGroup"}
          >
            Twitter
          </Link>
          <Link
            className="hover:underline"
            href={"https://www.youtube.com/@PeyronnetGroup"}
          >
            YouTube
          </Link>
        </div>
      </div>
    </footer>
  );
}
