"use client"
import { ArrowDownLeft, ArrowUpRight, CircleAlert, Loader2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getUserTransactions } from "@/app/lib/actions/getTranscations";
import { useEffect, useState } from "react";
import Image from "next/image";
import axisLogo from "@/logo/axis.jpg"
import iciciLogo from "@/logo/icici.png"
import { Card } from "@repo/ui/card";
import { Button } from "@/components/ui/button";


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
const banks = { 1: { name: "ICICI Bank", img: iciciLogo, alt: "icici-logo" }, 2: { name: "Axis Bank", img: axisLogo, alt: "axis-logo" } }
function getName(t: Transaction) {
    const onRamp = t.onRamp
    if (onRamp) {
        const bank = banks[onRamp.bankId]
        return <>{bank.name}{<Image src={bank.img} alt={bank.alt} width={16} height={16}></Image>}</>
    }

    return t.p2p?.otherUser.name ?? "Unknown"
}

export default function ({ userId, from, to }: { userId: string, from: number, to: number }) {
    const [transactions, setTransactions] = useState<Transaction[] | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const totalTransactions = transactions?.length

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const t = await getUserTransactions({ userId, from, to })
                setTransactions(t || [])
            } catch (error) {
                console.error(error)
                setTransactions([])
            } finally {
                setIsLoading(false)
                setIsInitialLoad(false)
            }
        }
        fetchTransactions()
    }, [])

    const handleRefresh = async () => {
        setIsLoading(true)
        try {
            const t = await getUserTransactions({ userId, from, to })
            setTransactions(t || [])
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading && isInitialLoad) {
        return (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <p className="text-sm text-muted-foreground">Fetching transactions...</p>
            </div>
        )
    }

    if (!transactions) {
        return (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
                <p className="text-sm text-muted-foreground">Click refresh to load transactions</p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    className="gap-2"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </Button>
            </div>
        )
    }

    if (transactions?.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
                <p className="text-sm font-small text-muted-foreground">No transactions yet</p>
            </div>
        )
    }

    return <div>
        <div className="flex items-center justify-between mb-3">
            <p className="font-semibold">Recent Transactions</p>
            <div className="flex items-center gap-2">
                <Badge variant="secondary">{totalTransactions}</Badge>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="h-auto p-1"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
            </div>
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
                            <p className="text-xs text-muted-foreground flex gap-1">
                                <>{(isDebit ? "To " : "From ")} {getName(t)}</>
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

