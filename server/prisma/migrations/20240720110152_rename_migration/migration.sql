/*
  Warnings:

  - You are about to drop the column `contents` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "contents",
ADD COLUMN     "content" TEXT;
