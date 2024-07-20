/*
  Warnings:

  - You are about to drop the column `content` on the `Post` table. All the data in the column will be lost.
  - Added the required column `passwordtest` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "content",
ADD COLUMN     "contents" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordtest" TEXT NOT NULL;
