//@/app/api/tasks/[taskId]/route.ts


 import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Status } from "@/lib/generated/prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Schéma de validation pour la mise à jour d'une tâche
const updateTaskSchema = z.object({
  title: z.string().min(1, "Le titre est requis").optional(),
  description: z.string().optional(),
  status: z.nativeEnum(Status).optional(),
  priority: z.number().int().optional(),
  dueDate: z.coerce.date().optional(),
  projectId: z.string().uuid().optional(),
  assigneeId: z.string().uuid().optional(),
  parentTaskId: z.string().uuid().optional(),
});

// GET : Récupérer une tâche par ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;

  if (!taskId) {
    return NextResponse.json({ error: "Task ID requis" }, { status: 400 });
  }

  try {
    const task = await prisma.tasks.findUnique({
      where: { id: taskId },
      include: {
        project: true,
        assignee: true,
        parentTask: true,
        childTasks: true,
        timeLogs: true,
        comments: true,
        roadMaps: true,
        features: true,
        userStories: true,
        sprints: true,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Tâche introuvable" }, { status: 404 });
    }

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de la tâche :", error);
    return NextResponse.json({ error: "Erreur interne serveur" }, { status: 500 });
  }
}

// PUT : Mettre à jour une tâche par ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;

  if (!taskId) {
    return NextResponse.json({ error: "Task ID requis" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const validation = updateTaskSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Corps de requête invalide", details: validation.error.errors },
        { status: 400 }
      );
    }

    const task = await prisma.tasks.findUnique({ where: { id: taskId } });
    if (!task) {
      return NextResponse.json({ error: "Tâche introuvable" }, { status: 404 });
    }

    const updatedTask = await prisma.tasks.update({
      where: { id: taskId },
      data: {
        ...validation.data,
        dueDate: validation.data.dueDate ?? undefined,
      },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche :", error);
    return NextResponse.json({ error: "Erreur interne serveur" }, { status: 500 });
  }
}

// DELETE : Supprimer une tâche par ID
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;

  if (!taskId) {
    return NextResponse.json({ error: "Task ID requis" }, { status: 400 });
  }

  try {
    const task = await prisma.tasks.findUnique({ where: { id: taskId } });
    if (!task) {
      return NextResponse.json({ error: "Tâche introuvable" }, { status: 404 });
    }

    await prisma.tasks.delete({ where: { id: taskId } });

    return NextResponse.json({ message: "Tâche supprimée avec succès" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche :", error);
    return NextResponse.json({ error: "Erreur interne serveur" }, { status: 500 });
  }
}
