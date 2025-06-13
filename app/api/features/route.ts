// app/api/features/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Récupérer toutes les features d'un projet
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        {
          success: false,
          error: "projectId est requis",
        },
        { status: 400 }
      );
    }

    const features = await prisma.features.findMany({
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
      data: features,
      count: features.length,
    });
  } catch (error) {
    console.error("GET /api/features error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des features",
      },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle feature
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.projectId) {
      return NextResponse.json(
        {
          success: false,
          error: "Les champs name et projectId sont requis",
        },
        { status: 400 }
      );
    }

    // Vérifier que le projet existe
    const project = await prisma.projects.findUnique({
      where: { id: body.projectId },
    });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: "Projet non trouvé",
        },
        { status: 404 }
      );
    }

    // Validation des clés étrangères
    const validationPromises = [];

    // Vérifier parentFeatureId si fourni
    if (body.parentFeatureId) {
      validationPromises.push(
        prisma.features
          .findUnique({
            where: { id: body.parentFeatureId },
          })
          .then((parent) => {
            // parent est de type Features | null
            if (!parent) {
              throw new Error(
                `Feature parente avec l'ID ${body.parentFeatureId} non trouvée`
              );
            }
            if (parent.projectId !== body.projectId) {
              throw new Error(
                "La feature parente doit appartenir au même projet"
              );
            }
          })
      );
    }

    // Vérifier creatorId si fourni
    if (body.creatorId) {
      validationPromises.push(
        prisma.user
          .findUnique({
            where: { id: body.creatorId },
          })
          .then((user) => {
            if (!user) {
              throw new Error(
                `Utilisateur avec l'ID ${body.creatorId} non trouvé`
              );
            }
          })
      );
    }

    // Attendre toutes les validations
    await Promise.all(validationPromises);

    // Déterminer l'ordre si non fourni
    if (!body.order) {
      const maxOrder = await prisma.features.aggregate({
        where: { projectId: body.projectId },
        _max: { order: true },
      });
      body.order = (maxOrder._max.order || 0) + 100;
    }

    const newFeature = await prisma.features.create({
      data: {
        name: body.name,
        description: body.description || null,
        status: body.status || "TODO",
        priority: body.priority || 1,
        order: body.order,
        projectId: body.projectId,
        creatorId: body.creatorId || null,
        parentFeatureId: body.parentFeatureId || null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
      },
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

    return NextResponse.json(
      {
        success: true,
        data: newFeature,
        message: "Feature créée avec succès",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/features error:", error);

    if (error instanceof Error) {
      if (
        error.message.includes("Feature parente") ||
        error.message.includes("Utilisateur") ||
        error.message.includes("même projet")
      ) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la création de la feature",
      },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une feature existante
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID de la feature requis" },
        { status: 400 }
      );
    }

    // Vérifier que la feature existe
    const existingFeature = await prisma.features.findUnique({
      where: { id },
    });

    if (!existingFeature) {
      return NextResponse.json(
        { success: false, error: "Feature non trouvée" },
        { status: 404 }
      );
    }

    // Validation des clés étrangères
    const validationPromises = [];

    // Validation parentFeatureId (auto-référence)
    if (updateData.parentFeatureId !== undefined) {
      if (updateData.parentFeatureId) {
        validationPromises.push(
          prisma.features
            .findUnique({
              where: { id: updateData.parentFeatureId },
            })
            .then((parent) => {
              if (!parent) {
                throw new Error(
                  `Feature parente avec l'ID ${updateData.parentFeatureId} non trouvée`
                );
              }
              if (parent.id === id) {
                throw new Error(
                  "Une feature ne peut pas être sa propre parente"
                );
              }
              if (parent.projectId !== existingFeature.projectId) {
                throw new Error(
                  "La feature parente doit appartenir au même projet"
                );
              }
            })
        );
      }
    }

    // Validation creatorId
    if (updateData.creatorId !== undefined && updateData.creatorId) {
      validationPromises.push(
        prisma.user
          .findUnique({
            where: { id: updateData.creatorId },
          })
          .then((user) => {
            if (!user) {
              throw new Error(
                `Utilisateur avec l'ID ${updateData.creatorId} non trouvé`
              );
            }
          })
      );
    }

    // Interdire la modification du projectId pour la sécurité
    if (
      updateData.projectId &&
      updateData.projectId !== existingFeature.projectId
    ) {
      return NextResponse.json(
        { success: false, error: "Modification du projectId non autorisée" },
        { status: 403 }
      );
    }

    // Attendre toutes les validations
    await Promise.all(validationPromises);

    // Préparer les données de mise à jour
    const dataToUpdate: any = {};

    if (updateData.name !== undefined) dataToUpdate.name = updateData.name;
    if (updateData.description !== undefined)
      dataToUpdate.description = updateData.description || null;
    if (updateData.status !== undefined)
      dataToUpdate.status = updateData.status;
    if (updateData.priority !== undefined)
      dataToUpdate.priority = Number(updateData.priority);
    if (updateData.order !== undefined)
      dataToUpdate.order = Number(updateData.order);

    if (updateData.hasOwnProperty("parentFeatureId")) {
      dataToUpdate.parentFeatureId = updateData.parentFeatureId || null;
    }
    if (updateData.hasOwnProperty("creatorId")) {
      dataToUpdate.creatorId = updateData.creatorId || null;
    }

    if (updateData.startDate !== undefined) {
      dataToUpdate.startDate = updateData.startDate
        ? new Date(updateData.startDate)
        : null;
    }
    if (updateData.endDate !== undefined) {
      dataToUpdate.endDate = updateData.endDate
        ? new Date(updateData.endDate)
        : null;
    }

    // Mise à jour de la feature
    const updatedFeature = await prisma.features.update({
      where: { id },
      data: dataToUpdate,
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
      data: updatedFeature,
      message: "Feature mise à jour avec succès",
    });
  } catch (error) {
    console.error("PUT /api/features error:", error);

    if (error instanceof Error) {
      if (
        error.message.includes("Feature parente") ||
        error.message.includes("Utilisateur") ||
        error.message.includes("même projet")
      ) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Erreur lors de la mise à jour de la feature" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une feature
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID de la feature requis" },
        { status: 400 }
      );
    }

    // Vérifier que la feature existe
    const existingFeature = await prisma.features.findUnique({
      where: { id },
      include: {
        childFeatures: true,
      },
    });

    if (!existingFeature) {
      return NextResponse.json(
        { success: false, error: "Feature non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des features enfants
    if (existingFeature.childFeatures.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Impossible de supprimer une feature qui a des sous-features. Supprimez d'abord les sous-features.",
        },
        { status: 409 }
      );
    }

    // Supprimer la feature
    await prisma.features.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Feature supprimée avec succès",
    });
  } catch (error) {
    console.error("DELETE /api/features error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}

// PATCH - Réorganiser l'ordre des features
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body;

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { success: false, error: "Format de données invalide" },
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

    // Mise à jour en lot de l'ordre
    const updatePromises = updates.map(
      (update: { id: string; order: number }) =>
        prisma.features.update({
          where: { id: update.id },
          data: { order: update.order },
        })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: "Ordre des features mis à jour avec succès",
    });
  } catch (error) {
    console.error("PATCH /api/features error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la réorganisation" },
      { status: 500 }
    );
  }
}
