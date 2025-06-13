/*
  Warnings:

  - You are about to drop the column `projectId` on the `comments` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "thema" TEXT,
    "authorId" TEXT NOT NULL,
    "parentCommentId" TEXT,
    "featureId" TEXT,
    "userStoryId" TEXT,
    "taskId" TEXT,
    "sprintId" TEXT,
    "roadMapId" TEXT,
    CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "comments" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "comments_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "features" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_userStoryId_fkey" FOREIGN KEY ("userStoryId") REFERENCES "user_stories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "sprints" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_roadMapId_fkey" FOREIGN KEY ("roadMapId") REFERENCES "roadmaps" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_comments" ("authorId", "content", "createdAt", "featureId", "id", "parentCommentId", "roadMapId", "sprintId", "taskId", "title", "updatedAt", "userStoryId") SELECT "authorId", "content", "createdAt", "featureId", "id", "parentCommentId", "roadMapId", "sprintId", "taskId", "title", "updatedAt", "userStoryId" FROM "comments";
DROP TABLE "comments";
ALTER TABLE "new_comments" RENAME TO "comments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
