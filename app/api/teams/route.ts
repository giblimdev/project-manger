//@/app/api/teams/route.ts


 import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Schéma de validation pour la création d'une équipe
const createTeamSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  image: z.string().optional(),
  privileges: z.string().optional(),
  teamType: z.string().min(1, "Le type d'équipe est requis"),
  creatorId: z.string().uuid().optional(),
  memberIds: z.array(z.string().uuid()).optional(), // Pour ajouter des membres à la création
});

// GET : Récupérer toutes les équipes avec relations
export async function GET() {
  try {
    const teams = await prisma.teams.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        creator: true,
        members: true,
        projects: true,
      },
    });
    return NextResponse.json(teams, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des équipes :", error);
    return NextResponse.json({ error: "Erreur interne serveur" }, { status: 500 });
  }
}

// POST : Créer une nouvelle équipe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createTeamSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Corps de requête invalide", details: validation.error.errors },
        { status: 400 }
      );
    }

    // Création de l'équipe
    const { memberIds, ...teamData } = validation.data;
    const newTeam = await prisma.teams.create({
      data: {
        ...teamData,
        members: memberIds
          ? {
              connect: memberIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: {
        creator: true,
        members: true,
        projects: true,
      },
    });

    return NextResponse.json(newTeam, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'équipe :", error);
    return NextResponse.json({ error: "Erreur interne serveur" }, { status: 500 });
  }
}
