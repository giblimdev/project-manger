//@/app/api/comments/getComments/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const thema = searchParams.get("thema");

    // Ajoute ici la gestion d'autres filtres si besoin
    // Exemple : filtre par auteur, date, etc.
    // const authorId = searchParams.get("authorId");

    if (!thema) {
      return NextResponse.json({ comments: [] }, { status: 200 });
    }

    // Construction dynamique des filtres Prisma
    const where: any = { thema };
    // if (authorId) where.authorId = authorId;

    const comments = await prisma.comments.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ comments: [] }, { status: 500 });
  }
}
