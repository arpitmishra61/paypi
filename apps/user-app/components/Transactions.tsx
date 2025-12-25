"use client"
import { ArrowDownLeft, ArrowUpRight, CircleAlert, CircleArrowLeftIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getUserTransactions } from "@/app/lib/actions/getTranscations";
import { useEffect, useState } from "react";
import { TransactionSkeleton } from "./skeleton/Transactions";

type Transaction = {
    id: number;
    userId: number;
    amount: number;
    type: "P2P" | "ON_RAMP";
    direction: "DEBIT" | "CREDIT";
    status: "SUCCESS" | "PENDING" | "FAILED";
    createdAt: string; // ISO date string
    onRamp: OnRamp | null;
    p2p: P2P | null;
};

type OnRamp = {
    bankId: 1 | 2;
};

type P2P = {
    id: number;
    transactionId: number;
    otherUserId: number;
    otherUser: {
        name: string;
        phone: string;
    };
};
const banks = { 1: { name: "ICICI Bank" }, 2: { name: "Axis Bank" } }
function getName(t: Transaction) {
    const onRamp = t.onRamp
    return onRamp ? banks[onRamp.bankId].name : t.p2p?.otherUser.name
}

export default function ({ userId, from, to }: { userId: string, from: number, to: number }) {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const totalTransactions = transactions.length
    useEffect(() => {
        getUserTransactions({ userId, from, to }).then(t => setTransactions(t))
    }, [])
    if (!transactions.length) {
        return <TransactionSkeleton count={to - from + 1} />
    }

    return <div>
        <div className="flex items-center justify-between mb-3">
            <p className="font-semibold">Recent Transactions</p>
            <Badge variant="secondary">{to - from + 1}</Badge>
        </div>

        <div className="space-y-3">
            {/* Transaction */}
            {transactions.map((t, count) => {
                const isDebit = t.direction === "DEBIT"
                const isPending = t.status === "PENDING"
                console.log(isPending)

                return <><div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {isDebit ? !isPending ? <div className="rounded-full bg-red-100 p-2 text-red-600">
                            <ArrowUpRight className="h-4 w-4" />
                        </div> : <div className="rounded-full bg-yellow-100 p-2 text-yellow-600">
                            <CircleAlert className="h-4 w-4" />
                        </div> : !isPending ? <div className="rounded-full bg-green-100 p-2 text-green-600">
                            <ArrowDownLeft className="h-4 w-4" />
                        </div> : <div className="rounded-full bg-yellow-100 p-2 text-yellow-600">
                            <CircleAlert className="h-4 w-4" />
                        </div>}

                        <div>
                            <p className="text-sm font-small">{t.direction}</p>
                            <p className="text-xs text-muted-foreground">
                                {(isDebit ? "To " : "From ") + getName(t)}
                            </p>

                        </div>
                    </div>

                    {isDebit ? !isPending ? <p className="text-sm font-semibold text-red-600">
                        -₹{t.amount}
                    </p> : <p className="text-sm font-semibold text-yellow-600">
                        ₹{t.amount} <span className="text-xs text-muted  text-yellow-600">(processing)</span>
                    </p> : !isPending ? <p className="text-sm font-semibold text-green-600">
                        +₹{t.amount}
                    </p> : <p className="text-sm font-semibold text-yellow-600">
                        ₹{t.amount} <span className="text-xs text-muted  text-yellow-600">(processing)</span>
                    </p>
                    }
                </div>
                    {count + 1 < totalTransactions && <Separator />}
                </>
            })}
        </div>
    </div>
}

