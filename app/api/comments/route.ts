// app/api/comments/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/comments : création d'un nouveau commentaire
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validation basique (à adapter selon tes besoins)
    if (!body.title || !body.content || !body.thema || !body.authorId) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const comment = await prisma.comments.create({
      data: {
        title: body.title,
        content: body.content,
        thema: body.thema,
        authorId: body.authorId,
        parentCommentId: body.parentCommentId || null,
        featureId: body.featureId || null,
        userStoryId: body.userStoryId || null,
        taskId: body.taskId || null,
        sprintId: body.sprintId || null,
        roadMapId: body.roadMapId || null,
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création du commentaire." },
      { status: 500 }
    );
  }
}
