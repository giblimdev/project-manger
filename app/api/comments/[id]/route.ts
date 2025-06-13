// app/api/comments/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Utilitaire pour extraire l'id depuis l'URL
function extractIdFromUrl(req: NextRequest): string | null {
  const match = req.nextUrl.pathname.match(/\/api\/comments\/([^\/]+)/);
  return match ? match[1] : null;
}

// PUT /api/comments/[id]
export async function PUT(req: NextRequest) {
  const id = extractIdFromUrl(req);
  if (!id) {
    return NextResponse.json(
      { error: "ID manquant dans l'URL." },
      { status: 400 }
    );
  }
  try {
    const body = await req.json();
    if (!body.title || !body.content || !body.thema || !body.authorId) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const comment = await prisma.comments.update({
      where: { id },
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

    return NextResponse.json({ comment }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du commentaire." },
      { status: 500 }
    );
  }
}

// DELETE /api/comments/[id]
export async function DELETE(req: NextRequest) {
  const id = extractIdFromUrl(req);
  if (!id) {
    return NextResponse.json(
      { error: "ID manquant dans l'URL." },
      { status: 400 }
    );
  }
  try {
    await prisma.comments.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression du commentaire." },
      { status: 500 }
    );
  }
}
