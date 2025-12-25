-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('ON_RAMP', 'P2P');

-- CreateEnum
CREATE TYPE "TransactionDirection" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "number" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Balance" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppTransaction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "TransactionType" NOT NULL,
    "direction" "TransactionDirection" NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnRampTransaction" (
    "id" SERIAL NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "OnRampTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "P2PTransaction" (
    "id" SERIAL NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "otherUserId" INTEGER NOT NULL,

    CONSTRAINT "P2PTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_number_key" ON "User"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Balance_userId_key" ON "Balance"("userId");

-- CreateIndex
CREATE INDEX "AppTransaction_userId_createdAt_idx" ON "AppTransaction"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "OnRampTransaction_transactionId_key" ON "OnRampTransaction"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "OnRampTransaction_token_key" ON "OnRampTransaction"("token");

-- CreateIndex
CREATE UNIQUE INDEX "P2PTransaction_transactionId_key" ON "P2PTransaction"("transactionId");

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppTransaction" ADD CONSTRAINT "AppTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnRampTransaction" ADD CONSTRAINT "OnRampTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "AppTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "P2PTransaction" ADD CONSTRAINT "P2PTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "AppTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "P2PTransaction" ADD CONSTRAINT "P2PTransaction_otherUserId_fkey" FOREIGN KEY ("otherUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
