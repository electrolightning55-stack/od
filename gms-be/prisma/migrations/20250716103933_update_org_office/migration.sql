-- AlterTable
ALTER TABLE "Office" ADD COLUMN     "addressOpt" TEXT,
ADD COLUMN     "city" TEXT NOT NULL DEFAULT 'N/A';
