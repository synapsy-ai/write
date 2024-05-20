import {
  getActiveProductsWithPrices,
  getSession,
  getSubscriptions,
  getUserDetails,
  setUserQuotas,
} from "@/app/supabase-server";
import Chat from "./chat";
import React from "react";

export default async function ChatPage({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const [session, products, subscriptions] = await Promise.all([
    getSession(),
    getActiveProductsWithPrices(),
    getSubscriptions(),
  ]);
  async function getQuotas(): Promise<number> {
    if (!session || !session.user) return 0;
    const user = await getUserDetails();
    if (!user) return 0;
    if (!user?.write_gpt4_quota) {
      if (isSubscribed()) {
        const q = getInterval() === "year" ? 120 : 10;
        setUserQuotas(user.id, q);
        return q;
      }
    }
    return user.write_gpt4_quota || 0;
  }
  function getInterval(): "month" | "year" | "none" {
    if (!session || !subscriptions) return "none";
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
    if (!session || !subscriptions) return false;
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
    <Chat
      session={session}
      products={products}
      subscriptions={subscriptions}
      user={session?.user}
      lng={lng}
      quotas={q}
    />
  );
}
