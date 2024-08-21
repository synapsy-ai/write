"use client";
import { SignOut } from "@/utils/auth-helpers/server";
import { handleRequest } from "@/utils/auth-helpers/client";
import { usePathname, useRouter } from "next/navigation";
import { getRedirectMethod } from "@/utils/auth-helpers/settings";
import { Button } from "../button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../card";
import { useTranslation } from "@/app/i18n/client";
export default function SignOutForm({ lng }: { lng: string }) {
  const { t } = useTranslation(lng, "common");
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("session")}</CardTitle>
        <CardDescription>{t("sign-out")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) =>
            handleRequest(
              e,
              SignOut,
              getRedirectMethod() === "client" ? router : null
            )
          }
        >
          <input type="hidden" name="pathName" value={usePathname()} />
          <Button
            variant="link"
            className="button block text-red-500 dark:text-red-600"
            type="submit"
          >
            {t("sign-out")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
