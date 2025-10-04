-- CreateEnum
CREATE TYPE "AttendanceType" AS ENUM ('P', 'A', 'R', 'L');

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "weight" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Guard" ALTER COLUMN "weight" DROP NOT NULL;

-- CreateTable
CREATE TABLE "GuardsAttendance" (
    "id" UUID NOT NULL,
    "type" "AttendanceType" NOT NULL,
    "locationId" UUID NOT NULL,
    "guardId" UUID NOT NULL,
    "shiftId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isHoliday" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuardsAttendance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GuardsAttendance" ADD CONSTRAINT "GuardsAttendance_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardsAttendance" ADD CONSTRAINT "GuardsAttendance_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardsAttendance" ADD CONSTRAINT "GuardsAttendance_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "shifts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
