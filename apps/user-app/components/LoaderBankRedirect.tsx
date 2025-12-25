import { Loader2, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useRef, useState } from "react"
import { createOnRampTransaction } from "@/app/lib/actions/createOnrampTransaction"

import PaymentStatus from "./PaymentStatus"


export default function RedirectingScreen({ bank, amount, user }: any) {
    const paymentId = useRef<string | number>(0)
    const [done, setDone] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState({ status: "progress", done: false })

    useEffect(() => {
        async function redirectToBank() {
            const baseUrl = bank.redirectUrl;

            const { id, message } = await createOnRampTransaction(bank.id, +amount, `onRamp_${Math.floor(Math.random() * 100)}`)
            const token = `${id}`
            console.log(id)
            if (token) {

                const queryParams = {
                    token,
                    userId: user.id,
                    amount,
                };
                const url = new URL(baseUrl);

                Object.entries(queryParams).forEach(([key, value]) => {
                    url.searchParams.append(key, value);
                });
                if (id) {
                    paymentId.current = + id

                }
                return url
            }


        }
        redirectToBank().then(url => {
            setDone(true)
            window.open(url?.toString(), "_blank");
        })

    }, [])
    useEffect(() => {
        if (done) {
            let count = 0
            const poll = setInterval(async () => {
                const res = await fetch(`/api/payment-verify/?tid=${paymentId.current}`);
                const { paymentStatus, success } = await res.json();


                if (success) {
                    clearInterval(poll);
                    setPaymentStatus({ status: paymentStatus, done: true })
                }
                if (count === 3) {
                    clearInterval(poll)
                    setPaymentStatus({ status: paymentStatus, done: true })
                }
                count++
            }, 10000);

        }
    }, [done])
    if (paymentStatus.done) {
        return <PaymentStatus status={paymentStatus.status} />
    }
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 absolute top-4">
            <Card className="w-[430px] rounded-2xl shadow-lg">
                <CardContent className="flex flex-col items-center gap-4 py-8">

                    {/* Loader */}
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />

                    {/* Heading */}
                    <h2 className="text-lg font-semibold">
                        {done ? 'Payment is in progess on bank portal' : 'Redirecting to Bank Portal'}
                    </h2>

                    {/* Subtext */}
                    <p className="text-sm text-muted-foreground text-center">
                        Please wait for bank
                        to complete the payment.
                    </p>

                    {/* Info Box */}
                    <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        Do not close or refresh this tab
                    </div>


                    <p className="text-xs text-muted-foreground">
                        {"In Progress"}
                    </p>


                </CardContent>
            </Card>
        </div>
    )
}
