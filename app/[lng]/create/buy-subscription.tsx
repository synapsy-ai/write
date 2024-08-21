"use client";
import { useTranslation } from "@/app/i18n/client";
import Pricing from "@/components/pricing";
import { Tables } from "@/types_db";
import { User } from "@supabase/supabase-js";
import { useTheme } from "next-themes";
import Image from "next/image";

type Subscription = Tables<"subscriptions">;
type Product = Tables<"products">;
type Price = Tables<"prices">;

interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}
export default function BuySubscription(props: {
  user: User;
  subscriptions: SubscriptionWithProduct[] | null;
  products: ProductWithPrices[];
  lng: string;
}) {
  const { t } = useTranslation(props.lng, "common");
  return (
    <main className="mt-2 flex min-h-full flex-col justify-center pb-16 sm:pb-0">
      <section className="m-4 flex flex-col items-center space-y-2">
        <div className="rounded-2xl border bg-white/50 p-8 shadow-lg backdrop-blur-md transition hover:border-slate-400 hover:bg-white/70 hover:shadow-xl dark:bg-slate-800/20 dark:shadow-violet-500/20 dark:hover:border-slate-500 dark:hover:bg-slate-400/20">
          <Image
            height={48}
            width={48}
            alt="Synapsy Logo"
            src={
              useTheme().theme === "light" ? "/logolight.svg" : "/logodark.svg"
            }
          />
        </div>
        <h2 className="text-center">{t("unlock-ai-sub")}</h2>
      </section>
      <section className="flex justify-center space-x-2">
        <Pricing
          lng={props.lng}
          user={props.user}
          products={props.products}
          subscriptions={props.subscriptions}
        />
      </section>
    </main>
  );
}
