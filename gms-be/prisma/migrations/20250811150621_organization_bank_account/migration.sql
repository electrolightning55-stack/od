-- CreateTable
CREATE TABLE "OrganizationBankAccount" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "bankName" TEXT,
    "bankCode" TEXT,
    "accountNumber" TEXT,
    "accountTitle" TEXT,
    "IBAN" TEXT,
    "branchCode" TEXT,
    "branch" TEXT,

    CONSTRAINT "OrganizationBankAccount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrganizationBankAccount" ADD CONSTRAINT "OrganizationBankAccount_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
