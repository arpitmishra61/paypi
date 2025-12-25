"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    if (!from) {
        return {
            message: "Error while sending"
        }
    }
    const toUser = await prisma.user.findFirst({
        where: {
            phone: to
        }
    });

    if (!toUser) {
        return {
            message: "User not found"
        }
    }
    try {
        await prisma.$transaction(async (tx) => {
            const fromBalance = await tx.balance.findUnique({
                where: { userId: Number(from) },
            });
            console.log(amount, fromBalance?.amount)
            if (!fromBalance || fromBalance.amount < amount) {
                throw new Error('Insufficient funds');
            }

            await tx.balance.update({
                where: { userId: Number(from) },
                data: { amount: { decrement: amount } },
            });

            await tx.balance.update({
                where: { userId: toUser.id },
                data: { amount: { increment: amount } },
            });

            const senderTx = await tx.appTransaction.create({
                data: {
                    userId: Number(from),
                    amount,
                    type: "P2P",
                    direction: "DEBIT",
                    status: "SUCCESS",
                },
            })

            const rcTx = await tx.appTransaction.create({
                data: {
                    userId: toUser.id,
                    amount,
                    type: "P2P",
                    direction: "CREDIT",
                    status: "SUCCESS",
                },
            })
            console.log(senderTx.id)

            await tx.p2PTransaction.create({
                data: {
                    transactionId: senderTx.id,
                    otherUserId: toUser.id,
                },
            })
            console.log(rcTx.id)
            await tx.p2PTransaction.create({
                data: {
                    transactionId: rcTx.id,
                    otherUserId: Number(from),
                },
            })
        });

        return { done: true }

    }

    catch (err) {
        console.log(err)
        return { done: false }
    }


}