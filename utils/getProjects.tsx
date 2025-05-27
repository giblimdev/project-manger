// utils/getProjects.tsx
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth/auth-client";
import { Projects } from "@/lib/generated/prisma/client";

/**
 * Hook pour récupérer les projets de l'utilisateur connecté
 */
export function useUserProjects() {
  const { data, isPending, error } = useSession();
  const [projects, setProjects] = useState<Projects[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    // Si pas de session ou pas d'utilisateur connecté, on ne fait rien
    if (!data?.user?.id) {
      setProjects([]);
      return;
    }

    setLoading(true);
    setFetchError(null);

    fetch(`/api/projects`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des projets");
        return res.json();
      })
      .then((data) => setProjects(data))
      .catch((err) => setFetchError(err.message))
      .finally(() => setLoading(false));
  }, [data?.user?.id]);

  return {
    projects,
    loading: isPending || loading,
    error: error ? error.message : fetchError,
    user: data?.user ?? null,
  };
}
