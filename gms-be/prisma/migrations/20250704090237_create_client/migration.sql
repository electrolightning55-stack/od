-- CreateTable
CREATE TABLE "Client" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "MSCNumber" TEXT NOT NULL,
    "recruitmentDate" TIMESTAMP(3) NOT NULL,
    "companyName" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "websiteLink" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "currentAddress" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "officialEmail" TEXT NOT NULL,
    "POCName" TEXT NOT NULL,
    "POCDesignation" TEXT NOT NULL,
    "POCEmail" TEXT NOT NULL,
    "POCContact" TEXT NOT NULL,
    "AlternateContactPerson" TEXT NOT NULL,
    "AlternateContactNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
