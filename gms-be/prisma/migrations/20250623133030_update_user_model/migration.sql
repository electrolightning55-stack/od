/*
  Warnings:

  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "userId",
ALTER COLUMN "isActive" SET DEFAULT true,
ALTER COLUMN "profileImage" DROP NOT NULL;
