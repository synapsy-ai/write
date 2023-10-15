import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { dir } from "i18next";
import { languages } from "../i18n/settings";
import NavBar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";

const inter = DM_Sans({ subsets: ["latin"] });
export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export const metadata: Metadata = {
  title: "Synapsy Write",
  description: "A new way to write text, powered by AI.",
};

export default function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: any };
}) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <head>
        <link rel="icon" href="/logo.png" />

        <meta
          name="twitter:description"
          content="A new way to write text, powered by AI."
        />
        <meta name="twitter:site" content="@PeyronnetGroup" />
        <meta name="twitter:title" content="Synapsy Write" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://peyronnet.group/synapsy_write_social.png"
        />

        <meta name="og:title" content="Synapsy Write" />
        <meta
          name="og:description"
          content="A new way to write text, powered by AI."
        />
        <meta
          name="og:image"
          content="https://peyronnet.group/synapsy_write_social.png"
        />
        <Script
          id="gtag"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-W409KSWNWR"
        ></Script>
        <Script id="google-analytics">
          {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-W409KSWNWR');`}
        </Script>
      </head>
      <body className={inter.className + " dark:bg-slate-950 dark:text-white"}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NavBar lng={lng} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
