"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"

export default function PaymentStatus({ status }: any) {
    const [count, setCount] = useState(10)
    const router = useRouter()

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(prev => prev - 1)
        }, 1000)

        if (count <= 0) {
            clearInterval(interval)
            location.reload()
        }

        return () => clearInterval(interval)
    }, [count, router])
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/95 px-4 absolute top-0">
            <Card className=" w-[400px] text-center py-8 shadow-lg rounded-xl">
                {status === "SUCCESS" ? <CardContent className="flex flex-col items-center gap-4">

                    <CheckCircle2 className="h-12 w-12 text-green-600" />

                    <h2 className="text-2xl font-semibold">
                        Payment Successful!
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Congratulations 🎉 Your payment was processed successfully.
                    </p>

                    <p className="text-sm font-medium text-primary">
                        Redirecting to home in {count}…
                    </p>

                </CardContent> : <CardContent className="flex flex-col items-center gap-4">

                    {/* Loader Icon */}
                    <Loader2 className="h-12 w-12 text-yellow-500 animate-spin" />

                    {/* Heading */}
                    <h2 className="text-2xl font-semibold text-yellow-600">
                        Payment Pending
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground">
                        Your bank is taking time,  payment is still being processed.
                    </p>

                    {/* Help text / instructions */}
                    <p className="text-xs text-muted-foreground">
                        We’re checking the status with the bank will inform you.
                    </p>
                    <p className="text-sm font-medium text-primary">
                        Redirecting to home in {count}…
                    </p>


                </CardContent>}
            </Card>
        </div>
    )
}
