import {
  getActiveProductsWithPrices,
  getSession,
  getSubscriptions,
} from "@/app/supabase-server";
import Pricing from "@/components/pricing";

export const metadata = {
  title: "Pricing | Synapsy Write",
  description:
    "Get more information about the available plans of Synapsy Write.",
};

export default async function PricingPage({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const [session, products, subscriptions] = await Promise.all([
    getSession(),
    getActiveProductsWithPrices(),
    getSubscriptions(),
  ]);

  return (
    <main className="mt-2 min-h-full pb-16 sm:mt-16 sm:pb-0">
      <Pricing
        session={session}
        products={products}
        subscriptions={subscriptions}
        user={session?.user}
        lng={lng}
      />
    </main>
  );
}
