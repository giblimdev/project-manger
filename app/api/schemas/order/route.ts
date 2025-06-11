// app/api/schemas/order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Interface pour typer les données de mise à jour d'ordre
interface OrderUpdate {
  id: string;
  order: number;
}

interface OrderUpdateRequest {
  projectId: string;
  updates: OrderUpdate[];
}

// PATCH - Mettre à jour l'ordre des schemas
export async function PATCH(request: NextRequest) {
  try {
    const body: OrderUpdateRequest = await request.json();
    const { projectId, updates } = body;

    // Validation des paramètres requis
    if (!projectId || !updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { success: false, error: "ProjectId et updates requis" },
        { status: 400 }
      );
    }

    // Validation que tous les updates ont les champs requis
    const invalidUpdates = updates.filter(
      (update) =>
        !update.id || typeof update.order !== "number" || update.order < 1
    );

    if (invalidUpdates.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Tous les updates doivent avoir un id et un order valide (>= 1)",
        },
        { status: 400 }
      );
    }

    // Vérifier que le projet existe
    const projectExists = await prisma.projects.findUnique({
      where: { id: projectId },
      select: { id: true },
    });

    if (!projectExists) {
      return NextResponse.json(
        { success: false, error: "Projet non trouvé" },
        { status: 404 }
      );
    }

    // Extraire les IDs des schemas à mettre à jour
    const schemaIds = updates.map((update) => update.id);

    // Vérifier que tous les schemas appartiennent au projet
    const schemasInProject = await prisma.schemaFields.findMany({
      where: {
        id: { in: schemaIds },
        projectId,
      },
      select: { id: true },
    });

    if (schemasInProject.length !== schemaIds.length) {
      const foundIds = schemasInProject.map((s: { id: any }) => s.id);
      const missingIds = schemaIds.filter((id) => !foundIds.includes(id));

      return NextResponse.json(
        {
          success: false,
          error: `Certains schemas n'appartiennent pas à ce projet ou n'existent pas: ${missingIds.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Vérifier qu'il n'y a pas de doublons dans les ordres
    const orders = updates.map((u) => u.order);
    const uniqueOrders = new Set(orders);
    if (orders.length !== uniqueOrders.size) {
      return NextResponse.json(
        { success: false, error: "Les ordres doivent être uniques" },
        { status: 400 }
      );
    }

    // Utiliser une transaction pour assurer la cohérence
    const result = await prisma.$transaction(async (tx) => {
      // Mettre à jour l'ordre de chaque schema
      const updatePromises = updates.map(({ id, order }) =>
        tx.schemaFields.update({
          where: { id },
          data: {
            order: parseInt(order.toString()),
            updatedAt: new Date(),
          },
        })
      );

      await Promise.all(updatePromises);

      // Récupérer tous les schemas mis à jour du projet
      const updatedSchemas = await tx.schemaFields.findMany({
        where: { projectId },
        orderBy: { order: "asc" },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
          parentField: {
            select: {
              id: true,
              name: true,
              fieldType: true,
            },
          },
          childFields: {
            select: {
              id: true,
              name: true,
              fieldType: true,
              order: true,
            },
            orderBy: [{ order: "asc" }],
          },
        },
      });

      return updatedSchemas;
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: `Ordre mis à jour avec succès pour ${updates.length} schéma(s)`,
      updatedCount: updates.length,
    });
  } catch (error) {
    console.error("Erreur PATCH schemas order:", error);

    // Gestion des erreurs Prisma spécifiques
    if (typeof error === "object" && error !== null && "code" in error) {
      if ((error as any).code === "P2002") {
        return NextResponse.json(
          { success: false, error: "Conflit d'ordre détecté" },
          { status: 409 }
        );
      }

      if ((error as any).code === "P2025") {
        return NextResponse.json(
          { success: false, error: "Un ou plusieurs schemas non trouvés" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Erreur lors de la mise à jour de l'ordre" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET - Récupérer l'ordre actuel des schemas (optionnel)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "ProjectId requis" },
        { status: 400 }
      );
    }

    const schemas = await prisma.schemaFields.findMany({
      where: { projectId },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        order: true,
        fieldType: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: schemas,
      message: `${schemas.length} schéma(s) trouvé(s)`,
    });
  } catch (error) {
    console.error("Erreur GET schemas order:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération de l'ordre" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
