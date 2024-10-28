import { createClient } from "./supabase/client";

export default async function updateQuotas(q: number, id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("users")
    .update({ write_gpt4_quota: q })
    .eq("id", id);
  if (error) throw error;
}
