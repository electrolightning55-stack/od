-- AlterTable
ALTER TABLE "Guard" ALTER COLUMN "currentAreaPoliceContact" DROP NOT NULL,
ALTER COLUMN "currentAreaPoliceStation" DROP NOT NULL,
ALTER COLUMN "permanentAreaPoliceContact" DROP NOT NULL,
ALTER COLUMN "permanentAreaPoliceStation" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Reference" ALTER COLUMN "fatherName" DROP NOT NULL;
