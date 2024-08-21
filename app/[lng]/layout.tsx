import "./globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { dir } from "i18next";
import { languages } from "../i18n/settings";
import NavBar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";
import MobileNavBar from "@/components/mobile-nav";
import SupabaseProvider from "../supabase-provider";

const manrope = Manrope({ subsets: ["latin"] });
export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export const metadata: Metadata = {
  title: { default: "Synapsy Write", template: "%s | Synapsy Write" },
  description:
    "AI-powered document generator. Generate essays, articles and complex documents using automations and AI.",
  twitter: {
    description:
      "AI-powered document generator. Generate essays, articles and complex documents using automations and AI.",
    site: "@PeyronnetGroup",
    card: "summary_large_image",
    images: "https://peyronnet.group/synapsy_write_social.png",
  },
  applicationName: "Synapsy Write",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Synapsy Write",
  },
  openGraph: {
    title: "Synapsy Write",
    description:
      "AI-powered document generator. Generate essays, articles and complex documents using automations and AI.",
    images: "https://peyronnet.group/synapsy_write_social.png",
  },
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
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          name="twitter:description"
          content="A new way to write text, powered by AI."
        />
        <meta name="twitter:url" content="write.peyronnet.group/" />
        <link rel="manifest" href="/manifest.json" />

        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#000014"
          media="(prefers-color-scheme: dark)"
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
      <body
        className={
          manrope.className +
          " overflow-x-hidden dark:bg-slate-950 dark:text-white"
        }
      >
        <SupabaseProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NavBar lng={lng} />
            {children}
            <MobileNavBar lng={lng} />
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
