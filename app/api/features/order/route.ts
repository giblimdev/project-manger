// app/api/features/order/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// ✅ Pattern singleton pour éviter les problèmes d'initialisation
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// PATCH - Mettre à jour l'ordre des features (méthode recommandée)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, updates } = body;

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "projectId est requis" },
        { status: 400 }
      );
    }

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { success: false, error: "Le tableau updates est requis" },
        { status: 400 }
      );
    }

    // Validation des données
    for (const update of updates) {
      if (!update.id || typeof update.order !== "number") {
        return NextResponse.json(
          {
            success: false,
            error: "Chaque mise à jour doit contenir un id et un order valides",
          },
          { status: 400 }
        );
      }
    }

    // Vérifier que toutes les features appartiennent au projet
    const featureIds = updates.map((update: { id: string }) => update.id);
    const existingFeatures = await prisma.features.findMany({
      where: {
        id: { in: featureIds },
        projectId: projectId,
      },
    });

    if (existingFeatures.length !== featureIds.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Certaines features n'appartiennent pas à ce projet",
        },
        { status: 403 }
      );
    }

    // Mise à jour en transaction pour garantir la cohérence
    await prisma.$transaction(
      async (tx: {
        features: {
          update: (arg0: {
            where: { id: string };
            data: { order: number };
          }) => any;
        };
      }) => {
        const updatePromises = updates.map(
          (update: { id: string; order: number }) =>
            tx.features.update({
              where: { id: update.id },
              data: { order: update.order },
            })
        );

        await Promise.all(updatePromises);
      }
    );

    // Récupérer les features mises à jour avec leurs relations
    const updatedFeatures = await prisma.features.findMany({
      where: { projectId },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        parentFeature: {
          select: { id: true, name: true },
        },
        childFeatures: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Ordre des features mis à jour avec succès",
      data: updatedFeatures,
    });
  } catch (error) {
    console.error("PATCH /api/features/order error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la mise à jour de l'ordre" },
      { status: 500 }
    );
  }
}
