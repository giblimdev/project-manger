export const changeOrder = async <T>(
  tableName: string,
  items: T[],
  getId: (item: T) => string,
  getOrder: (item: T) => number
): Promise<void> => {
  try {
    // Créer un tableau d'identifiants avec leur ordre
    const orderedItems = items.map((item) => ({
      id: getId(item),
      order: getOrder(item),
    }));

    // Envoyer la requête PATCH à l'API
    const response = await fetch(`/api/${tableName}/order`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: orderedItems }),
    });

    if (!response.ok) {
      throw new Error(
        `Erreur lors de la mise à jour de l'ordre: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error(`Erreur dans changeOrder pour la table ${tableName}:`, error);
    throw error;
  }
};

// Utilitaire pour déplacer un élément vers le haut
export const moveUp = async <T>(
  tableName: string,
  items: T[],
  item: T,
  getId: (item: T) => string,
  getOrder: (item: T) => number,
  setOrder: (item: T, order: number) => T
): Promise<T[]> => {
  const currentIndex = items.findIndex((i) => getId(i) === getId(item));
  if (currentIndex <= 0) return items; // Ne peut pas monter si déjà en haut

  const newItems = [...items];
  const temp = newItems[currentIndex];
  newItems[currentIndex] = setOrder(newItems[currentIndex - 1], getOrder(temp));
  newItems[currentIndex - 1] = setOrder(temp, getOrder(newItems[currentIndex]));

  await changeOrder(tableName, newItems, getId, getOrder);
  return newItems;
};

// Utilitaire pour déplacer un élément vers le bas
export const moveDown = async <T>(
  tableName: string,
  items: T[],
  item: T,
  getId: (item: T) => string,
  getOrder: (item: T) => number,
  setOrder: (item: T, order: number) => T
): Promise<T[]> => {
  const currentIndex = items.findIndex((i) => getId(i) === getId(item));
  if (currentIndex >= items.length - 1) return items; // Ne peut pas descendre si déjà en bas

  const newItems = [...items];
  const temp = newItems[currentIndex];
  newItems[currentIndex] = setOrder(newItems[currentIndex + 1], getOrder(temp));
  newItems[currentIndex + 1] = setOrder(temp, getOrder(newItems[currentIndex]));

  await changeOrder(tableName, newItems, getId, getOrder);
  return newItems;
};
