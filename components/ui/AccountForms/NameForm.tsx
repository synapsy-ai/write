"use client";

import { Button } from "@/components/ui/button";
import { updateName } from "@/utils/auth-helpers/server";
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

export default function NameForm({
  userName,
  lng,
}: {
  userName: string;
  lng: string;
}) {
  const { t } = useTranslation(lng, "common");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Check if the new name is the same as the old name
    if (e.currentTarget.fullName.value === userName) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    handleRequest(e, updateName, router);
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("full-name")}</CardTitle>
        <CardDescription>{t("name-desc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="nameForm" onSubmit={(e) => handleSubmit(e)}>
          <Input
            type="text"
            name="fullName"
            defaultValue={userName}
            placeholder={t("full-name")}
            maxLength={64}
          />
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="pb-4 sm:pb-0">{t("name-char")}</p>
        <Button type="submit" form="nameForm">
          {t("update-name")}
        </Button>
      </CardFooter>
    </Card>
  );
}
