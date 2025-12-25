
import { authOptions } from "@/app/lib/auth"
import { AddMoneyTab } from "@/components/AddMoneyTab"
import { DashboardTab } from "@/components/Dashboard"
import { ProfileTab } from "@/components/Profile"
import { SendMoneyTab } from "@/components/SendCardP2P"
import Transactions from "@/components/Transactions"
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs"
import {
    LayoutDashboard,
    Wallet,
    Send,
    ArrowLeftRight,
    User,
} from "lucide-react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";

export default async function WalletCard() {
    const session = await getServerSession(authOptions);
    if (!session.user) {
        redirect("/signin")
    }

    return (
        <Card className="w-[480px] rounded-2xl shadow-lg dashboard">
            {/* Logo */}
            <CardHeader className="flex items-center justify-center py-1">
                <div className="flex items-center gap-0.5 text-xl font-bold">
                    <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center">
                        P
                    </div>
                    ayPi
                </div>
            </CardHeader>

            <CardContent>
                <Tabs defaultValue="dashboard" className="w-full">
                    {/* Tabs */}
                    <TabsList className="grid grid-cols-5 mb-4">
                        <TabsTrigger value="dashboard" className="flex gap-1">
                            <LayoutDashboard className="h-4 w-4" />
                        </TabsTrigger>

                        <TabsTrigger value="topup" className="flex gap-1">
                            <Wallet className="h-4 w-4" />
                        </TabsTrigger>

                        <TabsTrigger value="pay" className="flex gap-1">
                            <Send className="h-4 w-4" />
                        </TabsTrigger>

                        <TabsTrigger value="transactions" className="flex gap-1">
                            <ArrowLeftRight className="h-4 w-4" />
                        </TabsTrigger>
                        <TabsTrigger value="profile" className="flex gap-1">
                            <User className="h-4 w-4" />
                        </TabsTrigger>
                    </TabsList>

                    {/* Content */}
                    <TabsContent value="dashboard">
                        <DashboardTab />
                    </TabsContent>

                    <TabsContent value="topup">
                        <AddMoneyTab />
                    </TabsContent>

                    <TabsContent value="pay">
                        <SendMoneyTab />
                    </TabsContent>

                    <TabsContent value="transactions">
                        <Transactions from={1} to={4} userId={session.user.id} />
                    </TabsContent>
                    <TabsContent value="profile">
                        <ProfileTab />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
