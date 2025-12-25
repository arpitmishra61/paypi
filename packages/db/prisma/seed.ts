import prisma from "@repo/db/client";

async function main() {
  // Clear existing data (order matters because of relations)
  await prisma.p2PTransaction.deleteMany();
  await prisma.onRampTransaction.deleteMany();
  await prisma.appTransaction.deleteMany();
  await prisma.balance.deleteMany();
  await prisma.user.deleteMany();
  await prisma.bank.deleteMany();

  // Create users
  const alice = await prisma.user.create({
    data: {
      email: "alice@test.com",
      name: "Alice",
      phone: "1111111111",
      password: "password123",
      balance: {
        create: { amount: 10000 },
      },
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: "bob@test.com",
      name: "Bob",
      phone: "2222222222",
      password: "password123",
      balance: {
        create: { amount: 5000 },
      },
    },
  });

  // Create bank
  const bank = await prisma.bank.create({
    data: {
      name: "Demo Bank",
      logoUrl: "https://example.com/logo.png",
    },
  });

  // ---------- ON RAMP TRANSACTIONS ----------

  const onRampTx1 = await prisma.appTransaction.create({
    data: {
      userId: alice.id,
      amount: 3000,
      type: "ON_RAMP",
      direction: "CREDIT",
      status: "SUCCESS",
    },
  });

  await prisma.onRampTransaction.create({
    data: {
      transactionId: onRampTx1.id,
      bankId: bank.id,
      token: "onramp_token_1",
    },
  });

  const onRampTx2 = await prisma.appTransaction.create({
    data: {
      userId: bob.id,
      amount: 2000,
      type: "ON_RAMP",
      direction: "CREDIT",
      status: "SUCCESS",
    },
  });

  await prisma.onRampTransaction.create({
    data: {
      transactionId: onRampTx2.id,
      bankId: bank.id,
      token: "onramp_token_2",
    },
  });

  // ---------- P2P TRANSACTIONS ----------

  // Alice sends money to Bob
  const p2pTx1 = await prisma.appTransaction.create({
    data: {
      userId: alice.id, // sender
      amount: 500,
      type: "P2P",
      direction: "DEBIT",
      status: "SUCCESS",
    },
  });

  await prisma.p2PTransaction.create({
    data: {
      transactionId: p2pTx1.id,
      otherUserId: bob.id, // receiver
    },
  });

  // Bob sends money to Alice
  const p2pTx2 = await prisma.appTransaction.create({
    data: {
      userId: bob.id,
      amount: 300,
      type: "P2P",
      direction: "DEBIT",
      status: "SUCCESS",
    },
  });

  await prisma.p2PTransaction.create({
    data: {
      transactionId: p2pTx2.id,
      otherUserId: alice.id,
    },
  });

  // ---------- EXTRA TRANSACTIONS ----------

  await prisma.appTransaction.createMany({
    data: [
      {
        userId: alice.id,
        amount: 1000,
        type: "ON_RAMP",
        direction: "CREDIT",
        status: "PENDING",
      },
      {
        userId: bob.id,
        amount: 700,
        type: "P2P",
        direction: "DEBIT",
        status: "FAILED",
      },
      {
        userId: alice.id,
        amount: 400,
        type: "P2P",
        direction: "DEBIT",
        status: "SUCCESS",
      },
    ],
  });

  console.log("✅ Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
