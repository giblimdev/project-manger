// components/ItemList.tsx
import React from "react";
import { ArrowUp, ArrowDown, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type ItemListProps = {
  items: any[];
  displayMode: "table" | "list";
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onMoveUp: (item: any) => void;
  onMoveDown: (item: any) => void;
  onAdd: () => void;
  onReorder?: () => void;
};

const ItemList: React.FC<ItemListProps> = ({
  items,
  displayMode,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAdd,
  onReorder,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-8">
      <section
        className={
          displayMode === "table"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl"
            : "flex flex-col gap-5 w-full max-w-4xl"
        }
        aria-label="Liste des éléments"
      >
        {items.length === 0 && (
          <div className="text-gray-500 text-center py-16 col-span-full text-lg font-semibold bg-white/80 rounded-2xl shadow-lg border border-gray-100/50 backdrop-blur-sm">
            Aucun élément à afficher.
          </div>
        )}

        {items.map((item, idx) =>
          displayMode === "table" ? (
            // --- Mode Grille : Card verticale
            <Card
              key={item.id}
              className="relative shadow-lg border border-gray-100/50 rounded-2xl bg-white/80 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
            >
              <CardHeader className="p-0 rounded-t-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-teal-500 px-5 py-4 flex justify-between items-center">
                  <CardTitle className="text-white font-semibold text-lg truncate max-w-[70%]">
                    {item.title || item.name}
                  </CardTitle>
                  {item.thema && (
                    <span className="bg-white text-teal-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      {item.thema}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-5">
                <p className="text-gray-700 text-sm font-medium mb-3 line-clamp-3">
                  {item.content || item.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>
                    Créé le{" "}
                    {item.createdAt &&
                      new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  {item.authorId && <span>• Auteur: {item.authorId}</span>}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between gap-2 p-4 border-t border-gray-100 bg-gray-50/80 rounded-b-2xl">
                <div className="flex gap-1.5">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(item)}
                    aria-label="Modifier l'élément"
                    className="hover:bg-green-100 focus:ring-2 focus:ring-green-400 text-green-600 transition-all duration-200"
                  >
                    <Edit size={18} strokeWidth={2} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(item)}
                    aria-label="Supprimer l'élément"
                    className="hover:bg-red-100 focus:ring-2 focus:ring-red-400 text-red-600 transition-all duration-200"
                  >
                    <Trash2 size={18} strokeWidth={2} />
                  </Button>
                </div>
                <div className="flex gap-1.5">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      onMoveUp(item);
                      if (onReorder) onReorder();
                    }}
                    aria-label="Déplacer vers le haut"
                    disabled={idx === 0}
                    className="hover:bg-blue-100 focus:ring-2 focus:ring-blue-400 text-blue-600 transition-all duration-200 disabled:opacity-50"
                  >
                    <ArrowUp size={18} strokeWidth={2} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      onMoveDown(item);
                      if (onReorder) onReorder();
                    }}
                    aria-label="Déplacer vers le bas"
                    disabled={idx === items.length - 1}
                    className="hover:bg-blue-100 focus:ring-2 focus:ring-blue-400 text-blue-600 transition-all duration-200 disabled:opacity-50"
                  >
                    <ArrowDown size={18} strokeWidth={2} />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ) : (
            // --- Mode Liste : Card horizontale
            <Card
              key={item.id}
              className="flex flex-row items-center gap-6 px-6 py-4 shadow-lg rounded-2xl bg-white/80 border border-gray-100/50 backdrop-blur-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-base text-gray-900 truncate">
                    {item.title || item.name}
                  </h3>
                  {item.thema && (
                    <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                      {item.thema}
                    </span>
                  )}
                </div>
                <p className="text-gray-700 text-sm font-medium mb-2 line-clamp-2">
                  {item.content || item.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>
                    {item.createdAt &&
                      new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  {item.authorId && <span>• {item.authorId}</span>}
                </div>
              </div>
              <div className="flex gap-1.5">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onEdit(item)}
                  aria-label="Modifier l'élément"
                  className="hover:bg-green-100 focus:ring-2 focus:ring-green-400 text-green-600 transition-all duration-200"
                >
                  <Edit size={18} strokeWidth={2} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(item)}
                  aria-label="Supprimer l'élément"
                  className="hover:bg-red-100 focus:ring-2 focus:ring-red-400 text-red-600 transition-all duration-200"
                >
                  <Trash2 size={18} strokeWidth={2} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    onMoveUp(item);
                    if (onReorder) onReorder();
                  }}
                  aria-label="Déplacer vers le haut"
                  disabled={idx === 0}
                  className="hover:bg-blue-100 focus:ring-2 focus:ring-blue-400 text-blue-600 transition-all duration-200 disabled:opacity-50"
                >
                  <ArrowUp size={18} strokeWidth={2} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    onMoveDown(item);
                    if (onReorder) onReorder();
                  }}
                  aria-label="Déplacer vers le bas"
                  disabled={idx === items.length - 1}
                  className="hover:bg-blue-100 focus:ring-2 focus:ring-blue-400 text-blue-600 transition-all duration-200 disabled:opacity-50"
                >
                  <ArrowDown size={18} strokeWidth={2} />
                </Button>
              </div>
            </Card>
          )
        )}

        <div className="mt-8 col-span-full flex justify-center">
          <Button
            variant="default"
            onClick={onAdd}
            aria-label="Ajouter un élément"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-base"
          >
            <Plus size={20} className="mr-2" />
            Ajouter
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ItemList;
