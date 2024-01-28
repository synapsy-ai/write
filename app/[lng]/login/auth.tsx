"use client";

import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSupabase } from "@/app/supabase-provider";
import { Auth } from "@supabase/auth-ui-react";
import { useTheme } from "next-themes";
import { useTranslation } from "@/app/i18n/client";
import PeyronnetLogo from "@/components/peyronnet-logo";
import { CircleUser } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function LoginPage(props: { lng: string }) {
  const { supabase } = useSupabase();
  const { theme } = useTheme();
  const { t } = useTranslation(props.lng, "common");
  const customTheme = {
    default: {
      colors: {
        brand: "#2563EB",
        brandAccent: "#1D4ED8",
        brandButtonText: "white",
        defaultButtonBackground: "transparent",
        defaultButtonBackgroundHover: "rgb(226 232 240)",
        defaultButtonBorder: "rgb(203 213 225)",
        defaultButtonText: "black",
        inputBorder: "rgb(203 213 225)",
        inputBorderFocus: "rgb(183 183 195)",
        inputBorderHover: "rgb(193 193 205)",
        inputText: "black",
        inputLabelText: "black",
        dividerBackground: "rgb(203 213 225)",
        anchorTextColor: "rgb(100 116 139)",
      },
    },
    dark: {
      colors: {
        brandButtonText: "white",
        defaultButtonBackground: "rgb(15 23 42)",
        defaultButtonBackgroundHover: "rgb(30 41 59)",
        defaultButtonBorder: "rgb(51 65 85)",
        defaultButtonText: "white",
        inputBorder: "rgb(51 65 85)",
        inputBorderFocus: "rgb(81 95 115)",
        inputBorderHover: "rgb(71 85 105)",
        inputText: "white",
        inputLabelText: "white",
        dividerBackground: "rgb(51 65 85)",
        anchorTextColor: "rgb(71 85 105)",
        //..
      },
    },
    // You can also add more theme variations with different names.
    evenDarker: {
      colors: {
        brandButtonText: "white",
        defaultButtonBackground: "rgb(15 23 42)",
        defaultButtonBackgroundHover: "rgb(30 41 59)",
        defaultButtonBorder: "rgb(51 65 85)",
        defaultButtonText: "white",
        inputBorder: "rgb(51 65 85)",
        inputBorderFocus: "rgb(81 95 115)",
        inputBorderHover: "rgb(71 85 105)",
        inputText: "white",
        inputLabelText: "white",
        dividerBackground: "rgb(51 65 85)",
        anchorTextColor: "rgb(71 85 105)",
        //..
      },
    },
  };
  return (
    <main className="grid min-h-[calc(100vh-61px)] grid-rows-[auto,auto,1fr] px-2 pb-16 sm:pb-0 sm:pt-16">
      <section className="flex items-center space-x-2">
        <CircleUser />
        <span>
          <h2 className="text-2xl font-bold">{t("sign-in")}</h2>
          <p>{t("welcome-back")}</p>
        </span>
      </section>
      <Separator />
      <section className="flex flex-col items-center justify-center p-2">
        <div className="w-full max-w-[600px] rounded-md border border-slate-200 bg-white/50 p-2 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-800/50">
          <span className="flex justify-center">
            <PeyronnetLogo width={180} />
          </span>

          <Auth
            theme={theme === "dark" ? "dark" : "light"}
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: customTheme,
            }}
            redirectTo={`https://write.peyronnet.group/auth/callback`}
            socialLayout="horizontal"
            providers={["github", "google"]}
            dark={theme === "dark"}
          />
        </div>
      </section>
    </main>
  );
}
