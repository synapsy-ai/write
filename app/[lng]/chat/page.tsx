import Chat from "./chat";
import React from "react";
import type { Metadata } from "next";
import {
  getUser,
  getSubscriptions,
  getUserDetails,
  setUserQuotas,
} from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Chat",
  description:
    "Chat with Synapsy Assistant to improve your documents or get information about them.",
};
export default async function ChatPage({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const supabase = createClient();
  const [user, userDetails, subscriptions] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase),
    getSubscriptions(supabase),
  ]);
  async function getQuotas(): Promise<number> {
    if (!user) return 0;
    if (!userDetails) return 0;
    if (!userDetails?.write_gpt4_quota) {
      if (isSubscribed()) {
        const q = getInterval() === "year" ? 120 : 10;
        setUserQuotas(supabase, userDetails.id, q);
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
    <Chat
      session={user}
      products={products}
      subscriptions={subscriptions}
      user={user?.user}
      lng={lng}
      quotas={q}
    />
  );
}
