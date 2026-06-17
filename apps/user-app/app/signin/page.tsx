"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react";
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"



export default function () {
    const router = useRouter()
    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget);

        const result = await signIn("credentials", {
            phone: formData.get("phone"),
            password: formData.get("password"),
            redirect: false
        });

        if (result?.error) {
            setError("Invalid phone number or password")
            setLoading(false)
        } else if (result?.ok) {
            router.push("/dashboard")
        } else {
            setError("Authentication failed. Please try again.")
            setLoading(false)
        }
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
                        {error && (
                            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}
                        <Input
                            type="tel"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="📱 Phone Number"
                            disabled={loading}
                        />
                        <Input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="🔑 Password"
                            disabled={loading}
                        />

                        <Button className="w-full mt-4" type="submit" disabled={loading}>
                            {loading ? "Signing in..." : "SignIn"}
                        </Button>
                    </div>
                    <Card className="max-w-md mx-auto text-center">
                        <CardContent className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                                You are not registered?
                            </p>
                            <Button asChild variant="link" className="p-0">
                                <Link href="/signup">Register</Link>

                            </Button>
                            <br />

                            <Button className="p-2 cursor-pointer" variant={"link"} onClick={async (e) => {
                                e.preventDefault()
                                setLoading(true)
                                setError("")
                                const result = await signIn("credentials", {
                                    phone: "1111111111",
                                    password: "password123",
                                    redirect: false
                                });
                                if (result?.error) {
                                    setError("Invalid credentials")
                                    setLoading(false)
                                } else if (result?.ok) {
                                    router.push("/dashboard")
                                } else {
                                    setError("Authentication failed")
                                    setLoading(false)
                                }
                            }} disabled={loading}>
                                Login As Guest (For Testing)
                            </Button>
                        </CardContent>
                    </Card>
                </div>

            </div>


        </form>
    )
}
