"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import NumberToWords from "./NumberToWord"
import { useBalance } from "@repo/store/useBalance"
import { useUser } from "@repo/store/useUser"
import RedirectingScreen from "./LoaderBankRedirect"

export function AddMoneyTab() {
    const [amount, setAmount] = useState("")
    const { amount: balance } = useBalance() as unknown as { amount: string }
    const [redirect, setRedirect] = useState(false)


    const SUPPORTED_BANKS = useMemo(() => ({
        "icici": {
            name: "ICICI Bank",
            redirectUrl: "http://localhost:3002/",
            img: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg",
            val: "icici",
            id: 1
        },
        "axis": {
            name: "Axis Bank",
            redirectUrl: "http://localhost:3003/",
            img: "https://vectorseek.com/wp-content/uploads/2021/12/Axis-Bank-Logo-Vector.png",
            val: "axis",
            id: 2
        }
    }), []);
    const [bank, setBank] = useState(SUPPORTED_BANKS["icici"])
    const [error, setError] = useState("")
    const { user } = useUser() as unknown as {
        user: { name: string, email: string, id: string }
    }

    const numericAmount = Number(amount.replace(/,/g, "")) || 0

    function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
        let value = e.target.value.replace(/\D/g, "")

        if (Number(value) > 100000) {
            setError("Maximum amount allowed is ₹1,00,000")
            value = "100000"

            setTimeout(() => {
                setError("")
            }, 5000)
        }

        const formatted = Number(value).toLocaleString("en-IN")
        setAmount(formatted)
    }

    return (
        <div className="space-y-6">

            {/* Current Balance */}
            <div className="text-sm text-muted-foreground">
                Current Balance:{" "}
                <span className="font-medium text-foreground">₹{Number(balance).toLocaleString("en-IN")}</span>
            </div>

            {/* Bank Selection */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Select Bank</label>

                <Select value={bank?.val} onValueChange={(val: "icici" | "axis") => {
                    setBank(SUPPORTED_BANKS[val])
                }}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="icici">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg"
                                alt="ICICI"
                                className="h-4"
                            />
                        </SelectItem>
                        <SelectItem value="axis">
                            <img
                                src="https://vectorseek.com/wp-content/uploads/2021/12/Axis-Bank-Logo-Vector.png"
                                alt="Axis"
                                className="h-6"
                            />

                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Amount Input */}
            <div className="space-y-1">
                <label className="text-sm font-medium">
                    Enter Amount
                </label>

                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        ₹
                    </span>
                    <Input
                        className="pl-7 text-lg"
                        placeholder="0"
                        value={amount}
                        onChange={handleAmountChange}
                    />
                </div>

                {/* Error message */}
                {error && (
                    <p className="text-xs text-red-500">
                        {error}
                    </p>
                )}

                {/* Amount in words */}
                <NumberToWords amount={numericAmount} />

                <p className="text-xs text-muted-foreground">
                    Max limit ₹1,00,000
                </p>
            </div>

            {/* Add Money Button */}
            <Button
                className="w-full"
                disabled={numericAmount === 0}
                onClick={() => {
                    setRedirect(true)
                }}
            >
                Add Money
            </Button>
            {redirect && <RedirectingScreen amount={amount} user={user} bank={bank} />}
        </div >
    )
}
