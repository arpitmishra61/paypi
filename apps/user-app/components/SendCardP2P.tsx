"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { Phone } from "lucide-react"
import { p2pTransfer } from "@/app/lib/actions/p2pTransfer"
import { redirect } from "next/dist/server/api-utils"

export function SendMoneyTab() {
    const [phone, setPhone] = useState("")
    const [country, setCountry] = useState("+91")
    const [amount, setAmount] = useState("")
    const [error, setError] = useState("")

    const currentBalance = 12450 // ₹ current balance
    const numericAmount = Number(amount.replace(/,/g, "")) || 0

    function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
        // Remove non-numeric characters
        let value = e.target.value.replace(/\D/g, "")
        if (value.length > 10) value = value.slice(0, 10)
        setPhone(value)
    }

    function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
        let value = e.target.value.replace(/\D/g, "")
        if (Number(value) > currentBalance) {
            setError("Insufficient balance")
            value = currentBalance.toString()

            setTimeout(() => setError(""), 5000)
        }
        const formatted = Number(value).toLocaleString("en-IN")
        setAmount(formatted)
    }

    const isPhoneValid = phone.length === 10
    const isAmountValid = numericAmount > 0 && numericAmount <= currentBalance
    const canPay = isPhoneValid && isAmountValid

    return (
        <div className="space-y-6">
            {/* Phone Input */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <div className="flex gap-2">
                    <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="+91">🇮🇳 India</SelectItem>
                            <SelectItem value="+1">🇺🇸 US</SelectItem>
                            <SelectItem value="+1c">🇨🇦 Canada</SelectItem>
                            <SelectItem value="+44">🇬🇧 UK</SelectItem>
                            <SelectItem value="+49">🇩🇪 Germany</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                        </span>
                        <Input
                            className="pl-10"
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={handlePhoneChange}
                        />
                    </div>
                </div>
                {!isPhoneValid && phone.length > 0 && (
                    <p className="text-xs text-red-500">Phone number must be 10 digits</p>
                )}
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        ₹
                    </span>
                    <Input
                        className="pl-7"
                        placeholder="0"
                        value={amount}
                        onChange={handleAmountChange}
                    />
                </div>

                {error && (
                    <p className="text-xs text-red-500">{error}</p>
                )}

                <p className="text-xs text-muted-foreground">
                    Current Balance: ₹{currentBalance.toLocaleString("en-IN")}
                </p>
            </div>

            {/* Pay Button */}
            <Button className="w-full" disabled={!canPay} onClick={async () => {
                const res = await p2pTransfer(phone, numericAmount)
                if (res.done) {
                    console.log("done")
                    location.reload()
                }
            }}>
                Pay
            </Button>
        </div>
    )
}
