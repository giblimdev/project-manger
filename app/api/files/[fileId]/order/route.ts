// app/api/files/[fileId]/order/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "@/lib/auth/auth-server";

// Schéma de validation pour la mise à jour de l'ordre
const orderUpdateSchema = z.object({
  order: z.number().int().min(1).optional(),
  devorder: z.number().int().min(1).optional(),
});

// Schéma pour valider l'ID du fichier
const fileIdSchema = z.object({
  fileId: z.string().uuid("L'ID du fichier doit être un UUID valide"),
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
 * PATCH: Mise à jour de l'ordre d'un fichier
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    console.log("🔄 PATCH /api/files/[fileId]/order - Début");

    // Résolution des paramètres
    const resolvedParams = await params;
    console.log("📋 Params résolus:", resolvedParams);

    // Authentification
    const session = await getServerSession(req);
    if (!session?.userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Validation de l'ID du fichier
    const parseId = fileIdSchema.safeParse(resolvedParams);
    if (!parseId.success) {
      console.log("❌ PATCH - ID invalide:", {
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

    // Validation du body
    let body;
    try {
      body = await req.json();
      console.log("📥 PATCH Body reçu:", body);
    } catch (error) {
      console.log("❌ Erreur lors de la lecture du body:", error);
      return NextResponse.json(
        { error: "Corps de requête invalide" },
        { status: 400 }
      );
    }

    // Validation des données d'ordre
    const parseResult = orderUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      console.log("❌ PATCH - Validation body échouée:", {
        body,
        errors: parseResult.error.flatten(),
      });
      return NextResponse.json(
        {
          error: "Données d'ordre invalides",
          details: parseResult.error.flatten().fieldErrors,
          received: body,
        },
        { status: 400 }
      );
    }

    // Vérifier qu'au moins un champ est fourni
    if (!parseResult.data.order && !parseResult.data.devorder) {
      return NextResponse.json(
        { error: "Au moins un champ 'order' ou 'devorder' doit être fourni" },
        { status: 400 }
      );
    }

    console.log("✅ Données d'ordre validées:", parseResult.data);

    // Vérifier que le fichier existe
    const existingFile = await prisma.files.findUnique({
      where: { id: fileId },
      select: { id: true, name: true, order: true, devorder: true },
    });

    if (!existingFile) {
      return NextResponse.json(
        { error: "Fichier non trouvé" },
        { status: 404 }
      );
    }

    // Mise à jour de l'ordre
    console.log(
      "🔄 Mise à jour de l'ordre avec les données:",
      parseResult.data
    );
    const updatedFile = await prisma.files.update({
      where: { id: fileId },
      data: parseResult.data,
      select: {
        id: true,
        name: true,
        order: true,
        devorder: true,
      },
    });

    // Log d'activité
    const orderChanges = [];
    if (parseResult.data.order !== undefined) {
      orderChanges.push(
        `ordre d'affichage: ${existingFile.order} → ${parseResult.data.order}`
      );
    }
    if (parseResult.data.devorder !== undefined) {
      orderChanges.push(
        `ordre de développement: ${existingFile.devorder} → ${parseResult.data.devorder}`
      );
    }

    await prisma.activityLogs.create({
      data: {
        type: "UPDATE",
        message: `Ordre du fichier "${updatedFile.name}" mis à jour (${orderChanges.join(", ")})`,
        userId: session.userId,
      },
    });

    console.log(
      "✅ PATCH /api/files/[fileId]/order - Ordre mis à jour avec succès"
    );
    return NextResponse.json({
      success: true,
      file: updatedFile,
      message: "Ordre mis à jour avec succès",
    });
  } catch (error) {
    console.error(`[PATCH /api/files/[fileId]/order] Erreur complète:`, error);
    if (error instanceof Error) {
      console.error(
        `[PATCH /api/files/[fileId]/order] Stack trace:`,
        error.stack
      );
    }
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'ordre du fichier" },
      { status: 500 }
    );
  }
}
