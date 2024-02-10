import Create from "./create";
import {
  getActiveProductsWithPrices,
  getSession,
  getSubscriptions,
} from "@/app/supabase-server";
import NoSession from "./no-session";
import BuySubscription from "./buy-subscription";
import SiteFooter from "@/components/footer";

export default async function CreatePage({
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
    <Create
      session={session}
      products={products}
      subscriptions={subscriptions}
      user={session?.user}
      lng={lng}
    />
  );
}
