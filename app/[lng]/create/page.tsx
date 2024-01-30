import Create from "./create";
import {
  getActiveProductsWithPrices,
  getSession,
  getSubscriptions,
} from "@/app/supabase-server";
import NoSession from "./no-session";
import BuySubscription from "./buy-subscription";

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
  if (!session) {
    return <NoSession lng={lng} />;
  }

  if (!subscriptions || subscriptions.length < 1) {
    return (
      <BuySubscription
        session={session}
        products={products}
        subscriptions={subscriptions}
        lng={lng}
      />
    );
  }
  for (let i = 0; i < subscriptions?.length; i++) {
    if (
      !subscriptions[i].prices?.products?.name
        ?.toString()
        .toLowerCase()
        .includes("write")
    ) {
      return (
        <BuySubscription
          session={session}
          products={products}
          subscriptions={subscriptions}
          lng={lng}
        />
      );
    }
  }

  return <Create lng={lng} />;
}
