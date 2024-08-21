import { redirect } from "next/navigation";

export default function SignIn() {
  return redirect(`/signin/password_signin`);
}
