"use client";

import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { createStripePortal } from "@/utils/stripe/server";
import Link from "next/link";
import { Tables } from "@/types_db";
import { useTranslation } from "@/app/i18n/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card";
import { Currency, Info, Calendar } from "lucide-react";

type Subscription = Tables<"subscriptions">;
type Price = Tables<"prices">;
type Product = Tables<"products">;

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
        products: Product | null;
      })
    | null;
};

interface Props {
  subscriptions: SubscriptionWithPriceAndProduct[] | null;
  lng: string;
}

export default function CustomerPortalForm({ subscriptions, lng }: Props) {
  const { t } = useTranslation(lng, "common");
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    const redirectUrl = await createStripePortal(currentPath);
    setIsSubmitting(false);
    return router.push(redirectUrl);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("products")}</CardTitle>
        <CardDescription>
          {subscriptions && subscriptions.length > 0
            ? t("products-available")
            : t("no-products")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-8 mb-4">
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
                      }
                    ).format(
                      (subscription?.prices?.unit_amount || 0) / 100
                    )}/${t(subscription?.prices?.interval ?? "month")}`}</p>
                    <Info size={14} />
                    <p>{t(subscription.status ?? "active")}</p>
                    <Calendar size={14} />
                    <p>
                      {new Date(
                        subscription.current_period_end
                      ).toLocaleDateString(
                        lng === "fr" ? "fr-FR" : "en-US"
                      )}{" "}
                      {new Date(
                        subscription.current_period_end
                      ).toLocaleTimeString(lng === "fr" ? "fr-FR" : "en-US")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-md border dark:border-slate-700">
              <Link href="/products">{t("products-desc")}</Link>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="pb-4 sm:pb-0">{t("manage-stripe")}</p>
        <Button onClick={handleStripePortalRequest}>{t("open-portal")}</Button>
      </CardFooter>
    </Card>
  );
}
