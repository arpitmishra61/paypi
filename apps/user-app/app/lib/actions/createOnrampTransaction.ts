"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function createOnRampTransaction(
  bankId: number,
  amount: number,
  token: string
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  console.log(userId);
  if (!session?.user || !userId) {
    return {
      message: "Unauthenticated request",
    };
  }
  const txn = await prisma.appTransaction.create({
    data: {
      userId: +userId,
      amount,
      type: "ON_RAMP",
      direction: "CREDIT",
      status: "PENDING",
    },
  });

  await prisma.onRampTransaction.create({
    data: {
      token,
      transactionId: txn.id,
      bankId,
    },
  });

  return {
    message: "Done the paymeny is in processing state",
    id: txn.id,
  };
}
