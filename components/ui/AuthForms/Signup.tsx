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
      <h2 className="text-4xl font-bold">
        It is no longer possible to signup for Synapsy Write.
      </h2>
    </div>
  );
}
