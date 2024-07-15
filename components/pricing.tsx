"use client";

import { Database } from "@/types_db";
import { postData } from "@/utils/helpers";
import { getStripe } from "@/utils/stripe-client";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/app/i18n/client";
import PricingFeatures from "./features";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];
type Price = Database["public"]["Tables"]["prices"]["Row"];
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  session: Session | null;
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscriptions: SubscriptionWithProduct[] | null;
  lng: string;
}

type BillingInterval = "lifetime" | "year" | "month";

export default function Pricing({
  session,
  user,
  products,
  subscriptions,
  lng,
}: Props) {
  const { t } = useTranslation(lng, "common");
  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval),
      ),
    ),
  );
  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("month");
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const [selectedCurrency, setSelectedCurrency] = useState("eur");
  const [currencies, setCurrencies] = useState(getCurrencies());

  function getCurrencies() {
    let cs: (string | null)[] = []; // all currencies available
    for (let i = 0; i < products.length; i++) {
      for (let j = 0; j < products[i].prices.length; j++) {
        if (
          products[i].prices[j].currency !== null &&
          !cs.includes(products[i].prices[j].currency)
        ) {
          cs.push(products[i].prices[j].currency);
        }
      }
    }
    return cs;
  }

  function currencyToString(cur: string): string {
    switch (cur) {
      case "eur":
        return "Euro";

      default:
        return cur.toUpperCase();
    }
  }

  function isSubscribedToProduct(productId: string) {
    if (subscriptions) {
      for (let i = 0; i < subscriptions?.length; i++) {
        if (subscriptions[i]?.prices?.product_id === productId) {
          return true;
        }
      }
    }
  }

  const handleCheckout = async (price: Price, free_trial: boolean) => {
    setPriceIdLoading(price.id);
    if (!user) {
      return router.push(`/${lng}/login`);
    }

    if (subscriptions) {
      for (let i = 0; i < subscriptions?.length; i++) {
        if (subscriptions[i]?.prices?.product_id === price.product_id) {
          return router.push(`/${lng}/me`);
        }
      }
    }
    let trial = free_trial;
    if (free_trial && subscriptions) {
      for (let i = 0; i < subscriptions.length; i++) {
        if (subscriptions[i].trial_end) {
          trial = false;
          return;
        }
      }
    }
    try {
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { price, trial },
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return alert((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };
  if (!products.length)
    return (
      <section className="min-h-3xl flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">
          No plans are available right now.
        </h2>
        <p>The product page is currently not available</p>
      </section>
    );

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h2 className="text-center text-2xl font-bold">
            {t("available-products")}
          </h2>
          <p className="text-center">{t("synapsy-available-products-desc")}</p>
          <div className="relative mt-6 flex self-center rounded-lg border p-0.5 dark:border-slate-800 dark:bg-slate-900 sm:mt-8">
            {intervals.includes("month") && (
              <button
                onClick={() => setBillingInterval("month")}
                type="button"
                className={`${
                  billingInterval === "month"
                    ? "relative w-1/2 border-slate-200 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-700 dark:text-white"
                    : "relative ml-0.5 w-1/2 border border-transparent text-slate-400"
                } m-1 whitespace-nowrap rounded-md py-2 text-sm font-medium focus:z-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 sm:w-auto sm:px-8`}
              >
                {t("monthly-billing")}
              </button>
            )}
            {intervals.includes("year") && (
              <button
                onClick={() => setBillingInterval("year")}
                type="button"
                className={`${
                  billingInterval === "year"
                    ? "relative w-1/2 border-slate-200 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-700 dark:text-white"
                    : "relative ml-0.5 w-1/2 border border-transparent text-slate-400"
                } m-1 whitespace-nowrap rounded-md py-2 text-sm font-medium focus:z-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 sm:w-auto sm:px-8`}
              >
                {t("yearly-billing")}
              </button>
            )}
            <div className="mr-1 hidden items-center sm:flex">
              <Select
                defaultValue={selectedCurrency}
                value={selectedCurrency}
                onValueChange={setSelectedCurrency}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency, k) => (
                    <SelectItem value={currency ?? "eur"} key={k}>
                      {currencyToString(currency ?? "eur")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center py-2 sm:hidden">
            <Select
              defaultValue={selectedCurrency}
              value={selectedCurrency}
              onValueChange={setSelectedCurrency}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency, k) => (
                  <SelectItem value={currency ?? "eur"} key={k}>
                    {currencyToString(currency ?? "eur")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-3">
          {products.map((product) => {
            if (!product.name?.toLowerCase().includes("write")) return <></>;

            const price = product?.prices?.find(
              (price) => price.interval === billingInterval,
            );
            if (!price || price.currency !== selectedCurrency) return null;
            const priceString = new Intl.NumberFormat(
              lng === "fr" ? "fr-FR" : "en-US",
              {
                style: "currency",
                currency: price.currency!,
                minimumFractionDigits: 2,
              },
            ).format((price?.unit_amount || 0) / 100);
            return (
              <div
                key={product.id}
                className={cn(
                  "divide-y divide-slate-100 rounded-lg border border-slate-300 bg-white shadow-sm dark:divide-slate-600 dark:border-slate-700 dark:bg-slate-900",
                  {
                    "border border-indigo-500 dark:border-indigo-500":
                      subscriptions
                        ? isSubscribedToProduct(product.id)
                        : product.name === "Freelancer",
                  },
                )}
              >
                <div className="p-6">
                  <span className="flex items-center space-x-2">
                    <h2 className="text-2xl font-semibold leading-6 dark:text-white">
                      {product.name}
                    </h2>
                  </span>
                  <p className="mt-4 dark:text-slate-300">
                    {product.description}
                  </p>
                  <p className="mt-8">
                    <span className="white text-3xl font-bold">
                      {priceString}
                    </span>
                    <span className="text-base font-medium dark:text-slate-100">
                      /{t(billingInterval)}
                    </span>
                  </p>
                  <PricingFeatures lng={lng} productName={product.name} />

                  <span className="block pt-8">
                    {subscriptions?.length === 0 ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleCheckout(price, true)}
                        className="block w-full rounded-md border-purple-500 bg-transparent py-2 text-center text-sm font-semibold"
                      >
                        {t("free-trial")}
                      </Button>
                    ) : (
                      <></>
                    )}
                    <Button
                      type="button"
                      onClick={() => handleCheckout(price, false)}
                      className="mt-2 block w-full rounded-md py-2 text-center text-sm font-semibold text-white"
                    >
                      {isSubscribedToProduct(product.id)
                        ? t("manage")
                        : t("subscribe")}
                    </Button>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
