-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_roadmaps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 10,
    "phase" TEXT NOT NULL,
    "estimatedDays" INTEGER NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "deliverables" TEXT NOT NULL,
    "technologies" TEXT NOT NULL,
    "dependencies" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "projectId" TEXT NOT NULL,
    "creatorId" TEXT,
    CONSTRAINT "roadmaps_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "roadmaps_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_roadmaps" ("createdAt", "creatorId", "deliverables", "dependencies", "description", "endDate", "estimatedDays", "id", "phase", "priority", "progress", "projectId", "startDate", "technologies", "title", "updatedAt") SELECT "createdAt", "creatorId", "deliverables", "dependencies", "description", "endDate", "estimatedDays", "id", "phase", "priority", "progress", "projectId", "startDate", "technologies", "title", "updatedAt" FROM "roadmaps";
DROP TABLE "roadmaps";
ALTER TABLE "new_roadmaps" RENAME TO "roadmaps";
CREATE INDEX "roadmaps_phase_idx" ON "roadmaps"("phase");
CREATE INDEX "roadmaps_priority_idx" ON "roadmaps"("priority");
CREATE INDEX "roadmaps_projectId_idx" ON "roadmaps"("projectId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
