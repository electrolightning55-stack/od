-- AlterTable
ALTER TABLE "Guard" ADD COLUMN     "officeId" UUID;

-- AlterTable
ALTER TABLE "Office" ADD COLUMN     "branchName" TEXT NOT NULL DEFAULT 'N/A',
ADD COLUMN     "contactNumberOpt" TEXT;

-- AlterTable
ALTER TABLE "locations" ADD COLUMN     "officeId" UUID;

-- CreateTable
CREATE TABLE "UserOffice" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "officeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserOffice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserOffice_userId_organizationId_officeId_key" ON "UserOffice"("userId", "organizationId", "officeId");

-- AddForeignKey
ALTER TABLE "UserOffice" ADD CONSTRAINT "UserOffice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOffice" ADD CONSTRAINT "UserOffice_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOffice" ADD CONSTRAINT "UserOffice_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guard" ADD CONSTRAINT "Guard_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE CASCADE ON UPDATE CASCADE;
