// app/api/projects/[projectId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth/auth-server";
import { z } from "zod";
import { Status } from "@/lib/generated/prisma/client";

// Validation Zod pour les paramètres
const paramsSchema = z.object({
  projectId: z
    .string()
    .min(1, "ProjectId requis")
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      "Format UUID invalide"
    ),
});

// Validation Zod pour le body PUT
const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom du projet est requis")
    .max(255, "Nom trop long"),
  description: z.string().optional().nullable(),
  image: z.string().url("URL invalide").optional().nullable(),
  status: z.nativeEnum(Status).default(Status.TODO),
  priority: z.coerce.number().int().min(1).max(10).default(1),
  startDate: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val && val !== "" ? new Date(val) : null)),
  endDate: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val && val !== "" ? new Date(val) : null)),
  teamIds: z.array(z.string().uuid()).optional().default([]),
});

// Type pour Next.js 15+ avec params asynchrone
interface RouteParams {
  params: Promise<{
    projectId: string;
  }>;
}

// GET - Récupérer un projet spécifique
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    // 1. Authentification
    const session = await getServerSession(req);
    if (!session?.userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // 2. Résolution des paramètres (Next.js 15+)
    const resolvedParams = await params;
    const parseResult = paramsSchema.safeParse(resolvedParams);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Paramètre projectId invalide" },
        { status: 400 }
      );
    }

    const { projectId } = parseResult.data;

    // 3. Récupération du projet avec relations
    const project = await prisma.projects.findFirst({
      where: {
        id: projectId,
        users: {
          some: { id: session.userId },
        },
      },
      include: {
        creator: {
          select: { id: true, name: true },
        },
        teams: {
          select: { id: true, name: true },
        },
        _count: {
          select: {
            users: true,
            features: true,
            tasks: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Projet introuvable ou accès refusé" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("[GET /api/projects/[projectId]] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du projet" },
      { status: 500 }
    );
  }
}

// PUT - Modifier un projet
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    // 1. Authentification
    const session = await getServerSession(req);
    if (!session?.userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // 2. Résolution des paramètres (Next.js 15+)
    const resolvedParams = await params;
    const parseResult = paramsSchema.safeParse(resolvedParams);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Paramètre projectId invalide" },
        { status: 400 }
      );
    }

    const { projectId } = parseResult.data;

    // 3. Validation du body
    const body = await req.json();
    const dataResult = updateProjectSchema.safeParse(body);

    if (!dataResult.success) {
      return NextResponse.json(
        {
          error: "Données invalides",
          details: dataResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const updateData = dataResult.data;

    // 4. Vérification des permissions
    const existingProject = await prisma.projects.findFirst({
      where: {
        id: projectId,
        OR: [
          {
            users: {
              some: {
                id: session.userId,
                role: { in: ["ADMIN", "DEV", "AUTHOR"] },
              },
            },
          },
          {
            creatorId: session.userId,
          },
        ],
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: "Projet introuvable ou permissions insuffisantes" },
        { status: 404 }
      );
    }

    // 5. Mise à jour du projet
    const updatedProject = await prisma.projects.update({
      where: { id: projectId },
      data: {
        name: updateData.name,
        description: updateData.description,
        image: updateData.image,
        status: updateData.status,
        priority: updateData.priority,
        startDate: updateData.startDate,
        endDate: updateData.endDate,
        // Gestion des équipes si nécessaire
        ...(updateData.teamIds &&
          updateData.teamIds.length > 0 && {
            teams: {
              set: updateData.teamIds.map((id) => ({ id })),
            },
          }),
      },
      include: {
        creator: {
          select: { id: true, name: true },
        },
        teams: {
          select: { id: true, name: true },
        },
      },
    });

    // 6. Log d'activité
    await prisma.activityLogs.create({
      data: {
        type: "UPDATE",
        message: `Projet "${updatedProject.name}" mis à jour`,
        userId: session.userId,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("[PUT /api/projects/[projectId]] Erreur:", error);

    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "Un projet avec ce nom existe déjà" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du projet" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un projet (votre code existant)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    // 1. Authentification
    const session = await getServerSession(req);
    if (!session?.userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // 2. Résolution des paramètres (Next.js 15+)
    const resolvedParams = await params;
    const parseResult = paramsSchema.safeParse(resolvedParams);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Paramètre projectId invalide" },
        { status: 400 }
      );
    }

    const { projectId } = parseResult.data;

    // 3. Vérification existence et permissions
    const project = await prisma.projects.findFirst({
      where: {
        id: projectId,
        OR: [
          {
            users: {
              some: {
                id: session.userId,
                role: { in: ["ADMIN", "DEV", "AUTHOR"] },
              },
            },
          },
          {
            creatorId: session.userId,
          },
        ],
      },
      select: {
        id: true,
        name: true,
        creatorId: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Projet introuvable ou permissions insuffisantes" },
        { status: 404 }
      );
    }

    // 4. Suppression
    await prisma.projects.delete({
      where: { id: projectId },
    });

    // 5. Log d'activité
    await prisma.activityLogs.create({
      data: {
        type: "DELETE",
        message: `Projet "${project.name}" supprimé`,
        userId: session.userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Projet "${project.name}" supprimé avec succès`,
    });
  } catch (error) {
    console.error("[DELETE /api/projects/[projectId]] Erreur:", error);

    if (error instanceof Error) {
      if (error.message.includes("Foreign key constraint")) {
        return NextResponse.json(
          {
            error:
              "Impossible de supprimer : le projet contient des données liées",
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Erreur lors de la suppression du projet" },
      { status: 500 }
    );
  }
}
