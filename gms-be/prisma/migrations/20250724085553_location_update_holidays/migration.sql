/*
  Warnings:

  - You are about to drop the column `days` on the `requested_guards` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "requested_guard_finances" ADD COLUMN     "gazettedHoliday" INTEGER;

-- AlterTable
ALTER TABLE "requested_guards" DROP COLUMN "days",
ADD COLUMN     "gazettedHoliday" INTEGER;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
