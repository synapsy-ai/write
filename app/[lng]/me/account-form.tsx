"use client";
import { useCallback, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/app/i18n/client";
import { CircleUser, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AccountForm({ user, lng }: any) {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      if (user) {
        setFullname(user?.full_name || user.user_metadata.full_name);
        setUsername(user?.user_name || user.user_metadata.user_name);
      }
    } catch (error) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  const { t } = useTranslation(lng, "common");
  return (
    <main className="px-2 pb-16 sm:pb-16 sm:pt-16">
      <section className="flex items-center space-x-2">
        <CircleUser />
        <span>
          <h2 className="text-2xl font-bold">{t("my-account")}</h2>
          <p>{t("welcome-msg").replace("[[user]]", fullname || "user")}</p>
        </span>
      </section>
      <Separator />
      <div className="py-2">
        <h3>{t("your-info")}</h3>
        <p>{t("your-info-desc")}</p>
      </div>
      <div className="form-widget rounded-md border border-slate-200 p-2 dark:border-slate-800">
        <div>
          <label htmlFor="email">{t("email")}</label>
          <Input id="email" type="text" value={user?.email} disabled />
        </div>
        <div>
          <label htmlFor="fullName">{t("full-name")}</label>
          <Input
            id="fullName"
            type="text"
            value={fullname || ""}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="username">{t("username")}</label>
          <Input
            id="username"
            type="text"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </div>
      <div className="py-2">
        <h3>{t("products")}</h3>
        <p>{t("products-desc")}</p>
      </div>
      <div className="flex flex-col items-center space-y-2 rounded-md border border-slate-200 p-5 dark:border-slate-800">
        <ShoppingBag />
        <p>{t("no-products")}</p>
      </div>
      <div className="py-2">
        <h3>{t("session")}</h3>
        <form action="/auth/signout" method="post">
          <Button
            variant="link"
            className="button block text-red-500 dark:text-red-600"
            type="submit"
          >
            {t("sign-out")}
          </Button>
        </form>
      </div>
    </main>
  );
}
