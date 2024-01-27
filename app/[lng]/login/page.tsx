import LoginPage from "./auth";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export default async function SignIn({
  params: { lng },
}: {
  params: { lng: any };
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/me");
  }
  return <LoginPage lng={lng} />;
}
