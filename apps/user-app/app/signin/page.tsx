"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react";
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"



export default function () {

    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        await signIn("credentials", {
            phone: formData.get("phone"),
            password: formData.get("password"),
            callbackUrl: "/dashboard",
        });
    }


    return (
        <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-center h-screen" >
                <div className="max-w-sm mx-auto p-6 space-y-6 border rounded-lg shadow">
                    <div className="flex items-center gap-0.5 text-xl font-bold">
                        <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center">
                            P
                        </div>
                        ayPi
                    </div>

                    <div className="space-y-4">
                        <Input
                            type="tel"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="📱 Phone Number"
                        />
                        <Input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="🔑 Password"
                        />

                        <Button className="w-full mt-4" type="submit">
                            SignIn
                        </Button>
                    </div>
                    <Card className="max-w-md mx-auto text-center">
                        <CardContent className="pt-6 space-y-4">
                            <p className="text-sm text-muted-foreground">
                                You are not registered?
                            </p>
                            <Button asChild variant="link" className="p-0">
                                <Link href="/signup">Register</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

            </div>


        </form>
    )
}
