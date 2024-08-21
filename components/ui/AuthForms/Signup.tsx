"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { signUp } from "@/utils/auth-helpers/server";
import { handleRequest } from "@/utils/auth-helpers/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { Input } from "../input";
import Separator from "./Separator";

// Define prop type with allowEmail boolean
interface SignUpProps {
  allowEmail: boolean;
  redirectMethod: string;
  lng: string;
}

export default function SignUp({
  allowEmail,
  redirectMethod,
  lng,
}: SignUpProps) {
  const { t } = useTranslation(lng, "common");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, signUp, redirectMethod === "client" ? router : null);
    setIsSubmitting(false);
  };

  return (
    <div>
      <form
        noValidate={true}
        className="mb-1"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="email">{t("email-label")}</label>
            <Input
              id="email"
              placeholder={t("email-input-placeholder")}
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
            />
            <label htmlFor="password">{t("password-label")}</label>
            <Input
              id="password"
              placeholder={t("password-input-placeholder")}
              type="password"
              name="password"
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="mt-1">
            {t("sign-up")}
          </Button>
        </div>
      </form>
    </div>
  );
}
