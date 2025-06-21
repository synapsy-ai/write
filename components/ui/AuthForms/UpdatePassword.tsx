"use client";

import { Button } from "@/components/ui/button";
import { updatePassword } from "@/utils/auth-helpers/server";
import { handleRequest } from "@/utils/auth-helpers/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Input } from "../input";
import { useTranslation } from "@/app/i18n/client";

interface UpdatePasswordProps {
  redirectMethod: string;
  lng: string;
}

export default function UpdatePassword({
  redirectMethod,
  lng,
}: UpdatePasswordProps) {
  const { t } = useTranslation(lng, "common");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(
      e,
      updatePassword,
      redirectMethod === "client" ? router : null,
    );
    setIsSubmitting(false);
  };

  return (
    <div className="my-8">
      <form
        noValidate={true}
        className="mb-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="password">{t("new-password")}</label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              name="password"
              autoComplete="current-password"
            />
            <label htmlFor="passwordConfirm">{t("confirm-password")}</label>
            <Input
              id="passwordConfirm"
              placeholder="Password"
              type="password"
              name="passwordConfirm"
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="mt-1">
            {t("update-password")}
          </Button>
        </div>
      </form>
    </div>
  );
}
