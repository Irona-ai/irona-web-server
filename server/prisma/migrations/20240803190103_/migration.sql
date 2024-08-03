/*
  Warnings:

  - A unique constraint covering the columns `[primaryEmailAddress,userId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `primaryEmailAddress` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "primaryEmailAddress" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_primaryEmailAddress_userId_key" ON "User"("primaryEmailAddress", "userId");
