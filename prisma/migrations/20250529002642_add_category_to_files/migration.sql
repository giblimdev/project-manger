-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_files" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "extension" TEXT,
    "url" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'dossier',
    "type" TEXT NOT NULL,
    "description" TEXT,
    "fonctionnalities" TEXT,
    "import" TEXT,
    "export" TEXT,
    "useby" TEXT,
    "script" TEXT,
    "version" TEXT,
    "order" INTEGER NOT NULL DEFAULT 100,
    "devorder" INTEGER NOT NULL DEFAULT 100,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creator" TEXT,
    "projectId" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "parentFileId" TEXT,
    CONSTRAINT "files_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "files_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "files_parentFileId_fkey" FOREIGN KEY ("parentFileId") REFERENCES "files" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_files" ("createdAt", "creator", "description", "devorder", "export", "extension", "fonctionnalities", "id", "import", "name", "order", "parentFileId", "projectId", "script", "status", "type", "uploaderId", "url", "useby", "version") SELECT "createdAt", "creator", "description", "devorder", "export", "extension", "fonctionnalities", "id", "import", "name", "order", "parentFileId", "projectId", "script", "status", "type", "uploaderId", "url", "useby", "version" FROM "files";
DROP TABLE "files";
ALTER TABLE "new_files" RENAME TO "files";
CREATE INDEX "files_projectId_idx" ON "files"("projectId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
