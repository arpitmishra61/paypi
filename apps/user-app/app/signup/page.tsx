"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"


export default function SignupWizard() {
    const [step, setStep] = useState(1)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [otp, setOtp] = useState("")

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 4))
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

    const banks = [
        { id: "axis", name: "Axis Bank", logo: "https://vectorseek.com/wp-content/uploads/2021/12/Axis-Bank-Logo-Vector.png" },
        { id: "icici", name: "ICICI Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg" },
    ]

    return (
        <div className="flex items-center justify-center h-screen" >
            <div className="max-w-sm mx-auto p-6 space-y-6 border rounded-lg shadow">
                <div className="flex items-center gap-0.5 text-xl font-bold">
                    <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center">
                        P
                    </div>
                    ayPi
                </div>
                {/* Step Progress: small rectangles */}
                <div className="flex justify-between mb-6">
                    {[1, 2, 3, 4].map((s) => (
                        <div
                            key={s}
                            className={`h-2 flex-1 mx-1 rounded-sm ${step >= s ? "bg-gray-500" : "bg-gray-200"
                                }`}
                        ></div>
                    ))}
                </div>

                {/* Step Content */}
                {step === 1 && (
                    <div className="space-y-4">
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="👤 Name"
                        />
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="📧 Email"
                        />
                        <Input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="📱 Phone Number"
                        />

                        <Button onClick={nextStep} className="w-full mt-4">
                            Next
                        </Button>
                        <Card className="max-w-md mx-auto text-center">
                            <CardContent className="pt-6 space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Already have an account ?
                                </p>
                                <Button asChild variant="link" className="p-0">
                                    <Link href="/signin">Login</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            OTP sent to {email} and {phone}
                        </p>
                        <Input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="✔ Enter OTP"
                        />
                        <div className="flex justify-between mt-4">
                            <Button variant="secondary" onClick={prevStep}>
                                Back
                            </Button>
                            <Button onClick={nextStep}>Next</Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            The phone number is associated with the following banks:
                        </p>
                        <div className="flex gap-4 mt-2">
                            {banks.map((b) => (
                                <div
                                    key={b.id}
                                    className="flex flex-col items-center gap-1 p-2 border rounded-lg w-24"
                                >
                                    <img src={b.logo} alt={b.name} className="h-8 object-contain" />
                                    <p className="text-sm font-medium">{b.name}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4">
                            <Button variant="secondary" onClick={prevStep}>
                                Back
                            </Button>
                            <Button onClick={nextStep}>Next</Button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="flex flex-col items-center space-y-4">
                        <p className="font-semibold text-lg text-center">All Set!</p>
                        <p className="text-sm text-muted-foreground text-center">
                            Your wallet is ready to use.
                        </p>
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-6 h-6 text-white" />
                        </div>
                        <Button className="w-full mt-2" onClick={() => { location.href = "/dashboard" }}>
                            Start Using Wallet
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
