import bcrypt from "bcrypt";
import db from "@repo/db/client";
export async function POST(req: Request) {
  const { phone, password } = await req.json();

  const existingUser = await db.user.findFirst({
    where: { phone },
  });

  if (existingUser) {
    return Response.json({ error: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      phone,
      password: hashedPassword,
    },
  });

  return Response.json({ success: true });
}
