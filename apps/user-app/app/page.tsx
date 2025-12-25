
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./lib/auth";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const user = session?.user

  if (user) {
    redirect("/dashboard")
  }
  return redirect("/signup")
}
