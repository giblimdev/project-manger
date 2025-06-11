-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 10,
    "description" TEXT,
    "image" TEXT,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "priority" INTEGER NOT NULL DEFAULT 1,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatorId" TEXT,
    CONSTRAINT "projects_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_projects" ("createdAt", "creatorId", "description", "endDate", "id", "image", "name", "priority", "startDate", "status", "updatedAt") SELECT "createdAt", "creatorId", "description", "endDate", "id", "image", "name", "priority", "startDate", "status", "updatedAt" FROM "projects";
DROP TABLE "projects";
ALTER TABLE "new_projects" RENAME TO "projects";
CREATE INDEX "projects_name_idx" ON "projects"("name");
CREATE INDEX "projects_status_idx" ON "projects"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
