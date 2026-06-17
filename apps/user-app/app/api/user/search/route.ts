import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import prisma from "@repo/db/client"
import { authOptions } from "../../../lib/auth"

export async function GET(request: Request) {
    const url = new URL(request.url)
    const phone = url.searchParams.get("phone")?.replace(/\D/g, "") || ""

    if (!phone) {
        return NextResponse.json({ users: [] })
    }

    const session = await getServerSession(authOptions)
    const currentUserId = session?.user?.id ? Number(session.user.id) : undefined

    const users = await prisma.user.findMany({
        where: {
            phone: { startsWith: phone },
            ...(currentUserId ? { id: { not: currentUserId } } : {}),
        },
        select: {
            id: true,
            name: true,
            phone: true,
        },
        orderBy: {
            phone: "asc",
        },
        take: 5,
    })
    console.log("Found users:", users)

    return NextResponse.json({ users })
}
