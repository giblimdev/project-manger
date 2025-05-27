// lib/auth/auth-server.ts

import { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { prisma } from "@/lib/prisma";

/**
 * Type de la session retournée par le serveur
 */
export type ServerSession = {
  userId: string;
  sessionId: string;
  expiresAt: Date;
} | null;

/**
 * Récupère la session utilisateur côté serveur via le cookie et Prisma.
 * @param request NextRequest
 * @returns ServerSession | null
 */
export async function getServerSession(
  request: NextRequest
): Promise<ServerSession> {
  try {
    // 1. Récupérer le cookie de session
    const sessionCookie = getSessionCookie(request, {});
    if (!sessionCookie || !sessionCookie.valueOf) {
      console.log("[getServerSession] Aucun cookie de session trouvé");
      return null;
    }

    // 2. Extraire le token du cookie (gère le cas "token.suffix")
    const cookieValue = sessionCookie.valueOf();
    const token =
      typeof cookieValue === "string" && cookieValue.includes(".")
        ? cookieValue.split(".")[0]
        : cookieValue;

    // 3. Chercher la session en base
    const session = await prisma.session.findUnique({
      where: { token: token as string },
      select: {
        id: true,
        expiresAt: true,
        userId: true,
      },
    });

    if (!session || !session.userId) {
      console.log("[getServerSession] Session inexistante ou userId manquant");
      return null;
    }

    if (new Date() > session.expiresAt) {
      console.log("[getServerSession] Session expirée");
      return null;
    }

    // (Optionnel) Log pour debug
    // console.log("[getServerSession] Session valide:", session);

    return {
      userId: session.userId,
      sessionId: session.id,
      expiresAt: session.expiresAt,
    };
  } catch (error) {
    console.error(
      "[getServerSession] Erreur lors de la récupération de la session:",
      error
    );
    return null;
  }
}
