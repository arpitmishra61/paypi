"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react";

export function ProfileTab() {
    const [name, setName] = useState("John Doe")
    const [email, setEmail] = useState("john@example.com")
    const [phone, setPhone] = useState("9876543210")
    const [isEditing, setIsEditing] = useState(false)

    const handleEditToggle = () => setIsEditing(!isEditing)
    const handleSave = () => {
        console.log({ name, email, phone })
        alert("Profile updated!")
        setIsEditing(false)
    }

    return (
        <div className="max-w-xl mx-auto p-4 space-y-4">
            {/* Profile Avatar */}
            <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                    <p className="text-lg font-semibold">{name}</p>
                    <p className="text-sm text-muted-foreground">{email}</p>
                </div>

            </div>
            <Button className="bg-red-600 text-white" onClick={() => signOut({ callbackUrl: "/signin" })}>
                Logout
            </Button>

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={!isEditing}
                    />
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 justify-end">
                {!isEditing ? (
                    <Button onClick={handleEditToggle}>Edit</Button>
                ) : (
                    <>
                        <Button variant="secondary" onClick={handleEditToggle}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Apply Changes</Button>
                    </>
                )}
            </div>
        </div>
    )
}
