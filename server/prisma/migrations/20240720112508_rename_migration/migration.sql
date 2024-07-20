/*
  Warnings:

  - Added the required column `status` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Unknown', 'Draft', 'InProgress', 'InReview', 'Published');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "Status" NOT NULL;
