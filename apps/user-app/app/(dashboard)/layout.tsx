import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import prisma from "@repo/db/client";
import { Providers } from "./../provider";
import { redirect } from "next/navigation";


export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  async function getBalance() {

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      redirect("/signin")
    }
    const balance = await prisma.balance.findFirst({
      where: {
        userId: Number(session?.user?.id)
      }
    });
    return {
      amount: balance?.amount || 0,
      //locked: balance?.locked || 0
    }
  }
  const [user, balance] = await Promise.all([
    getServerSession(authOptions),
    getBalance(),
  ]);

  return (
    <Providers user={user} balance={balance}>
      <div className="min-h-screen flex items-center justify-center">

        {children}
      </div>
    </Providers>
  );
}

