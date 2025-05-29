// hooks/useProjectsStoreHydrated.ts

import { useEffect, useState } from "react";
import { useProjectsStore } from "@/stores/useProjectStore";

export const useProjectsStoreHydrated = () => {
  const [hydrated, setHydrated] = useState(false);
  const store = useProjectsStore();

  useEffect(() => {
    // Attendre que l'hydratation soit terminée
    const unsubFinishHydration = useProjectsStore.persist.onFinishHydration(
      () => {
        setHydrated(true);
      }
    );

    // Vérifier si déjà hydraté
    setHydrated(useProjectsStore.persist.hasHydrated());

    return () => {
      unsubFinishHydration();
    };
  }, []);

  // Retourner le store seulement si hydraté, sinon des valeurs par défaut
  return hydrated
    ? store
    : {
        project: null,
        setProject: () => {},
        clearProject: () => {},
      };
};
