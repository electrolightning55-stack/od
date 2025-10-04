-- First, backup the current data
CREATE TABLE "OrganizationFeature_backup" AS 
SELECT * FROM "OrganizationFeature";

-- Perform the column rename
ALTER TABLE "OrganizationFeature" 
RENAME COLUMN "featureName" TO "feature";