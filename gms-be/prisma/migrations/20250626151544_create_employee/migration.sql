-- CreateTable
CREATE TABLE "Employee" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "guardCategoryId" UUID NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "cnicNumber" TEXT NOT NULL,
    "cnicIssueDate" TIMESTAMP(3) NOT NULL,
    "currentAddress" TEXT NOT NULL,
    "permanentAddress" TEXT NOT NULL,
    "socialSecurityNo" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "religion" TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "bloodPressure" TEXT NOT NULL,
    "heartBeat" TEXT NOT NULL,
    "eyeColor" TEXT NOT NULL,
    "disability" TEXT,
    "eobiNumber" TEXT,
    "sessiNumber" TEXT,
    "kinName" TEXT NOT NULL,
    "kinFatherName" TEXT NOT NULL,
    "kinReligion" TEXT NOT NULL,
    "kinCNIC" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Academic" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "lastEducation" TEXT NOT NULL,
    "institute" TEXT NOT NULL,
    "hasDrivingLicense" BOOLEAN NOT NULL,

    CONSTRAINT "Academic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrivingLicense" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "drivingLicenseNo" TEXT,
    "drivingLicenseIssueDate" TIMESTAMP(3),
    "drivingLicenseExpiryDate" TIMESTAMP(3),
    "licenseIssueCity" TEXT,

    CONSTRAINT "DrivingLicense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "rankName" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "serviceYears" INTEGER NOT NULL,
    "serviceMonths" INTEGER NOT NULL,
    "securityYears" INTEGER NOT NULL,
    "place" TEXT NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reference" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "fullName" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "cnicNumber" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "currentAddress" TEXT NOT NULL,
    "permanentAddress" TEXT NOT NULL,

    CONSTRAINT "Reference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "bankName" TEXT NOT NULL,
    "bankCode" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "IBAN" TEXT NOT NULL,
    "branchCode" TEXT NOT NULL,
    "branch" TEXT NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Biometric" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "rightThumb" TEXT NOT NULL,
    "rightMiddleFinger" TEXT NOT NULL,
    "rightLittleFinger" TEXT NOT NULL,
    "leftThumb" TEXT NOT NULL,
    "leftMiddleFinger" TEXT NOT NULL,
    "leftLittleFinger" TEXT NOT NULL,
    "rightForeFinger" TEXT NOT NULL,
    "rightRingFinger" TEXT NOT NULL,
    "rightFourFinger" TEXT NOT NULL,
    "leftFourFinger" TEXT NOT NULL,
    "leftRingFinger" TEXT NOT NULL,

    CONSTRAINT "Biometric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Academic_employeeId_key" ON "Academic"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "DrivingLicense_employeeId_key" ON "DrivingLicense"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_employeeId_key" ON "BankAccount"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Biometric_employeeId_key" ON "Biometric"("employeeId");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_guardCategoryId_fkey" FOREIGN KEY ("guardCategoryId") REFERENCES "GuardCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Academic" ADD CONSTRAINT "Academic_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrivingLicense" ADD CONSTRAINT "DrivingLicense_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biometric" ADD CONSTRAINT "Biometric_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
