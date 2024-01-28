import { redirect } from "next/navigation";
import Create from "./create";
import { getSession } from "@/app/supabase-server";
import NoSession from "./no-session";

export default async function CreatePage({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const [session] = await Promise.all([getSession()]);

  if (!session) {
    return <NoSession lng={lng} />;
  }
  return <Create lng={lng} />;
}
