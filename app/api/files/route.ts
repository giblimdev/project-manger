// app/api/files/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "@/lib/auth/auth-server";

// 1. Schémas de validation Zod selon votre schéma Files exact
const fileQuerySchema = z.object({
  projectId: z.string().uuid("projectId doit être un UUID"),
});

const fileCreateSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  extension: z.string().nullable().optional(),
  url: z.string().min(1, "L'URL est requise"),
  type: z.enum([
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
  ]),
  description: z.string().nullable().optional(),
  fonctionnalities: z.string().nullable().optional(),
  import: z.string().nullable().optional(),
  export: z.string().nullable().optional(),
  useby: z.string().nullable().optional(),
  script: z.string().nullable().optional(),
  version: z.string().nullable().optional(),
  order: z.coerce.number().int().min(1).default(100),
  devorder: z.coerce.number().int().min(1).default(100),
  status: z
    .enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE", "BLOCKED", "CANCELLED"])
    .default("TODO"),
  projectId: z.string().uuid(),
  parentFileId: z.string().uuid().nullable().optional(),
});

// 2. GET : Liste des fichiers d'un projet avec TOUTES les relations selon votre schéma
export async function GET(req: NextRequest) {
  try {
    console.log("🔍 GET /api/files - Début");

    // Authentification
    const session = await getServerSession(req);
    if (!session?.userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Récupération et validation du projectId
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const parseResult = fileQuerySchema.safeParse({ projectId });

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Paramètre projectId invalide" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur a accès au projet selon votre schéma Projects
    const project = await prisma.projects.findUnique({
      where: { id: projectId! },
      select: {
        users: { select: { id: true } },
        name: true,
      },
    });

    if (!project || !project.users.some((u) => u.id === session.userId)) {
      return NextResponse.json(
        { error: "Accès refusé au projet" },
        { status: 403 }
      );
    }

    // ✅ CORRECTION : Récupérer les fichiers avec TOUTES les relations selon votre schéma Files
    const files = await prisma.files.findMany({
      where: { projectId: projectId! },
      orderBy: [{ order: "asc" }, { devorder: "asc" }, { createdAt: "desc" }],
      include: {
        // ✅ Relation obligatoire selon votre schéma Files → User
        uploader: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
            role: true,
          },
        },
        // ✅ Relation obligatoire selon votre schéma Files → Projects
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
            priority: true,
          },
        },
        // ✅ Relation optionnelle selon votre schéma Files → Files (FileHierarchy)
        parentFile: {
          select: {
            id: true,
            name: true,
            type: true,
            url: true,
            status: true,
          },
        },
        // ✅ Relation selon votre schéma Files ← Files (FileHierarchy inverse)
        childFiles: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
            url: true,
            order: true,
            devorder: true,
            extension: true,
          },
          orderBy: [{ order: "asc" }, { devorder: "asc" }],
        },
        // ✅ Relation optionnelle selon votre schéma Files ↔ RoadMap (many-to-many)
        roadMaps: {
          select: {
            id: true,
            title: true,
            phase: true,
            priority: true,
            progress: true,
            estimatedDays: true,
          },
        },
      },
    });

    console.log(
      `✅ GET /api/files - ${files.length} fichiers trouvés avec toutes les relations`
    );

    // ✅ Retourner directement le tableau selon votre structure
    return NextResponse.json(files);
  } catch (error) {
    console.error("[GET /api/files] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des fichiers" },
      { status: 500 }
    );
  }
}

// 3. POST : Création d'un fichier selon votre schéma Files exact
export async function POST(req: NextRequest) {
  try {
    console.log("🔥 POST /api/files - Début");

    // Authentification
    const session = await getServerSession(req);
    if (!session?.userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Validation du body
    const body = await req.json();
    console.log("📥 POST Données reçues:", body);

    const parseResult = fileCreateSchema.safeParse(body);

    if (!parseResult.success) {
      console.error("❌ Validation échouée:", parseResult.error.errors);
      return NextResponse.json(
        { error: "Données invalides", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Vérifier que l'utilisateur a accès au projet selon votre schéma Projects
    const project = await prisma.projects.findUnique({
      where: { id: data.projectId },
      select: {
        users: { select: { id: true } },
        name: true,
        id: true,
      },
    });

    if (!project || !project.users.some((u) => u.id === session.userId)) {
      return NextResponse.json(
        { error: "Accès refusé au projet" },
        { status: 403 }
      );
    }

    // Vérifier le fichier parent si spécifié (relation FileHierarchy selon votre schéma)
    if (data.parentFileId) {
      const parentFile = await prisma.files.findFirst({
        where: {
          id: data.parentFileId,
          projectId: data.projectId,
        },
        select: { id: true, name: true },
      });

      if (!parentFile) {
        return NextResponse.json(
          { error: "Fichier parent introuvable dans ce projet" },
          { status: 400 }
        );
      }
    }

    // ✅ Création du fichier selon votre schéma Files exact
    const file = await prisma.files.create({
      data: {
        // Champs obligatoires selon votre schéma Files
        name: data.name,
        url: data.url,
        type: data.type,
        projectId: data.projectId,
        uploaderId: session.userId,

        // Champs optionnels selon votre schéma Files
        extension: data.extension || null,
        description: data.description || null,
        fonctionnalities: data.fonctionnalities || null,
        import: data.import || null,
        export: data.export || null,
        useby: data.useby || null,
        script: data.script || null,
        version: data.version || null,
        creator: session.userId, // Champ optionnel selon votre schéma
        parentFileId: data.parentFileId || null,

        // Champs avec defaults selon votre schéma Files
        order: data.order || 100,
        devorder: data.devorder || 100,
        status: data.status || "TODO",
      },
      include: {
        // ✅ Inclure toutes les relations selon votre schéma Files
        uploader: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
            role: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
          },
        },
        parentFile: {
          select: {
            id: true,
            name: true,
            type: true,
            url: true,
          },
        },
        childFiles: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
            url: true,
          },
        },
        roadMaps: {
          select: {
            id: true,
            title: true,
            phase: true,
            priority: true,
          },
        },
      },
    });

    // Log d'activité selon votre schéma ActivityLogs
    await prisma.activityLogs.create({
      data: {
        type: "CREATE",
        message: `Fichier "${file.name}" ajouté au projet "${project.name}"`,
        userId: session.userId,
      },
    });

    console.log(
      `✅ POST /api/files - Fichier créé: ${file.id} avec toutes les relations`
    );
    return NextResponse.json(file, { status: 201 });
  } catch (error) {
    console.error("[POST /api/files] Erreur:", error);

    // Gestion des erreurs spécifiques selon votre schéma
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "Un fichier avec ce nom existe déjà dans ce projet" },
          { status: 409 }
        );
      }
      if (error.message.includes("Foreign key constraint")) {
        return NextResponse.json(
          {
            error: "Référence invalide (projet, utilisateur ou fichier parent)",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Erreur lors de la création du fichier" },
      { status: 500 }
    );
  }
}
