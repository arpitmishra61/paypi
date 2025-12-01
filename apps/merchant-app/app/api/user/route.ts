import { NextResponse } from "next/server";
import db from "@repo/db/client";
import "dotenv/config";

export const GET = async () => {
  try {
    async function find() {
      const user = await db.user.findMany({
        where: { email: "as@g.com" },
      });
      return user;
    }

    let user = await find();
    return NextResponse.json({
      message: JSON.stringify(user[0]),
    });
  } catch (err) {
    console.log("ERROR ", err);
    return NextResponse.json({
      message: "ERROR",
    });
  }
};
