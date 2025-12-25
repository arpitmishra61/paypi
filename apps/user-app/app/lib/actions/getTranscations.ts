"use server";
import db from "@repo/db/client";

export async function getUserTransactions({
  userId,
  from,
  to,
}: any): Promise<any> {
  const take = to - from + 1; // number of transactions to fetch
  const skip = from - 1;
  const transactions = await db.appTransaction.findMany({
    where: { userId: +userId },
    orderBy: { createdAt: "desc" },
    include: {
      onRamp: { select: { bankId: true } },
      p2p: { include: { otherUser: { select: { name: true, phone: true } } } },
    },
    take,
    skip,
  });
  return transactions;
}
