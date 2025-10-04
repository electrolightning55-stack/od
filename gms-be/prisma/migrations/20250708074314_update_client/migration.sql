/*
  Warnings:

  - A unique constraint covering the columns `[officialEmail]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[POCEmail]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `MSCNumber` on the `Client` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "MSCNumber",
ADD COLUMN     "MSCNumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Client_officialEmail_key" ON "Client"("officialEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Client_POCEmail_key" ON "Client"("POCEmail");
