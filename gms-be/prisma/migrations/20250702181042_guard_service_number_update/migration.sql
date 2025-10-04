/*
  Warnings:

  - A unique constraint covering the columns `[cnicNumber]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cnicNumber]` on the table `Guard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serviceNumber` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceNumber` to the `Guard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "serviceNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Guard" ADD COLUMN     "serviceNumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_cnicNumber_key" ON "Employee"("cnicNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Guard_cnicNumber_key" ON "Guard"("cnicNumber");
