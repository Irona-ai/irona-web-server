/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `Auth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Auth" DROP COLUMN "refreshToken";

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userid_fkey" FOREIGN KEY ("userid") REFERENCES "Auth"("userid") ON DELETE CASCADE ON UPDATE CASCADE;
