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
  /*call to bank api to get the token provide amount-user-id-secret token 
  secret token verifies on bank side that wallet is registered to bank 
  it gives token and redirect url and a secret token so wallet can verify it is coming from same source.
  Token should be passed as a cookie or as query param along with redirect url.

  So when user on bank-page and login or signIn with the help of this token bank verify that session is created for token 
  or not nad this is valid request extract amount and payment details and do the payment then call the webhook
  */
  const resBank = (await new Promise((res) => {
    setTimeout(
      () =>
        res({
          secretToken: "pay-pi",
          rUrl: "/",
          token: "",
        }),
      2000
    );
  })) as Record<"secretToken" | "rUrl" | "token", string>;
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
    rUrl: resBank.rUrl,
    token: resBank.rUrl,
    secretToken: "pay-pi-bank",
  };
}
