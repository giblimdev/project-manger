// app/api/projects/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "@/lib/auth/auth-server";
import { Status } from "@/lib/generated/prisma/client";

// --- Schémas de validation Zod ---
const statusEnum = z.enum([
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
  "BLOCKED",
  "CANCELLED",
]);
const projectQuerySchema = z.object({
  status: statusEnum.optional(),
  priority: z.coerce.number().optional(),
});

const projectCreateSchema = z.object({
  name: z.string().min(1, "Le nom du projet est requis"),
  description: z.string().optional(),
  image: z.string().url().optional(),
  status: statusEnum.default("TODO"),
  priority: z.number().int().min(1).default(1),
  // On accepte une date (YYYY-MM-DD) ou rien
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  teamIds: z.array(z.string().uuid()).optional(),
});

/**
 * GET: Liste des projets de l'utilisateur (avec filtres facultatifs)
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Authentification
    const session = await getServerSession(req);
    if (!session?.userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // 2. Paramètres de recherche
    const { searchParams } = new URL(req.url);
    const rawParams = {
      status: searchParams.get("status") || undefined,
      priority: searchParams.get("priority"),
    };

    const parseResult = projectQuerySchema.safeParse(rawParams);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Paramètres invalides", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { status, priority } = parseResult.data;

    // 3. Filtre Prisma
    const where = {
      users: {
        some: {
          id: session.userId,
        },
      },
      ...(status ? { status: status as Status } : {}),
      ...(priority ? { priority } : {}),
    };

    // 4. Récupérer les projets
    const projects = await prisma.projects.findMany({
      where,
      orderBy: [{ priority: "desc" }, { updatedAt: "desc" }],
      include: {
        teams: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            features: true,
            tasks: true,
            files: true,
          },
        },
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("[GET /api/projects] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des projets" },
      { status: 500 }
    );
  }
}

/**
 * POST: Création d'un projet
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authentification
    const session = await getServerSession(req);
    if (!session?.userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // 2. Validation du body
    const body = await req.json();
    const parseResult = projectCreateSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const { teamIds, ...projectData } = data;

    // 3. Création du projet
    const project = await prisma.projects.create({
      data: {
        ...projectData,
        // Prisma attend des dates ou null
        startDate: projectData.startDate
          ? new Date(projectData.startDate)
          : null,
        endDate: projectData.endDate ? new Date(projectData.endDate) : null,
        creatorId: session.userId,
        users: {
          connect: { id: session.userId },
        },
        ...(teamIds && teamIds.length > 0
          ? {
              teams: {
                connect: teamIds.map((id) => ({ id })),
              },
            }
          : {}),
      },
      include: {
        teams: true,
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // 4. Log d'activité
    await prisma.activityLogs.create({
      data: {
        type: "CREATE",
        message: `Projet "${project.name}" créé`,
        userId: session.userId,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("[POST /api/projects] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du projet" },
      { status: 500 }
    );
  }
}
