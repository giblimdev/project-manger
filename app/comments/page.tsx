"use client";
import React, { useState, useEffect, useCallback } from "react";
import getThema from "@/utils/getThema";
import { getCommentsByThema } from "@/utils/getCommentsByThema";
import { moveUp, moveDown } from "@/utils/ChangeOrder";
import DisplayView from "@/components/DisplayView";
import ItemFilter from "@/components/ItemFilters";
import ItemList from "@/components/ItemList";
import CommentForm from "@/components/models/comments/CommentForm";
import { Comments } from "@/lib/generated/prisma/client";

const CommentsPage: React.FC = () => {
  const [thema, setThema] = useState<string | null>(null);
  const [comments, setComments] = useState<Comments[]>([]);
  const [displayMode, setDisplayMode] = useState<"table" | "list">("table");
  const [search, setSearch] = useState<string>("");
  const [themaFilter, setThemaFilter] = useState<string>("");
  const [themas, setThemas] = useState<string[]>([]);
  const [editingComment, setEditingComment] = useState<
    Comments | undefined | null
  >(null);

  // Récupération de la thématique principale au montage
  useEffect(() => {
    getThema().then((themaArr) =>
      setThema(Array.isArray(themaArr) ? (themaArr[0] ?? null) : null)
    );
  }, []);

  // Récupération des thématiques disponibles pour le filtre
  useEffect(() => {
    fetch("/api/comments/getThema")
      .then((res) => res.json())
      .then((data) => setThemas(Array.isArray(data.thema) ? data.thema : []));
  }, []);

  // Récupération des commentaires selon la thématique et les filtres
  const refreshComments = useCallback(() => {
    if (thema) {
      getCommentsByThema(thema, { search, thema: themaFilter }).then(
        setComments
      );
    }
  }, [thema, search, themaFilter]);

  useEffect(() => {
    refreshComments();
  }, [refreshComments]);

  const handleReorder = useCallback(() => {
    refreshComments();
  }, [refreshComments]);

  const handleDelete = useCallback(
    async (id: string) => {
      await fetch(`/api/comments/${id}`, { method: "DELETE" });
      refreshComments();
    },
    [refreshComments]
  );

  const handleMoveUp = useCallback(
    async (item: Comments) => {
      try {
        const newComments = await moveUp<Comments>(
          "comments",
          comments,
          item,
          (comment: { id: any }) => comment.id,
          (comment: {
            order: number;
            thema: string | null;
            id: string;
            title: string;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string;
            parentCommentId: string | null;
            featureId: string | null;
            userStoryId: string | null;
            taskId: string | null;
            sprintId: string | null;
            roadMapId: string | null;
          }) => comment.order ?? comments.indexOf(comment),
          (comment: any, order: any) => ({ ...comment, order })
        );
        setComments(newComments);
        handleReorder();
      } catch (error) {
        console.error("Erreur lors du déplacement vers le haut:", error);
      }
    },
    [comments, handleReorder]
  );

  const handleMoveDown = useCallback(
    async (item: Comments) => {
      try {
        const newComments = await moveDown<Comments>(
          "comments",
          comments,
          item,
          (comment: { id: any }) => comment.id,
          (comment: {
            order: number;
            id: string;
            title: string;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            thema: string | null;
            authorId: string;
            parentCommentId: string | null;
            featureId: string | null;
            userStoryId: string | null;
            taskId: string | null;
            sprintId: string | null;
            roadMapId: string | null;
          }) => comment.order ?? comments.indexOf(comment),
          (comment: any, order: any) => ({ ...comment, order })
        );
        setComments(newComments);
        handleReorder();
      } catch (error) {
        console.error("Erreur lors du déplacement vers le bas:", error);
      }
    },
    [comments, handleReorder]
  );

  if (!thema) return <div>Chargement de la thématique...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Commentaires pour la thématique : {thema}
      </h1>
      <DisplayView
        value={displayMode}
        onChange={setDisplayMode}
        options={[
          { label: "Tableau", value: "table" },
          { label: "Liste", value: "list" },
        ]}
      />
      <ItemFilter
        tableName="comments"
        search={search}
        setSearch={setSearch}
        thema={themaFilter}
        setThema={setThemaFilter}
        themas={themas}
      />
      <ItemList
        items={comments}
        displayMode={displayMode}
        onEdit={setEditingComment}
        onDelete={handleDelete}
        onReorder={handleReorder}
        onAdd={() => setEditingComment(undefined)}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
      />
      {editingComment !== null && (
        <CommentForm
          comment={
            editingComment
              ? { ...editingComment, thema: editingComment.thema ?? undefined }
              : undefined
          }
          themas={themas}
          onCancel={() => setEditingComment(null)}
          onSuccess={() => {
            setEditingComment(null);
            refreshComments();
          }}
        />
      )}
      {/* Debug : Affichage des props */}
      <div className="mt-8 bg-gray-50 p-4 rounded-lg shadow-sm">
        <pre className="text-sm text-gray-700">
          {JSON.stringify(
            {
              thema,
              displayMode,
              search,
              themaFilter,
              comments: comments.map((c) => c.id),
              editingComment: editingComment
                ? editingComment.id
                : editingComment,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
};

export default CommentsPage;
