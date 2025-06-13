


 //teams/[teamId]/route.ts




import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Schéma de validation pour la mise à jour d'une équipe
const updateTeamSchema = z.object({
  name: z.string().min(1, "Le nom est requis").optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  privileges: z.string().optional(),
  teamType: z.string().min(1, "Le type d'équipe est requis").optional(),
  creatorId: z.string().uuid().optional(),
  memberIds: z.array(z.string().uuid()).optional(), // Pour mise à jour des membres
});

// GET : Récupérer une équipe par ID (avec relations)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await params;

  if (!teamId) {
    return NextResponse.json({ error: "Team ID requis" }, { status: 400 });
  }

  try {
    const team = await prisma.teams.findUnique({
      where: { id: teamId },
      include: {
        creator: true,
        members: true,
        projects: true,
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Équipe introuvable" }, { status: 404 });
    }

    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'équipe :", error);
    return NextResponse.json({ error: "Erreur interne serveur" }, { status: 500 });
  }
}

// PUT : Mettre à jour une équipe par ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await params;

  if (!teamId) {
    return NextResponse.json({ error: "Team ID requis" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const validation = updateTeamSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Corps de requête invalide", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { memberIds, ...teamData } = validation.data;

    // Vérifie si l'équipe existe
    const team = await prisma.teams.findUnique({ where: { id: teamId } });
    if (!team) {
      return NextResponse.json({ error: "Équipe introuvable" }, { status: 404 });
    }

    // Mise à jour de l'équipe
    const updatedTeam = await prisma.teams.update({
      where: { id: teamId },
      data: {
        ...teamData,
        members: memberIds
          ? {
              set: memberIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: {
        creator: true,
        members: true,
        projects: true,
      },
    });

    return NextResponse.json(updatedTeam, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'équipe :", error);
    return NextResponse.json({ error: "Erreur interne serveur" }, { status: 500 });
  }
}

// DELETE : Supprimer une équipe par ID
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await params;

  if (!teamId) {
    return NextResponse.json({ error: "Team ID requis" }, { status: 400 });
  }

  try {
    const team = await prisma.teams.findUnique({ where: { id: teamId } });
    if (!team) {
      return NextResponse.json({ error: "Équipe introuvable" }, { status: 404 });
    }

    await prisma.teams.delete({ where: { id: teamId } });

    return NextResponse.json({ message: "Équipe supprimée avec succès" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'équipe :", error);
    return NextResponse.json({ error: "Erreur interne serveur" }, { status: 500 });
  }
}
