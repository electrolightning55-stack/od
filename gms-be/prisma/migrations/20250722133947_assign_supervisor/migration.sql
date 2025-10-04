-- CreateTable
CREATE TABLE "AssignedSupervisor" (
    "id" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "deploymentDate" TIMESTAMP(3) NOT NULL,
    "deploymentTill" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssignedSupervisor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssignedSupervisor_locationId_key" ON "AssignedSupervisor"("locationId");

-- AddForeignKey
ALTER TABLE "AssignedSupervisor" ADD CONSTRAINT "AssignedSupervisor_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedSupervisor" ADD CONSTRAINT "AssignedSupervisor_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedSupervisor" ADD CONSTRAINT "AssignedSupervisor_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
