// app/api/files/[fileId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "@/lib/auth/auth-server";

// --- Schémas de validation Zod ---
const fileIdSchema = z.object({
  fileId: z.string().uuid("L'ID du fichier doit être un UUID valide"),
});
const statusEnum = z.enum([
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
  "BLOCKED",
  "CANCELLED",
]);
const fileTypeEnum = z.enum([
  "PAGE",
  "COMPONENT",
  "UTIL",
  "LIB",
  "STORE",
  "DOCUMENT",
  "IMAGE",
  "SPREADSHEET",
  "PRESENTATION",
  "ARCHIVE",
  "CODE",
  "OTHER",
]);
const fileUpdateSchema = z.object({
  name: z.string().optional(),
  extension: z.string().optional(),
  url: z.string().url().optional(),
  type: fileTypeEnum.optional(),
  description: z.string().optional(),
  fonctionnalities: z.string().optional(),
  import: z.string().optional(),
  export: z.string().optional(),
  useby: z.string().optional(),
  script: z.string().optional(),
  version: z.string().optional(),
  order: z.number().optional(),
  devorder: z.number().optional(),
  status: statusEnum.optional(),
  parentFileId: z.string().uuid().optional().nullable(),
});

/**
 * Vérifie si l'utilisateur a accès au fichier
 */
async function hasFileAccess(fileId: string, userId: string): Promise<boolean> {
  const file = await prisma.files.findUnique({
    where: { id: fileId },
    select: {
      project: {
        select: {
          users: { select: { id: true } },
        },
      },
      uploaderId: true,
    },
  });
  if (!file) return false;
  // Accès si l'utilisateur est uploader ou membre du projet
  return (
    file.uploaderId === userId ||
    file.project.users.some((u) => u.id === userId)
  );
}

/**
 * PUT: Mise à jour d'un fichier
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    // Authentification
    const session = await getServerSession(req);
    if (!session?.userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Validation de l'ID
    const parseId = fileIdSchema.safeParse(params);
    if (!parseId.success) {
      return NextResponse.json(
        { error: "ID de fichier invalide" },
        { status: 400 }
      );
    }
    const { fileId } = parseId.data;

    // Vérification d'accès
    if (!(await hasFileAccess(fileId, session.userId))) {
      return NextResponse.json(
        { error: "Vous n'avez pas accès à ce fichier" },
        { status: 403 }
      );
    }

    // Validation du body
    const body = await req.json();
    const parseResult = fileUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    // Mise à jour du fichier
    const updatedFile = await prisma.files.update({
      where: { id: fileId },
      data: parseResult.data,
      include: {
        uploader: { select: { id: true, name: true, image: true } },
        parentFile: { select: { id: true, name: true } },
        childFiles: { select: { id: true, name: true } },
      },
    });

    // Log d'activité
    await prisma.activityLogs.create({
      data: {
        type: "UPDATE",
        message: `Fichier "${updatedFile.name}" mis à jour`,
        userId: session.userId,
      },
    });

    return NextResponse.json(updatedFile);
  } catch (error) {
    console.error(`[PUT /api/files/[fileId]] Erreur:`, error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du fichier" },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Suppression d'un fichier
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    // Authentification
    const session = await getServerSession(req);
    if (!session?.userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Validation de l'ID
    const parseId = fileIdSchema.safeParse(params);
    if (!parseId.success) {
      return NextResponse.json(
        { error: "ID de fichier invalide" },
        { status: 400 }
      );
    }
    const { fileId } = parseId.data;

    // Vérification d'accès
    if (!(await hasFileAccess(fileId, session.userId))) {
      return NextResponse.json(
        { error: "Vous n'avez pas accès à ce fichier" },
        { status: 403 }
      );
    }

    // Récupérer le nom pour le log
    const file = await prisma.files.findUnique({
      where: { id: fileId },
      select: { name: true },
    });

    if (!file) {
      return NextResponse.json(
        { error: "Fichier non trouvé" },
        { status: 404 }
      );
    }

    // Suppression du fichier
    await prisma.files.delete({
      where: { id: fileId },
    });

    // Log d'activité
    await prisma.activityLogs.create({
      data: {
        type: "DELETE",
        message: `Fichier "${file.name}" supprimé`,
        userId: session.userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[DELETE /api/files/[fileId]] Erreur:`, error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du fichier" },
      { status: 500 }
    );
  }
}
