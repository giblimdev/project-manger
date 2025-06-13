// utils/getCommentsByThema.ts

export async function getCommentsByThema(
  thema: string,
  filters: Record<string, any> = {}
) {
  // Construction des paramètres de requête
  const params = new URLSearchParams({ thema, ...filters });

  const res = await fetch(`/api/comments/getComments?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des commentaires");
  }

  // On suppose que l'API retourne { comments: [...] }
  const data = await res.json();
  return data.comments;
}
