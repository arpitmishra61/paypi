"use client"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import Transactions from "./Transactions"
import { useBalance } from "@repo/store/useBalance"
import { useUser } from "@repo/store/useUser"
export function DashboardTab() {
    const balance = useBalance() as unknown as { amount: string }
    const { user } = useUser() as unknown as {
        user: { name: string, email: string, id: string }
    }

    return (
        <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>

                <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {user.email}
                    </p>
                </div>
            </div>

            {/* Balance Card */}
            <div className="rounded-xl bg-gradient-to-r from-black to-gray-800 p-5 text-white">
                <p className="text-sm opacity-80">Current Balance</p>
                <p className="text-3xl font-bold mt-1">₹{Number(balance.amount).toLocaleString("en-IN")}</p>
            </div>

            {/* Recent Transactions */}
            <Transactions userId={user.id} from={1} to={2} />
        </div>
    )
}
