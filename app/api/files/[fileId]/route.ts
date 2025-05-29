// app/api/files/[fileId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "@/lib/auth/auth-server";

// --- Schémas de validation Zod conformes au schéma Prisma ---
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
  name: z.string().min(1, "Le nom ne peut pas être vide").optional(),
  extension: z.string().optional().nullable(),
  url: z.string().optional(),
  type: fileTypeEnum.optional(),
  description: z.string().optional().nullable(),
  fonctionnalities: z.string().optional().nullable(),
  import: z.string().optional().nullable(),
  export: z.string().optional().nullable(),
  useby: z.string().optional().nullable(),
  script: z.string().optional().nullable(),
  version: z.string().optional().nullable(),
  order: z.number().int().min(0).optional(),
  devorder: z.number().int().min(0).optional(),
  status: statusEnum.optional(),
  creator: z.string().optional().nullable(),
  parentFileId: z.string().uuid().optional().nullable(),
});

/**
 * Vérifie si l'utilisateur a accès au fichier
 */
async function hasFileAccess(fileId: string, userId: string): Promise<boolean> {
  try {
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

    return (
      file.uploaderId === userId ||
      file.project.users.some((u) => u.id === userId)
    );
  } catch (error) {
    console.error("Erreur lors de la vérification d'accès:", error);
    return false;
  }
}

/**
 * GET: Récupération d'un fichier
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    console.log("🔍 GET /api/files/[fileId] - Début");

    // CORRECTION: Await params avant de l'utiliser
    const resolvedParams = await params;
    console.log("📋 Params résolus:", resolvedParams);

    // Authentification
    const session = await getServerSession(req);
    if (!session?.userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Validation de l'ID avec les params résolus
    const parseId = fileIdSchema.safeParse(resolvedParams);
    if (!parseId.success) {
      console.log("❌ GET - ID invalide:", {
        params: resolvedParams,
        errors: parseId.error.flatten(),
      });
      return NextResponse.json(
        {
          error: "ID de fichier invalide",
          details: parseId.error.flatten().fieldErrors,
          received: resolvedParams,
        },
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

    // Récupération du fichier
    const file = await prisma.files.findUnique({
      where: { id: fileId },
      include: {
        uploader: { select: { id: true, name: true, image: true } },
        parentFile: { select: { id: true, name: true, type: true } },
        childFiles: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
            order: true,
          },
          orderBy: { order: "asc" },
        },
        project: { select: { id: true, name: true } },
        roadMaps: { select: { id: true, title: true } },
      },
    });

    if (!file) {
      return NextResponse.json(
        { error: "Fichier non trouvé" },
        { status: 404 }
      );
    }

    console.log("✅ GET /api/files/[fileId] - Fichier trouvé");
    return NextResponse.json(file);
  } catch (error) {
    console.error(`[GET /api/files/[fileId]] Erreur:`, error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du fichier" },
      { status: 500 }
    );
  }
}

/**
 * PUT: Mise à jour d'un fichier
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    console.log("🔥 PUT /api/files/[fileId] - Début");

    // CORRECTION: Await params avant de l'utiliser
    const resolvedParams = await params;
    console.log("📋 Params résolus:", resolvedParams);
    console.log("📋 Type de params résolu:", typeof resolvedParams);
    console.log("📋 Keys de params résolu:", Object.keys(resolvedParams));
    console.log("📋 fileId reçu:", resolvedParams.fileId);
    console.log("📋 Type de fileId:", typeof resolvedParams.fileId);

    // Authentification
    const session = await getServerSession(req);
    if (!session?.userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Validation de l'ID avec les params résolus
    console.log(
      "🔍 Avant validation Zod - params résolus:",
      JSON.stringify(resolvedParams, null, 2)
    );
    const parseId = fileIdSchema.safeParse(resolvedParams);
    if (!parseId.success) {
      console.log("❌ PUT - ID invalide:", {
        params: resolvedParams,
        paramsStringified: JSON.stringify(resolvedParams),
        errors: parseId.error.flatten(),
        issues: parseId.error.issues,
      });
      return NextResponse.json(
        {
          error: "ID de fichier invalide",
          details: parseId.error.flatten().fieldErrors,
          received: resolvedParams,
          receivedStringified: JSON.stringify(resolvedParams),
          issues: parseId.error.issues,
        },
        { status: 400 }
      );
    }
    const { fileId } = parseId.data;
    console.log("✅ ID validé:", fileId);

    // Vérification d'accès
    if (!(await hasFileAccess(fileId, session.userId))) {
      return NextResponse.json(
        { error: "Vous n'avez pas accès à ce fichier" },
        { status: 403 }
      );
    }

    // Validation du body
    let body;
    try {
      body = await req.json();
      console.log("📥 PUT Body reçu:", body);
      console.log("📥 Type de body:", typeof body);
      console.log("📥 Keys de body:", Object.keys(body));
    } catch (error) {
      console.log("❌ Erreur lors de la lecture du body:", error);
      return NextResponse.json(
        { error: "Corps de requête invalide" },
        { status: 400 }
      );
    }

    console.log("🔍 Avant validation body Zod:", JSON.stringify(body, null, 2));
    const parseResult = fileUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      console.log("❌ PUT - Validation body échouée:", {
        body,
        bodyStringified: JSON.stringify(body),
        errors: parseResult.error.flatten(),
        issues: parseResult.error.issues,
      });
      return NextResponse.json(
        {
          error: "Données invalides",
          details: parseResult.error.flatten().fieldErrors,
          received: body,
          issues: parseResult.error.issues,
        },
        { status: 400 }
      );
    }

    console.log("✅ Body validé:", parseResult.data);

    // Vérification de la hiérarchie si parentFileId est fourni
    if (parseResult.data.parentFileId) {
      console.log(
        "🔍 Vérification du fichier parent:",
        parseResult.data.parentFileId
      );
      const parentFile = await prisma.files.findUnique({
        where: { id: parseResult.data.parentFileId },
        select: { id: true, projectId: true },
      });

      if (!parentFile) {
        return NextResponse.json(
          { error: "Fichier parent non trouvé" },
          { status: 400 }
        );
      }

      const currentFile = await prisma.files.findUnique({
        where: { id: fileId },
        select: { projectId: true },
      });

      if (currentFile && parentFile.projectId !== currentFile.projectId) {
        return NextResponse.json(
          { error: "Le fichier parent doit appartenir au même projet" },
          { status: 400 }
        );
      }
    }

    // Mise à jour du fichier
    console.log("🔄 Mise à jour avec les données:", parseResult.data);
    const updatedFile = await prisma.files.update({
      where: { id: fileId },
      data: parseResult.data,
      include: {
        uploader: { select: { id: true, name: true, image: true } },
        parentFile: { select: { id: true, name: true, type: true } },
        childFiles: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
            order: true,
          },
          orderBy: { order: "asc" },
        },
        project: { select: { id: true, name: true } },
        roadMaps: { select: { id: true, title: true } },
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

    console.log("✅ PUT /api/files/[fileId] - Fichier mis à jour avec succès");
    return NextResponse.json(updatedFile);
  } catch (error) {
    console.error(`[PUT /api/files/[fileId]] Erreur complète:`, error);
    if (error instanceof Error) {
      console.error(`[PUT /api/files/[fileId]] Stack trace:`, error.stack);
    } else {
      console.error(`[PUT /api/files/[fileId]] Stack trace:`, error);
    }
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
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    console.log("🗑️ DELETE /api/files/[fileId] - Début");

    // CORRECTION: Await params avant de l'utiliser
    const resolvedParams = await params;
    console.log("📋 Params résolus:", resolvedParams);

    // Authentification
    const session = await getServerSession(req);
    if (!session?.userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Validation de l'ID avec les params résolus
    console.log(
      "🔍 Avant validation Zod - params résolus:",
      JSON.stringify(resolvedParams, null, 2)
    );
    const parseId = fileIdSchema.safeParse(resolvedParams);
    if (!parseId.success) {
      console.log("❌ DELETE - ID invalide:", {
        params: resolvedParams,
        paramsStringified: JSON.stringify(resolvedParams),
        errors: parseId.error.flatten(),
        issues: parseId.error.issues,
      });
      return NextResponse.json(
        {
          error: "ID de fichier invalide",
          details: parseId.error.flatten().fieldErrors,
          received: resolvedParams,
          receivedStringified: JSON.stringify(resolvedParams),
        },
        { status: 400 }
      );
    }
    const { fileId } = parseId.data;
    console.log("✅ ID validé:", fileId);

    // Vérification d'accès
    if (!(await hasFileAccess(fileId, session.userId))) {
      return NextResponse.json(
        { error: "Vous n'avez pas accès à ce fichier" },
        { status: 403 }
      );
    }

    // Récupérer le fichier et vérifier s'il a des enfants
    const file = await prisma.files.findUnique({
      where: { id: fileId },
      select: {
        name: true,
        childFiles: { select: { id: true } },
      },
    });

    if (!file) {
      return NextResponse.json(
        { error: "Fichier non trouvé" },
        { status: 404 }
      );
    }

    // Empêcher la suppression si le fichier a des enfants
    if (file.childFiles.length > 0) {
      return NextResponse.json(
        {
          error:
            "Impossible de supprimer un fichier qui a des fichiers enfants",
        },
        { status: 400 }
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

    console.log("✅ DELETE /api/files/[fileId] - Fichier supprimé avec succès");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[DELETE /api/files/[fileId]] Erreur complète:`, error);
    if (error instanceof Error) {
      console.error(`[DELETE /api/files/[fileId]] Stack trace:`, error.stack);
    } else {
      console.error(`[DELETE /api/files/[fileId]] Stack trace:`, error);
    }
    return NextResponse.json(
      { error: "Erreur lors de la suppression du fichier" },
      { status: 500 }
    );
  }
}
