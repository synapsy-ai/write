"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { requestPasswordUpdate } from "@/utils/auth-helpers/server";
import { handleRequest } from "@/utils/auth-helpers/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { Input } from "../input";

// Define prop type with allowEmail boolean
interface ForgotPasswordProps {
  allowEmail: boolean;
  redirectMethod: string;
  disableButton?: boolean;
  lng: string;
}

export default function ForgotPassword({
  allowEmail,
  redirectMethod,
  disableButton,
  lng,
}: ForgotPasswordProps) {
  const { t } = useTranslation(lng, "common");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(
      e,
      requestPasswordUpdate,
      redirectMethod === "client" ? router : null
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
          </div>
          <Button type="submit" className="mt-1" disabled={disableButton}>
            {t("password-button-label")}
          </Button>
        </div>
      </form>
      <p className="text-center font-light text-sm">
        <Link href="/signin/password_signin">{t("sign-email-password")}</Link>
      </p>
      {allowEmail && (
        <p className="font-light text-sm text-center">
          <Link href="/signin/email_signin">{t("sign-in-magic")}</Link>
        </p>
      )}
      <p className="text-center space-x-2 font-light text-sm">
        <span>{t("link-text-2")}</span>
        <Link href="/signin/signup" className="underline">
          {t("sign-up")}
        </Link>
      </p>
    </div>
  );
}
