import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, SprintStatus } from "@/lib/generated/prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const updateSprintSchema = z.object({
  name: z.string().min(1, "Le nom est requis").optional(),
  goal: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.nativeEnum(SprintStatus).optional(),
  projectId: z.string().uuid().optional(),
  creatorId: z.string().uuid().optional(),
});

// GET : Récupérer un sprint par ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sprintId: string }> }
) {
  const { sprintId } = await params;

  if (!sprintId) {
    return NextResponse.json({ error: "Sprint ID requis" }, { status: 400 });
  }

  try {
    const sprint = await prisma.sprints.findUnique({
      where: { id: sprintId },
      include: {
        project: true,
        creator: true,
        comments: true,
        roadMaps: true,
        features: true,
        userStories: true,
        tasks: true,
      },
    });

    if (!sprint) {
      return NextResponse.json({ error: "Sprint introuvable" }, { status: 404 });
    }

    return NextResponse.json(sprint, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération du sprint :", error);
    return NextResponse.json({ error: "Erreur interne serveur" }, { status: 500 });
  }
}

// PUT : Mettre à jour un sprint par ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sprintId: string }> }
) {
  const { sprintId } = await params;

  if (!sprintId) {
    return NextResponse.json({ error: "Sprint ID requis" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const validation = updateSprintSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Corps de requête invalide", details: validation.error.errors },
        { status: 400 }
      );
    }

    const sprint = await prisma.sprints.findUnique({ where: { id: sprintId } });
    if (!sprint) {
      return NextResponse.json({ error: "Sprint introuvable" }, { status: 404 });
    }

    const updatedSprint = await prisma.sprints.update({
      where: { id: sprintId },
      data: {
        ...validation.data,
        startDate: validation.data.startDate ?? undefined,
        endDate: validation.data.endDate ?? undefined,
      },
    });

    return NextResponse.json(updatedSprint, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du sprint :", error);
    return NextResponse.json({ error: "Erreur interne serveur" }, { status: 500 });
  }
}

// DELETE : Supprimer un sprint par ID
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ sprintId: string }> }
) {
  const { sprintId } = await params;

  if (!sprintId) {
    return NextResponse.json({ error: "Sprint ID requis" }, { status: 400 });
  }

  try {
    const sprint = await prisma.sprints.findUnique({ where: { id: sprintId } });
    if (!sprint) {
      return NextResponse.json({ error: "Sprint introuvable" }, { status: 404 });
    }

    await prisma.sprints.delete({ where: { id: sprintId } });

    return NextResponse.json({ message: "Sprint supprimé avec succès" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression du sprint :", error);
    return NextResponse.json({ error: "Erreur interne serveur" }, { status: 500 });
  }
}
