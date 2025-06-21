"use client";
import Link from "next/link";

import { useTranslation } from "@/app/i18n/client";
import { version } from "@/lib/version";
import PeyronnetLogo from "./peyronnet-logo";

export default function SiteFooter({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const { t } = useTranslation(lng, "common");
  return (
    <footer className="flex flex-col justify-center space-y-2 border-t px-5 py-10 sm:grid sm:grid-cols-2 print:hidden">
      <div className="flex items-center justify-center sm:justify-normal">
        <Link href="https://peyronnet.group">
          <PeyronnetLogo width={256} height={64} />
        </Link>
      </div>
      <div className="m-4 flex flex-wrap justify-center sm:m-0 sm:justify-normal">
        <FooterLink
          title="Blog"
          description={t("blog-desc")}
          link="https://blog.peyronnet.group"
        />
        <FooterLink
          title={t("privacy-policy")}
          description={t("privacy-desc")}
          link="https://peyronnet.group/privacy"
        />

        <FooterLink
          title={t("terms-sell")}
          description={t("cgv-desc")}
          link="https://peyronnet.group/cgv"
        />

        <FooterLink
          title="X"
          description={t("x-desc")}
          link="https://twitter.com/PeyronnetGroup"
        />

        <FooterLink
          title="YouTube"
          description={t("youtube-desc")}
          link="https://www.youtube.com/@PeyronnetGroup"
        />
        <FooterLink
          title={t("about")}
          description={`v${version} - © ${new Date().getFullYear()} GRP and Synapsy`}
          link="/settings"
        />
      </div>
    </footer>
  );
}

interface FooterLinkProps {
  title: string;
  description: string;
  link: string;
}

function FooterLink(props: FooterLinkProps) {
  return (
    <Link
      href={props.link}
      className="hover:border-muted-foreground/50 hover:bg-muted block w-64 rounded-md border border-transparent p-4 transition-all"
    >
      <h3 className="text-lg leading-tight font-bold tracking-tighter">
        {props.title}
      </h3>
      <p className="text-muted-foreground">{props.description}</p>
    </Link>
  );
}
