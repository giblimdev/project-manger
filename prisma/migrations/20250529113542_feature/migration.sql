/*
  Warnings:

  - You are about to drop the column `ordrer` on the `features` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_features" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 100,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "priority" INTEGER NOT NULL DEFAULT 1,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "projectId" TEXT NOT NULL,
    "creatorId" TEXT,
    "parentFeatureId" TEXT,
    CONSTRAINT "features_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "features_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "features_parentFeatureId_fkey" FOREIGN KEY ("parentFeatureId") REFERENCES "features" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_features" ("createdAt", "creatorId", "description", "endDate", "id", "name", "parentFeatureId", "priority", "projectId", "startDate", "status", "updatedAt") SELECT "createdAt", "creatorId", "description", "endDate", "id", "name", "parentFeatureId", "priority", "projectId", "startDate", "status", "updatedAt" FROM "features";
DROP TABLE "features";
ALTER TABLE "new_features" RENAME TO "features";
CREATE INDEX "features_projectId_idx" ON "features"("projectId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
