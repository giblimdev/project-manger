// app/api/files/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "@/lib/auth/auth-server";

// 1. Schémas de validation Zod
const fileQuerySchema = z.object({
  projectId: z.string().uuid("projectId doit être un UUID"),
});

const fileCreateSchema = z.object({
  name: z.string(),
  extension: z.string().optional(),
  url: z.string().url(),
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
  description: z.string().optional(),
  fonctionnalities: z.string().optional(),
  import: z.string().optional(),
  export: z.string().optional(),
  useby: z.string().optional(),
  script: z.string().optional(),
  version: z.string().optional(),
  order: z.number().optional(),
  devorder: z.number().optional(),
  status: z
    .enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE", "BLOCKED", "CANCELLED"])
    .optional(),
  projectId: z.string().uuid(),
  parentFileId: z.string().uuid().optional(),
});

// 2. GET : Liste des fichiers d’un projet
export async function GET(req: NextRequest) {
  try {
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

    // Vérifier que l'utilisateur a accès au projet (optionnel mais recommandé)
    const project = await prisma.projects.findUnique({
      where: { id: projectId! },
      select: { users: { select: { id: true } } },
    });
    if (!project || !project.users.some((u) => u.id === session.userId)) {
      return NextResponse.json(
        { error: "Accès refusé au projet" },
        { status: 403 }
      );
    }

    // Récupérer les fichiers
    const files = await prisma.files.findMany({
      where: { projectId: projectId! },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: {
        uploader: { select: { id: true, name: true, image: true } },
        parentFile: { select: { id: true, name: true } },
        childFiles: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error("[GET /api/files] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des fichiers" },
      { status: 500 }
    );
  }
}

// 3. POST : Upload d’un fichier
export async function POST(req: NextRequest) {
  try {
    // Authentification
    const session = await getServerSession(req);
    if (!session?.userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Validation du body
    const body = await req.json();
    const parseResult = fileCreateSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Vérifier que l'utilisateur a accès au projet (optionnel mais recommandé)
    const project = await prisma.projects.findUnique({
      where: { id: data.projectId },
      select: { users: { select: { id: true } } },
    });
    if (!project || !project.users.some((u) => u.id === session.userId)) {
      return NextResponse.json(
        { error: "Accès refusé au projet" },
        { status: 403 }
      );
    }

    // Création du fichier
    const file = await prisma.files.create({
      data: {
        ...data,
        uploaderId: session.userId,
      },
      include: {
        uploader: { select: { id: true, name: true, image: true } },
        parentFile: { select: { id: true, name: true } },
        childFiles: { select: { id: true, name: true } },
      },
    });

    // Log d'activité (optionnel)
    await prisma.activityLogs.create({
      data: {
        type: "CREATE",
        message: `Fichier "${file.name}" ajouté au projet`,
        userId: session.userId,
      },
    });

    return NextResponse.json(file, { status: 201 });
  } catch (error) {
    console.error("[POST /api/files] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload du fichier" },
      { status: 500 }
    );
  }
}
