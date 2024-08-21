import {
  getProducts,
  getSubscriptions,
  getUser,
  getUserDetails,
  setUserQuotas,
} from "@/utils/supabase/queries";
import Create from "./create";
import { createClient } from "@/utils/supabase/server";

export default async function CreatePage({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const supabase = createClient();
  const [user, userDetails, products, subscriptions] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase),
    getProducts(supabase),
    getSubscriptions(supabase),
  ]);
  async function getQuotas(): Promise<number> {
    if (!user) return 0;
    if (!userDetails) return 0;
    if (!userDetails.write_gpt4_quota) {
      if (isSubscribed()) {
        const q = getInterval() === "year" ? 120 : 10;
        setUserQuotas(supabase, user.id, q);
        return q;
      }
    }
    return userDetails.write_gpt4_quota || 0;
  }
  function getInterval(): "month" | "year" | "none" {
    if (!user || !subscriptions) return "none";
    for (let i = 0; i < subscriptions?.length; i++) {
      if (
        subscriptions[i].prices?.products?.name?.toLowerCase().includes("write")
      ) {
        return subscriptions[i].prices?.interval === "year" ? "year" : "month";
      }
    }
    return "none";
  }
  function isSubscribed(): boolean {
    if (!user || !subscriptions) return false;
    for (let i = 0; i < subscriptions?.length; i++) {
      if (
        subscriptions[i].prices?.products?.name?.toLowerCase().includes("write")
      ) {
        return true;
      }
    }
    return false;
  }
  const q = await getQuotas();
  return (
    <Create
      products={products}
      subscriptions={subscriptions}
      user={user}
      lng={lng}
      quotas={q}
    />
  );
}
