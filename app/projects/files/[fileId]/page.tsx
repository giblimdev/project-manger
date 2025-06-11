// app/files/[fileId]/page.tsx

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Download, Share, Trash2 } from "lucide-react";
import Link from "next/link";

// Type pour les paramètres selon Next.js 15+
interface FilePageProps {
  params: Promise<{
    fileId: string;
  }>;
}

// Fonction pour récupérer les détails du fichier selon votre schéma
async function getFileDetails(fileId: string) {
  const file = await prisma.files.findUnique({
    where: {
      id: fileId,
    },
    include: {
      project: {
        select: { id: true, name: true },
      },
      uploader: {
        select: { id: true, name: true, image: true },
      },
      parentFile: {
        select: { id: true, name: true, type: true },
      },
      childFiles: {
        select: { id: true, name: true, type: true, status: true },
        orderBy: [{ order: "asc" }, { devorder: "asc" }],
      },
      roadMaps: {
        select: { id: true, title: true, phase: true },
      },
    },
  });

  return file;
}

// Labels selon votre schéma
const statusLabels = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  REVIEW: "À relire",
  DONE: "Terminé",
  BLOCKED: "Bloqué",
  CANCELLED: "Annulé",
} as const;

const statusColors = {
  TODO: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  REVIEW: "bg-yellow-100 text-yellow-800",
  DONE: "bg-green-100 text-green-800",
  BLOCKED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-500",
} as const;

const fileTypeLabels = {
  PAGE: "Page",
  COMPONENT: "Composant",
  UTIL: "Utilitaire",
  LIB: "Librairie",
  STORE: "Store",
  DOCUMENT: "Document",
  IMAGE: "Image",
  SPREADSHEET: "Tableur",
  PRESENTATION: "Présentation",
  ARCHIVE: "Archive",
  CODE: "Code",
  OTHER: "Autre",
} as const;

export default async function FileDetailsPage({ params }: FilePageProps) {
  // Résolution des paramètres selon Next.js 15+
  const resolvedParams = await params;
  const { fileId } = resolvedParams;

  // Récupération des détails du fichier selon votre schéma Files
  const file = await getFileDetails(fileId);

  if (!file) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      {/* Header avec navigation */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/files">
          <Button variant="outline" size="icon">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{file.name}</h1>
          <p className="text-gray-600">
            Projet: <span className="font-medium">{file.project.name}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Télécharger
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Share size={16} />
            Partager
          </Button>
          <Button className="flex items-center gap-2">
            <Edit size={16} />
            Modifier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale - Détails du fichier selon votre schéma Files */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations générales selon votre modèle Files */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Informations générales
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{fileTypeLabels[file.type]}</Badge>
                  <Badge className={statusColors[file.status]}>
                    {statusLabels[file.status]}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* URL - champ obligatoire selon votre schéma */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    URL
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded font-mono">
                    {file.url}
                  </p>
                </div>

                {/* Extension - champ optionnel selon votre schéma */}
                {file.extension && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Extension
                    </label>
                    <p className="text-sm text-gray-900">{file.extension}</p>
                  </div>
                )}

                {/* Version - champ optionnel selon votre schéma */}
                {file.version && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Version
                    </label>
                    <p className="text-sm text-gray-900">{file.version}</p>
                  </div>
                )}

                {/* Order - champ avec default 100 selon votre schéma */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Ordre d'affichage
                  </label>
                  <p className="text-sm text-gray-900">{file.order}</p>
                </div>

                {/* Devorder - champ avec default 100 selon votre schéma */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Ordre de développement
                  </label>
                  <p className="text-sm text-gray-900">{file.devorder}</p>
                </div>

                {/* CreatedAt - champ automatique selon votre schéma */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Créé le
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(file.createdAt)}
                  </p>
                </div>

                {/* Creator - champ optionnel selon votre schéma */}
                {file.creator && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Créateur
                    </label>
                    <p className="text-sm text-gray-900">{file.creator}</p>
                  </div>
                )}
              </div>

              {/* Description - champ optionnel selon votre schéma */}
              {file.description && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                    {file.description}
                  </p>
                </div>
              )}

              {/* Fonctionnalities - champ optionnel selon votre schéma */}
              {file.fonctionnalities && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Fonctionnalités
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                    {file.fonctionnalities}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dépendances selon votre schéma Files */}
          {(file.import || file.export || file.useby) && (
            <Card>
              <CardHeader>
                <CardTitle>Dépendances</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Import - champ optionnel selon votre schéma */}
                  {file.import && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Import
                      </label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                        {file.import}
                      </p>
                    </div>
                  )}

                  {/* Export - champ optionnel selon votre schéma */}
                  {file.export && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Export
                      </label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                        {file.export}
                      </p>
                    </div>
                  )}

                  {/* Useby - champ optionnel selon votre schéma */}
                  {file.useby && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Utilisé par
                      </label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                        {file.useby}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Script/Contenu - champ optionnel selon votre schéma */}
          {file.script && (
            <Card>
              <CardHeader>
                <CardTitle>Script/Contenu</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                  <code>{file.script}</code>
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Fichiers enfants selon la relation FileHierarchy de votre schéma */}
          {file.childFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Fichiers enfants ({file.childFiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {file.childFiles.map((child) => (
                    <Link
                      key={child.id}
                      href={`/files/${child.id}`}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {fileTypeLabels[child.type]}
                        </Badge>
                        <span className="font-medium">{child.name}</span>
                      </div>
                      <Badge className={statusColors[child.status]}>
                        {statusLabels[child.status]}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Colonne latérale - Relations selon votre schéma */}
        <div className="space-y-6">
          {/* Uploader selon la relation avec User de votre schéma */}
          <Card>
            <CardHeader>
              <CardTitle>Uploader</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {file.uploader.image && (
                  <img
                    src={file.uploader.image}
                    alt={file.uploader.name || "Utilisateur"}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">
                    {file.uploader.name || "Utilisateur anonyme"}
                  </p>
                  <p className="text-sm text-gray-500">Uploader du fichier</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fichier parent selon la relation FileHierarchy de votre schéma */}
          {file.parentFile && (
            <Card>
              <CardHeader>
                <CardTitle>Fichier parent</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/files/${file.parentFile.id}`}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Badge variant="outline" className="text-xs">
                    {fileTypeLabels[file.parentFile.type]}
                  </Badge>
                  <span className="font-medium">{file.parentFile.name}</span>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* RoadMaps liées selon la relation optionnelle de votre schéma */}
          {file.roadMaps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>RoadMaps liées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {file.roadMaps.map((roadMap) => (
                    <Link
                      key={roadMap.id}
                      href={`/roadmaps/${roadMap.id}`}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">{roadMap.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {roadMap.phase}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Edit size={16} className="mr-2" />
                Modifier le fichier
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download size={16} className="mr-2" />
                Télécharger
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} className="mr-2" />
                Supprimer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Génération des métadonnées dynamiques selon votre schéma
export async function generateMetadata({ params }: FilePageProps) {
  const resolvedParams = await params;
  const { fileId } = resolvedParams;

  const file = await getFileDetails(fileId);

  if (!file) {
    return {
      title: "Fichier introuvable",
      description: "Le fichier demandé n'existe pas.",
    };
  }

  return {
    title: `${file.name} - ${file.project.name}`,
    description:
      file.description || `Fichier ${file.type} du projet ${file.project.name}`,
  };
}
