//@/app/api/route.ts

import { NextRequest, NextResponse } from "next/server";

// GET : Message d'accueil et liste des endpoints principaux
export async function GET(_request: NextRequest) {
  return NextResponse.json(
    {
      message: "Bienvenue sur l'API App Builder",
      endpoints: [
        "/api/users",
        "/api/teams",
        "/api/projects",
        "/api/sprints",
        "/api/tasks",
        "/api/features",
        "/api/userstories",
        "/api/roadmaps",
        "/api/comments",
        "/api/files",
        // Ajoute ici d'autres endpoints selon l'évolution de ton schéma
      ],
      documentation: "Consultez la documentation interne pour plus de détails sur chaque endpoint.",
    },
    { status: 200 }
  );
}

// POST : Exemple de réception de données globales (webhook, diagnostic, etc.)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Ici, tu pourrais traiter des requêtes globales, des webhooks, etc.
    return NextResponse.json(
      {
        message: "Données reçues avec succès à la racine de l'API",
        received: body,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erreur lors du traitement de la requête", details: error.message },
      { status: 400 }
    );
  }
}
