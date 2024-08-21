"use client";

import { Button } from "@/components/ui/button";
import { updateEmail } from "@/utils/auth-helpers/server";
import { handleRequest } from "@/utils/auth-helpers/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card";
import { useTranslation } from "@/app/i18n/client";
import { Input } from "../input";

export default function EmailForm({
  userEmail,
  lng,
}: {
  userEmail: string | undefined;
  lng: string;
}) {
  const { t } = useTranslation(lng, "common");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Check if the new email is the same as the old email
    if (e.currentTarget.newEmail.value === userEmail) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    handleRequest(e, updateEmail, router);
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("email")}</CardTitle>
        <CardDescription>{t("email-desc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="emailForm" onSubmit={(e) => handleSubmit(e)}>
          <Input
            type="text"
            name="newEmail"
            defaultValue={userEmail ?? ""}
            placeholder="Your email"
            maxLength={64}
          />
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="pb-4 sm:pb-0">{t("email-notify")}</p>
        <Button type="submit" form="emailForm">
          {t("update-email")}
        </Button>
      </CardFooter>
    </Card>
  );
}
