// app/api/getThema/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_THEMAS = ["themaDefault1", "themaDefault2"];

export async function GET(req: NextRequest) {
  try {
    // Interroger la base pour toutes les thématiques distinctes non nulles
    const themas = await prisma.comments.findMany({
      where: { thema: { not: null } },
      select: { thema: true },
      distinct: ["thema"],
    });

    // Extraire les valeurs string, filtrer les vides
    const themaList = themas
      .map((item) => item.thema)
      .filter((t): t is string => typeof t === "string" && t.length > 0);

    // Si aucune thématique trouvée, retourne la liste par défaut
    if (themaList.length === 0) {
      return NextResponse.json({ thema: DEFAULT_THEMAS }, { status: 200 });
    }

    // Sinon, retourne la liste trouvée
    return NextResponse.json({ thema: themaList }, { status: 200 });
  } catch (error) {
    // En cas d'erreur, retourne la liste par défaut
    return NextResponse.json({ thema: DEFAULT_THEMAS }, { status: 200 });
  }
}
