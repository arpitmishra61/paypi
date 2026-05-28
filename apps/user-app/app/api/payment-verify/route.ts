import { getServerSession } from "next-auth";
import prisma from "@repo/db/client";
import { authOptions } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions)) as unknown as {
    user: any;
  };
  const { searchParams: params } = new URL(req.url);
  console.log(params.get("tid"));
  if (!session?.user) {
    return NextResponse.json({
      error: true,
      message: "User not authenticated",
      status: 403,
    });
  }
  try {
    const tid = Number(params.get("tid"));
    if (tid) {
      const payment = await prisma.appTransaction.findUnique({
        where: { id: +tid },
        select: {
          status: true,
        },
      });
      console.log(payment);
      if (!payment) {
        return NextResponse.json({ success: false, status: 404 });
      }
      if (payment?.status === "PENDING") {
        return NextResponse.json({
          success: false,
          status: 200,
          paymentStatus: payment?.status,
        });
      } else {
        return NextResponse.json({
          success: true,
          paymentStatus: payment?.status,
          status: 200,
        });
      }
    }
  } catch (error: any) {
    console.error("Payment status error:", error);

    return NextResponse.json(
      { error: true, message: "Internal server error" + error?.message },
      { status: 500 }
    );
  }
}

/* Alternative approach is after verify token just tell the bank make post request that payment is done push the message 
to the message queue don't do db transaction here bcz bank need quick response.
Then a db worker pull msg seq from queue and make db transactions.
Frontend will make a api call (POOL) or web socket (PUB/SUB) to chek the db for transaction done or not
*/
