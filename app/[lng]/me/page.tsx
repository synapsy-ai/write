import { useTranslation } from "@/app/i18n";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import {
  getUserDetails,
  getSubscriptions,
  getUser,
} from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import CustomerPortalForm from "@/components/ui/AccountForms/CustomerPortalForm";
import EmailForm from "@/components/ui/AccountForms/EmailForm";
import NameForm from "@/components/ui/AccountForms/NameForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignOutForm from "@/components/ui/AccountForms/SignOutForm";

export default async function Account({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const { t } = await useTranslation(lng, "common");
  const supabase = createClient();
  const [user, userDetails, subscription] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase),
    getSubscriptions(supabase),
  ]);

  if (!user) {
    return redirect("/signin");
  }

  return (
    <main className="min-h-full space-y-2 bg-slate-100/40 px-2 pb-20 dark:bg-transparent sm:pb-0 md:gap-8 md:p-10">
      <section className="mx-auto grid w-full max-w-6xl gap-2 p-2 sm:mt-0 sm:p-0">
        <div className="m-auto grid w-full max-w-3xl">
          <h1 className="text-3xl font-semibold">{t("my-account")}</h1>
          <p className="text-muted-foreground">
            {" "}
            {t("welcome-msg").replace(
              "[[user]]",
              userDetails?.full_name || "user",
            )}
          </p>
        </div>
        <div className="m-auto mt-4 grid w-full max-w-3xl gap-6">
          <div className="m-auto w-full rounded-md border border-violet-400 bg-violet-100 p-4 dark:border-violet-700 dark:bg-violet-950">
            <p>
              {t("account-read-only-1")}{" "}
              <Link
                className="text-violet-500 hover:underline dark:text-violet-300"
                target="_blank"
                rel="noopener noreferrer"
                href="https://account.peyronnet.group/me"
              >
                account.peyronnet.group
              </Link>{" "}
              {t("account-read-only-2")}
            </p>
          </div>
          <CustomerPortalForm lng={lng} subscriptions={subscription} />
          <NameForm lng={lng} userName={userDetails?.full_name ?? ""} />
          <EmailForm lng={lng} userEmail={user.email} />
          <SignOutForm lng={lng} />
        </div>
      </section>
    </main>
  );
}
