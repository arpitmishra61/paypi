"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { Phone, CheckCircle2, Loader2 } from "lucide-react"
import { p2pTransfer } from "@/app/lib/actions/p2pTransfer"

type SuggestedUser = {
    id: number
    name: string | null
    phone: string
}

export function SendMoneyTab() {
    const [phone, setPhone] = useState("")
    const [country, setCountry] = useState("+91")
    const [amount, setAmount] = useState("")
    const [error, setError] = useState("")
    const [suggestions, setSuggestions] = useState<SuggestedUser[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [ignoreNextSearch, setIgnoreNextSearch] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [transferStatus, setTransferStatus] = useState<"idle" | "pending" | "success" | "failed">("idle")
    const [statusMessage, setStatusMessage] = useState("")
    const [redirectSeconds, setRedirectSeconds] = useState(4)
    const controllerRef = useRef<AbortController | null>(null)

    const currentBalance = 12450 // ₹ current balance
    const numericAmount = Number(amount.replace(/,/g, "")) || 0

    function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
        let value = e.target.value.replace(/\D/g, "")
        if (value.length > 10) value = value.slice(0, 10)
        setIgnoreNextSearch(false)
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

    useEffect(() => {
        if (ignoreNextSearch) {
            setShowSuggestions(false)
            setIsSearching(false)
            setSuggestions([])
            return
        }

        if (phone.length < 3) {
            setSuggestions([])
            setShowSuggestions(false)
            setIsSearching(false)
            return
        }

        const timer = window.setTimeout(() => {
            controllerRef.current?.abort()
            const controller = new AbortController()
            controllerRef.current = controller

            setIsSearching(true)
            fetch(`/api/user/search?phone=${encodeURIComponent(phone)}`, {
                signal: controller.signal,
            })
                .then(async (response) => {
                    if (!response.ok) {
                        throw new Error("Unable to fetch users")
                    }
                    return response.json()
                })
                .then((data) => {
                    setSuggestions(data.users || [])
                    setShowSuggestions(true)
                })
                .catch((err) => {
                    if (err.name !== "AbortError") {
                        console.error(err)
                        setSuggestions([])
                        setShowSuggestions(false)
                    }
                })
                .finally(() => {
                    setIsSearching(false)
                })
        }, 300)

        return () => {
            window.clearTimeout(timer)
            controllerRef.current?.abort()
        }
    }, [phone, ignoreNextSearch])

    function handleSuggestionClick(user: SuggestedUser) {
        setPhone(user.phone)
        setSuggestions([])
        setShowSuggestions(false)
        setIgnoreNextSearch(true)
    }

    const isPhoneValid = phone.length === 10
    const isAmountValid = numericAmount > 0 && numericAmount <= currentBalance
    const canPay = isPhoneValid && isAmountValid

    useEffect(() => {
        if (transferStatus !== "success") {
            return
        }

        if (redirectSeconds <= 0) {
            window.location.href = "/dashboard"
            return
        }

        const timer = window.setTimeout(() => {
            setRedirectSeconds((prev) => prev - 1)
        }, 1000)

        return () => {
            window.clearTimeout(timer)
        }
    }, [redirectSeconds, transferStatus])

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

                        {showSuggestions && (
                            <div className="absolute left-0 right-0 z-10 mt-1 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
                                {isSearching ? (
                                    <div className="p-3 text-sm text-slate-500">Searching users...</div>
                                ) : suggestions.length > 0 ? (
                                    suggestions.map((user) => (
                                        <button
                                            key={user.id}
                                            type="button"
                                            className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                            onClick={() => handleSuggestionClick(user)}
                                        >
                                            <span>{user.name ?? "Unknown user"}</span>
                                            <span className="text-xs text-slate-500">{user.phone}</span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-3 text-sm text-slate-500">No users found</div>
                                )}
                            </div>
                        )}
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
            <Button
                className="w-full"
                disabled={!canPay || isSubmitting}
                onClick={async () => {
                    setError("")
                    setStatusMessage("")
                    setTransferStatus("pending")
                    setIsSubmitting(true)
                    setRedirectSeconds(4)

                    try {
                        const res = await p2pTransfer(phone, numericAmount)
                        if (res.done) {
                            setTransferStatus("success")
                            setStatusMessage("Payment successful! Redirecting to dashboard...")
                        } else {
                            setTransferStatus("failed")
                            setStatusMessage(res.message || "Payment failed. Please try again.")
                        }
                    } catch (err) {
                        console.error(err)
                        setTransferStatus("failed")
                        setStatusMessage("Payment failed. Please try again.")
                    } finally {
                        setIsSubmitting(false)
                    }
                }}
            >
                {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Paying...
                    </span>
                ) : (
                    "Pay"
                )}
            </Button>

            {transferStatus === "pending" && (
                <div className="mt-3 flex items-center gap-2 text-sm text-sky-600">
                    <Loader2 className="h-4 w-4 animate-spin text-sky-500" />
                    <span>Payment is in progress...</span>
                </div>
            )}

            {transferStatus === "success" && (
                <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span>{statusMessage}</span>
                    <span className="font-medium">Redirecting in {redirectSeconds}s</span>
                </div>
            )}

            {transferStatus === "failed" && (
                <div className="mt-3 text-sm text-red-500">{statusMessage}</div>
            )}
        </div>
    )
}
