// lib/data/comments.ts

import { prisma } from "@/lib/prisma";

// Récupère tous les commentaires
export async function getComments() {
  return prisma.comments.findMany({
    orderBy: { createdAt: "desc" }, // ou selon l'ordre voulu
  });
}

// Récupère la liste des thèmes distincts
export async function getThemas() {
  const themas = await prisma.comments.findMany({
    where: { thema: { not: null } },
    select: { thema: true },
    distinct: ["thema"],
    orderBy: { thema: "asc" },
  });
  // On retourne juste la liste des valeurs de thema (sans doublons ni null)
  return themas.map((t) => t.thema).filter(Boolean);
}
