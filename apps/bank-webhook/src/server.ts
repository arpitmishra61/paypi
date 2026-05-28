import express from "express";
import db from "@repo/db/client";
import "dotenv/config";
import cors from "cors";

const app = express();
app.use(express.json());
console.log("hello");
app.use(cors());

app.post("/web-hook", async (req, res) => {
  const { token, userId, amount } = req.body;

  const paymentInformation: Record<"token" | "userId" | "amount", string> = {
    token,
    userId,
    amount,
  };
  console.log(token, userId, amount);
  try {
    console.log(token);
    await db.$transaction([
      db.balance.updateMany({
        where: {
          userId: Number(paymentInformation.userId),
        },
        data: {
          amount: {
            // You can also get this from your DB
            increment: Number(paymentInformation.amount),
          },
        },
      }),
      db.appTransaction.updateMany({
        where: {
          id: +paymentInformation.token,
        },
        data: {
          status: "SUCCESS",
        },
      }),
    ]);

    res.json({
      message: "Captured",
    });
  } catch (e) {
    console.error(e);
    (db.appTransaction.updateMany({
      where: {
        id: +paymentInformation.token,
      },
      data: {
        status: "FAILED",
      },
    }),
      res.status(411).json({
        message: "Error while processing webhook",
      }));
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Webhook Started on port ", PORT);
});
