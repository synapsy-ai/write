import { useTranslation } from "@/app/i18n";
import {
  getSession,
  getUserDetails,
  getSubscriptions,
} from "@/app/supabase-server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database } from "@/types_db";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import ManageSubscriptionButton from "./ManageSubscriptionButton";
import { Calendar, CircleUser, Currency, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default async function Account({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const { t } = await useTranslation(lng, "common");

  const [session, userDetails, subscriptions] = await Promise.all([
    getSession(),
    getUserDetails(),
    getSubscriptions(),
  ]);

  const user = session?.user;

  if (!session) {
    return redirect("/" + lng + "/login");
  }

  const updateName = async (formData: FormData) => {
    "use server";

    const newName = formData.get("name") as string;
    const supabase = createServerActionClient<Database>({ cookies });
    const session = await getSession();
    const user = session?.user;
    const { error } = await supabase
      .from("users")
      .update({ full_name: newName })
      .eq("id", user?.id || "");
    if (error) {
      console.log(error);
    }
    revalidatePath("/me");
  };

  const updateEmail = async (formData: FormData) => {
    "use server";

    const newEmail = formData.get("email") as string;
    const supabase = createServerActionClient<Database>({ cookies });
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      console.log(error);
    }
    revalidatePath("/me");
  };

  return (
    <main className="mt-2 min-h-full space-y-2 px-2 pb-20 sm:mt-16 sm:pb-0">
      <section className="flex items-center space-x-2">
        <CircleUser />
        <span>
          <h2 className="text-2xl font-bold">{t("my-account")}</h2>
          <p>
            {t("welcome-msg").replace(
              "[[user]]",
              userDetails?.full_name || "user",
            )}
          </p>
        </span>
      </section>
      <Separator />
      <div className="p-4">
        <div className="m-auto w-full max-w-3xl rounded-md border border-violet-400 bg-violet-100 p-4 dark:border-violet-700 dark:bg-violet-950">
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
        <Card
          title={t("products")}
          description={
            subscriptions && subscriptions.length > 0
              ? t("products-available")
              : t("no-products")
          }
          footer={<ManageSubscriptionButton lng={lng} session={session} />}
        >
          <div className="mb-4 mt-8">
            {subscriptions && subscriptions.length > 0 ? (
              <div className="space-y-2">
                {subscriptions.map((subscription) => (
                  <div
                    key={subscription.id}
                    className="rounded-md border p-4 dark:border-slate-700"
                  >
                    <h3 className="text-xl font-bold">
                      {subscription?.prices?.products?.name}
                    </h3>
                    <div className="grid grid-cols-[auto,1fr] items-center gap-x-1">
                      <Currency size={14} />
                      <p>{`${new Intl.NumberFormat(
                        lng === "fr" ? "fr-FR" : "en-US",
                        {
                          style: "currency",
                          currency: subscription?.prices?.currency!,
                          minimumFractionDigits: 0,
                        },
                      ).format(
                        (subscription?.prices?.unit_amount || 0) / 100,
                      )}/${t(subscription?.prices?.interval ?? "month")}`}</p>
                      <Info size={14} />
                      <p>{t(subscription.status ?? "active")}</p>
                      <Calendar size={14} />
                      <p>
                        {new Date(
                          subscription.current_period_end,
                        ).toLocaleDateString(
                          lng === "fr" ? "fr-FR" : "en-US",
                        )}{" "}
                        {new Date(
                          subscription.current_period_end,
                        ).toLocaleTimeString(lng === "fr" ? "fr-FR" : "en-US")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border p-4 dark:border-slate-700">
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://write.peyronnet.group/pricing"
                >
                  {t("products-desc")}
                </Link>
              </div>
            )}
          </div>
        </Card>
        <Card
          title={t("full-name")}
          description={t("name-desc")}
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">{t("name-char")}</p>
              <Button type="submit" form="nameForm" disabled>
                {t("update-name")}
              </Button>
            </div>
          }
        >
          <div className="mb-4 mt-8 text-xl font-semibold">
            <form id="nameForm" action={updateName}>
              <Input
                type="text"
                disabled
                name="name"
                defaultValue={userDetails?.full_name ?? ""}
                placeholder={t("full-name")}
                maxLength={64}
              />
            </form>
          </div>
        </Card>
        <Card
          title={t("email")}
          description={t("email-desc")}
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">{t("email-notify")}</p>
              <Button type="submit" form="emailForm" disabled={true}>
                {t("update-email")}
              </Button>
            </div>
          }
        >
          <div className="mb-4 mt-8 text-xl font-semibold">
            <form id="emailForm" action={updateEmail}>
              <Input
                disabled
                type="text"
                name="email"
                defaultValue={user ? user.email : ""}
                placeholder={t("email")}
                maxLength={64}
              />
            </form>
          </div>
        </Card>
        <Card title={t("session")} description={t("sign-out")}>
          <form action="/auth/signout" method="post">
            <Button
              variant="link"
              className="button block text-red-500 dark:text-red-600"
              type="submit"
            >
              {t("sign-out")}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="m-auto my-8 w-full max-w-3xl rounded-md border border-slate-200 dark:border-slate-700">
      <div className="px-5 py-4">
        <h3 className="mb-1 text-xl">{title}</h3>
        <p className="text-slate-700 dark:text-slate-300">{description}</p>
        {children}
      </div>
      {footer ? (
        <div className="rounded-b-md border-t border-slate-200 bg-slate-100 p-4 text-slate-500 dark:border-slate-700 dark:bg-slate-900">
          {footer}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
