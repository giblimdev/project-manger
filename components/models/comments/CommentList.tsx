// components/comments/CommentList.tsx

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { List as ListIcon, LayoutGrid } from "lucide-react";
import { useCommentsStore } from "@/stores/useCommentsStore";

type Comment = {
  id: string;
  title: string;
  content: string;
  thema?: string;
  createdAt: string;
  authorId: string;
  // Ajoutez d'autres champs selon votre modèle
};

type CommentListProps = {
  comments: Comment[];
  view: "grid" | "list";
  onRefresh?: () => void;
};

export function CommentList({ comments, view, onRefresh }: CommentListProps) {
  const { setComment } = useCommentsStore();

  if (!comments.length) {
    return (
      <div className="text-gray-500 text-center py-8">
        Aucun commentaire à afficher.
      </div>
    );
  }

  return (
    <div
      className={
        view === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          : "flex flex-col gap-2"
      }
    >
      {comments.map((comment) => (
        <Card
          key={comment.id}
          className="cursor-pointer hover:shadow-lg transition"
          onClick={() => setComment(comment)}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              {view === "grid" ? (
                <LayoutGrid size={16} className="text-muted-foreground" />
              ) : (
                <ListIcon size={16} className="text-muted-foreground" />
              )}
              <span className="font-semibold">{comment.title}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-700 line-clamp-3 mb-2">
              {comment.content}
            </div>
            {comment.thema && (
              <div className="text-xs text-gray-500">
                Thème : {comment.thema}
              </div>
            )}
            <div className="text-xs text-gray-400 mt-2">
              Créé le {new Date(comment.createdAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
