// app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "@/lib/auth/auth-server";
import { Status } from "@/lib/generated/prisma/client"; // <-- Importe l'enum Prisma généré

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
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  teamIds: z.array(z.string().uuid()).optional(),
});

/**
 * GET: Liste des projets avec filtres optionnels
 *
 * Paramètres de requête:
 * - status: Status du projet (optionnel)
 * - priority: Priorité du projet (optionnel)
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Vérifier l'authentification
    const session = await getServerSession(req);
    if (!session?.userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // 2. Récupérer et valider les paramètres de requête
    const { searchParams } = new URL(req.url);
    const rawParams = {
      status: searchParams.get("status") || undefined,
      priority: searchParams.get("priority")
        ? Number(searchParams.get("priority"))
        : undefined,
    };

    const parseResult = projectQuerySchema.safeParse(rawParams);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Paramètres invalides", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    // 3. Utiliser la valeur validée (avec le bon type enum)
    const { status, priority } = parseResult.data;

    // 4. Construire la requête Prisma avec les filtres
    const where = {
      users: {
        some: {
          id: session.userId,
        },
      },
      ...(status ? { status: status as Status } : {}),
      ...(priority ? { priority } : {}),
    };

    // 5. Récupérer les projets
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

export async function POST(req: NextRequest) {
  try {
    // 1. Vérifier l'authentification
    const session = await getServerSession(req);
    if (!session?.userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // 2. Récupérer et valider le corps de la requête
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

    // 3. Créer le projet avec les relations
    const project = await prisma.projects.create({
      data: {
        ...projectData,
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

    // 4. Créer un log d'activité
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
