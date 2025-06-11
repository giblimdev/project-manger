// app/api/schemas/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Define FieldType enum to match your schema
export enum FieldType {
  STRING = "STRING",
  INT = "INT",
  FLOAT = "FLOAT",
  BOOLEAN = "BOOLEAN",
  DATETIME = "DATETIME",
  JSON = "JSON",
  ENUM = "ENUM",
}

// GET - Récupérer tous les schemas d'un projet
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

    // Récupération avec relations complètes selon votre modèle
    const schemas = await prisma.schemaFields.findMany({
      where: { projectId },
      orderBy: { order: "asc" },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
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
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: schemas,
      count: schemas.length,
    });
  } catch (error) {
    console.error("Erreur GET schemas:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur lors de la récupération des schémas",
      },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau schema
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      fieldType = FieldType.STRING,
      isRequired = false,
      isUnique = false,
      defaultValue,
      description,
      comment,
      order = 100,
      parentFieldId,
      projectId,
    } = body;

    // Validation des champs requis
    if (!name || !projectId) {
      return NextResponse.json(
        {
          success: false,
          error: "Le nom du champ et l'ID du projet sont requis",
        },
        { status: 400 }
      );
    }

    // Validation du format du nom de champ[2]
    const namePattern = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    if (!namePattern.test(name)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Le nom doit commencer par une lettre et ne contenir que des lettres, chiffres et underscores",
        },
        { status: 400 }
      );
    }

    // Vérification que le projet existe
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

    // Vérifier l'unicité du nom dans le projet
    const existingSchema = await prisma.schemaFields.findFirst({
      where: {
        projectId,
        name,
      },
    });

    if (existingSchema) {
      return NextResponse.json(
        {
          success: false,
          error: "Un champ avec ce nom existe déjà dans ce projet",
        },
        { status: 409 }
      );
    }

    // Validation du champ parent si spécifié
    if (parentFieldId) {
      const parentField = await prisma.schemaFields.findFirst({
        where: {
          id: parentFieldId,
          projectId, // S'assurer que le parent est dans le même projet
        },
      });

      if (!parentField) {
        return NextResponse.json(
          { success: false, error: "Champ parent non trouvé dans ce projet" },
          { status: 400 }
        );
      }
    }

    // Validation de la valeur par défaut selon le type
    if (defaultValue && !validateDefaultValue(defaultValue, fieldType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Valeur par défaut invalide pour le type ${fieldType}`,
        },
        { status: 400 }
      );
    }

    // Création du schema avec transaction pour assurer la cohérence
    const schema = await prisma.$transaction(async (tx) => {
      // Si aucun ordre spécifié, prendre le suivant
      let finalOrder = parseInt(order);
      if (!order) {
        const lastSchema = await tx.schemaFields.findFirst({
          where: { projectId },
          orderBy: { order: "desc" },
          select: { order: true },
        });
        finalOrder = (lastSchema?.order || 0) + 100;
      }

      return await tx.schemaFields.create({
        data: {
          name,
          fieldType,
          isRequired,
          isUnique,
          defaultValue: defaultValue || null,
          description: description || null,
          comment: comment || null,
          order: finalOrder,
          parentFieldId: parentFieldId || null,
          projectId,
        },
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
            },
          },
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        data: schema,
        message: "Champ de schéma créé avec succès",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur POST schema:", error);

    // Gestion des erreurs Prisma spécifiques
    if (typeof error === "object" && error !== null && "code" in error) {
      if ((error as any).code === "P2002") {
        return NextResponse.json(
          { success: false, error: "Un champ avec ce nom existe déjà" },
          { status: 409 }
        );
      }

      if ((error as any).code === "P2003") {
        return NextResponse.json(
          {
            success: false,
            error: "Référence invalide (projet ou champ parent)",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Erreur lors de la création du champ" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un schema
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      fieldType,
      isRequired,
      isUnique,
      defaultValue,
      description,
      comment,
      order,
      parentFieldId,
      projectId,
    } = body;

    if (!id || !name || !projectId) {
      return NextResponse.json(
        { success: false, error: "ID, nom et projectId requis" },
        { status: 400 }
      );
    }

    // Validation du format du nom
    const namePattern = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    if (!namePattern.test(name)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Le nom doit commencer par une lettre et ne contenir que des lettres, chiffres et underscores",
        },
        { status: 400 }
      );
    }

    // Vérifier que le schema existe et appartient au projet
    const existingSchema = await prisma.schemaFields.findFirst({
      where: {
        id,
        projectId,
      },
      include: {
        childFields: {
          select: { id: true },
        },
      },
    });

    if (!existingSchema) {
      return NextResponse.json(
        { success: false, error: "Schema non trouvé dans ce projet" },
        { status: 404 }
      );
    }

    // Vérifier l'unicité du nom (excluant le schema actuel)
    const duplicateSchema = await prisma.schemaFields.findFirst({
      where: {
        projectId,
        name,
        NOT: { id },
      },
    });

    if (duplicateSchema) {
      return NextResponse.json(
        {
          success: false,
          error: "Un autre champ avec ce nom existe déjà dans ce projet",
        },
        { status: 409 }
      );
    }

    // Éviter les références circulaires
    if (parentFieldId) {
      if (parentFieldId === id) {
        return NextResponse.json(
          {
            success: false,
            error: "Un champ ne peut pas être son propre parent",
          },
          { status: 400 }
        );
      }

      // Vérifier que le parent existe dans le même projet
      const parentField = await prisma.schemaFields.findFirst({
        where: {
          id: parentFieldId,
          projectId,
        },
      });

      if (!parentField) {
        return NextResponse.json(
          { success: false, error: "Champ parent non trouvé dans ce projet" },
          { status: 400 }
        );
      }

      // Vérifier les références circulaires profondes
      if (await hasCircularReference(parentFieldId, id)) {
        return NextResponse.json(
          {
            success: false,
            error: "Cette relation créerait une référence circulaire",
          },
          { status: 400 }
        );
      }
    }

    // Validation de la valeur par défaut
    if (defaultValue && !validateDefaultValue(defaultValue, fieldType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Valeur par défaut invalide pour le type ${fieldType}`,
        },
        { status: 400 }
      );
    }

    const schema = await prisma.schemaFields.update({
      where: { id },
      data: {
        name,
        fieldType,
        isRequired,
        isUnique,
        defaultValue: defaultValue || null,
        description: description || null,
        comment: comment || null,
        order: parseInt(order),
        parentFieldId: parentFieldId || null,
        updatedAt: new Date(),
      },
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
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: schema,
      message: "Champ mis à jour avec succès",
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if ((error as any).code === "P2002") {
        return NextResponse.json(
          { success: false, error: "Un champ avec ce nom existe déjà" },
          { status: 409 }
        );
      }

      if ((error as any).code === "P2003") {
        return NextResponse.json(
          { success: false, error: "Référence invalide" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

// Fonction utilitaire pour valider les valeurs par défaut
function validateDefaultValue(value: string, fieldType: FieldType): boolean {
  switch (fieldType) {
    case FieldType.STRING:
      return true; // Toute chaîne est valide
    case FieldType.INT:
      return /^-?\d+$/.test(value);
    case FieldType.FLOAT:
      return /^-?\d*\.?\d+$/.test(value);
    case FieldType.BOOLEAN:
      return ["true", "false"].includes(value.toLowerCase());
    case FieldType.DATETIME:
      return (
        ["now()", "CURRENT_TIMESTAMP"].includes(value) ||
        !isNaN(Date.parse(value))
      );
    case FieldType.JSON:
      try {
        JSON.parse(value);
        return true;
      } catch {
        return ["{}", "[]", "null"].includes(value);
      }
    case FieldType.ENUM:
      return /^[A-Z_]+$/.test(value); // Convention ENUM
    default:
      return true;
  }
}

// Fonction utilitaire pour détecter les références circulaires
async function hasCircularReference(
  parentId: string,
  childId: string
): Promise<boolean> {
  const visited = new Set<string>();

  async function checkCircular(currentId: string): Promise<boolean> {
    if (visited.has(currentId)) return false;
    if (currentId === childId) return true;

    visited.add(currentId);

    const parent = await prisma.schemaFields.findUnique({
      where: { id: currentId },
      select: { parentFieldId: true },
    });

    if (parent?.parentFieldId) {
      return await checkCircular(parent.parentFieldId);
    }

    return false;
  }

  return await checkCircular(parentId);
}
