-- CreateTable
CREATE TABLE "LocationPayRollDuration" (
    "id" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "officeId" UUID NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "isLocked" BOOLEAN NOT NULL,
    "nextUnlockTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocationPayRollDuration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LocationPayRollDuration" ADD CONSTRAINT "LocationPayRollDuration_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
