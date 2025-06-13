import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, SprintStatus } from "@/lib/generated/prisma/client";

const prisma = new PrismaClient();

function validateSprint(data: { name: any; startDate: string; endDate: string; projectId: any; status: string; }) {
  if (!data.name || typeof data.name !== "string") {
    return { valid: false, error: "Le nom du sprint est requis." };
  }
  if (!data.startDate || isNaN(Date.parse(data.startDate))) {
    return { valid: false, error: "startDate requis et doit être une date valide." };
  }
  if (!data.endDate || isNaN(Date.parse(data.endDate))) {
    return { valid: false, error: "endDate requis et doit être une date valide." };
  }
  if (!data.projectId || typeof data.projectId !== "string") {
    return { valid: false, error: "projectId requis." };
  }
  if (data.status && !["PLANNED", "ACTIVE", "COMPLETED", "CANCELLED"].includes(data.status)) {
    return { valid: false, error: "status invalide." };
  }
  return { valid: true };
}

// GET : Récupérer tous les sprints (avec relations principales)
export async function GET() {
  try {
    const sprints = await prisma.sprints.findMany({
      orderBy: { createdAt: "desc" },
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
    return NextResponse.json(sprints, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des sprints :", error);
    return NextResponse.json({ error: "Erreur interne serveur" }, { status: 500 });
  }
}

// POST : Créer un nouveau sprint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateSprint(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const sprint = await prisma.sprints.create({
      data: {
        name: body.name,
        goal: body.goal || null,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        status: body.status || "PLANNED",
        projectId: body.projectId,
        creatorId: body.creatorId || null,
      },
    });
    return NextResponse.json(sprint, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du sprint :", error);
    return NextResponse.json({ error: "Erreur interne serveur" }, { status: 500 });
  }
}
