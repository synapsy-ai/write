"use client";

import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/ui/button";
import { postData } from "@/utils/helpers";

import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface Props {
  session: Session;
  lng: string;
}

export default function ManageSubscriptionButton({ session, lng }: Props) {
  const { t } = useTranslation(lng, "common");
  const router = useRouter();
  const redirectToCustomerPortal = async () => {
    try {
      const { url } = await postData({
        url: "/api/create-portal-link",
      });
      router.push(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
      <p className="pb-4 sm:pb-0">{t("manage-stripe")}</p>
      <Button disabled={!session} onClick={redirectToCustomerPortal}>
        {t("open-portal")}
      </Button>
    </div>
  );
}
