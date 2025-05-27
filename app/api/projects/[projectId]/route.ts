// app/api/projects/[projectId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@/lib/auth/auth-server";
import { prisma } from "@/lib/prisma";
// --- Schémas de validation Zod ---
const statusEnum = z.enum([
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
  "BLOCKED",
  "CANCELLED",
]);
const projectIdSchema = z.object({
  projectId: z.string().uuid("L'ID du projet doit être un UUID valide"),
});
const projectUpdateSchema = z.object({
  name: z.string().min(1, "Le nom du projet est requis").optional(),
  description: z.string().optional(),
  image: z.string().url().optional().nullable(),
  status: statusEnum.optional(),
  priority: z.number().int().min(1).optional(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  teamIds: z.array(z.string().uuid()).optional(),
  userIds: z.array(z.string().uuid()).optional(),
});

/**
 * Vérifie si l'utilisateur a accès au projet
 */
async function hasProjectAccess(
  projectId: string,
  userId: string
): Promise<boolean> {
  const project = await prisma.projects.findFirst({
    where: {
      id: projectId,
      OR: [
        { creatorId: userId },
        { users: { some: { id: userId } } },
        { teams: { some: { members: { some: { id: userId } } } } },
      ],
    },
  });
  return !!project;
}

/**
 * GET: Détails d'un projet spécifique
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    // Authentification
    const session = await getServerSession(req);
    if (!session?.userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Validation de l'ID
    const parseResult = projectIdSchema.safeParse(params);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "ID de projet invalide" },
        { status: 400 }
      );
    }
    const { projectId } = parseResult.data;

    // Vérification d'accès
    if (!(await hasProjectAccess(projectId, session.userId))) {
      return NextResponse.json(
        { error: "Vous n'avez pas accès à ce projet" },
        { status: 403 }
      );
    }

    // Récupération du projet
    const project = await prisma.projects.findUnique({
      where: { id: projectId },
      include: {
        creator: { select: { id: true, name: true, image: true } },
        teams: { select: { id: true, name: true, image: true } },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        _count: {
          select: {
            features: true,
            tasks: true,
            files: true,
            userStories: true,
            sprints: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Projet non trouvé" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error(`[GET /api/projects/[projectId]] Erreur:`, error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du projet" },
      { status: 500 }
    );
  }
}

/**
 * PUT: Mise à jour d'un projet
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    // Authentification
    const session = await getServerSession(req);
    if (!session?.userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Validation de l'ID
    const parseIdResult = projectIdSchema.safeParse(params);
    if (!parseIdResult.success) {
      return NextResponse.json(
        { error: "ID de projet invalide" },
        { status: 400 }
      );
    }
    const { projectId } = parseIdResult.data;

    // Vérification d'accès
    if (!(await hasProjectAccess(projectId, session.userId))) {
      return NextResponse.json(
        { error: "Vous n'avez pas accès à ce projet" },
        { status: 403 }
      );
    }

    // Validation du body
    const body = await req.json();
    const parseResult = projectUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }
    const data = parseResult.data;
    const { teamIds, userIds, ...projectData } = data;

    // Mise à jour du projet
    const updatedProject = await prisma.projects.update({
      where: { id: projectId },
      data: {
        ...projectData,
        ...(teamIds ? { teams: { set: teamIds.map((id) => ({ id })) } } : {}),
        ...(userIds ? { users: { set: userIds.map((id) => ({ id })) } } : {}),
      },
      include: {
        teams: true,
        users: { select: { id: true, name: true, image: true } },
      },
    });

    // Log d'activité
    await prisma.activityLogs.create({
      data: {
        type: "UPDATE",
        message: `Projet "${updatedProject.name}" mis à jour`,
        userId: session.userId,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error(`[PUT /api/projects/[projectId]] Erreur:`, error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du projet" },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Suppression d'un projet
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    // Authentification
    const session = await getServerSession(req);
    if (!session?.userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Validation de l'ID
    const parseResult = projectIdSchema.safeParse(params);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "ID de projet invalide" },
        { status: 400 }
      );
    }
    const { projectId } = parseResult.data;

    // Vérifier si l'utilisateur est le créateur du projet
    const project = await prisma.projects.findUnique({
      where: { id: projectId },
      select: { name: true, creatorId: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Projet non trouvé" }, { status: 404 });
    }

    if (project.creatorId !== session.userId) {
      return NextResponse.json(
        { error: "Seul le créateur du projet peut le supprimer" },
        { status: 403 }
      );
    }

    // Suppression du projet
    await prisma.projects.delete({
      where: { id: projectId },
    });

    // Log d'activité
    await prisma.activityLogs.create({
      data: {
        type: "DELETE",
        message: `Projet "${project.name}" supprimé`,
        userId: session.userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[DELETE /api/projects/[projectId]] Erreur:`, error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du projet" },
      { status: 500 }
    );
  }
}
