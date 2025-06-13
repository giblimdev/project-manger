// components/models/comments/CommentForm.tsx

"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth/auth-client";

type CommentFormValues = {
  id?: string;
  title: string;
  content: string;
  thema: string;
  authorId: string;
  parentCommentId?: string | null;
  featureId?: string | null;
  userStoryId?: string | null;
  taskId?: string | null;
  sprintId?: string | null;
  roadMapId?: string | null;
};

type Option = { id: string; label: string };

type CommentFormProps = {
  comment?: Partial<CommentFormValues> | null;
  themas: string[];
  onCancel: () => void;
  onSuccess: () => void;
  parentCommentOptions?: Option[];
  featureOptions?: Option[];
  userStoryOptions?: Option[];
  taskOptions?: Option[];
  sprintOptions?: Option[];
  roadMapOptions?: Option[];
};

const CommentForm: React.FC<CommentFormProps> = ({
  comment,
  themas,
  onCancel,
  onSuccess,
  parentCommentOptions = [],
  featureOptions = [],
  userStoryOptions = [],
  taskOptions = [],
  sprintOptions = [],
  roadMapOptions = [],
}) => {
  // Correction Better Auth : user dans session.data.user
  const session = useSession();
  const user = session.data?.user as { id: string; name: string } | undefined;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormValues>({
    defaultValues: {
      id: comment?.id,
      title: comment?.title || "",
      content: comment?.content || "",
      thema: comment?.thema || themas[0] || "",
      authorId: user?.id || "",
      parentCommentId: comment?.parentCommentId ?? "",
      featureId: comment?.featureId ?? "",
      userStoryId: comment?.userStoryId ?? "",
      taskId: comment?.taskId ?? "",
      sprintId: comment?.sprintId ?? "",
      roadMapId: comment?.roadMapId ?? "",
    },
  });

  // Met à jour le formulaire si le commentaire, les thèmes ou l'utilisateur changent
  useEffect(() => {
    reset({
      id: comment?.id,
      title: comment?.title || "",
      content: comment?.content || "",
      thema: comment?.thema || themas[0] || "",
      authorId: user?.id || "",
      parentCommentId: comment?.parentCommentId ?? "",
      featureId: comment?.featureId ?? "",
      userStoryId: comment?.userStoryId ?? "",
      taskId: comment?.taskId ?? "",
      sprintId: comment?.sprintId ?? "",
      roadMapId: comment?.roadMapId ?? "",
    });
  }, [comment, themas, user, reset]);

  // Gestion de la soumission : POST si création, PUT si édition
  const onSubmit = async (data: CommentFormValues) => {
    const isEdition = !!data.id;
    const url = isEdition ? `/api/comments/${data.id}` : "/api/comments";
    const method = isEdition ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      onSuccess();
      reset();
    } else {
      alert("Erreur lors de l'enregistrement du commentaire.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border rounded-2xl shadow-lg p-6 max-w-2xl mx-auto flex flex-col gap-6"
      style={{ backdropFilter: "blur(2px)" }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {comment?.id ? "Modifier le commentaire" : "Ajouter un commentaire"}
      </h2>

      {/* Titre */}
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="font-medium text-gray-700">
          Titre <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          placeholder="Titre du commentaire"
          {...register("title", { required: "Le titre est requis" })}
          className="focus:ring-2 focus:ring-green-400"
        />
        {errors.title && (
          <span className="text-red-500 text-xs">{errors.title.message}</span>
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-col gap-2">
        <label htmlFor="content" className="font-medium text-gray-700">
          Contenu <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="content"
          placeholder="Votre commentaire..."
          rows={5}
          {...register("content", { required: "Le contenu est requis" })}
          className="focus:ring-2 focus:ring-green-400"
        />
        {errors.content && (
          <span className="text-red-500 text-xs">{errors.content.message}</span>
        )}
      </div>

      {/* Sélecteur de thème */}
      <div className="flex flex-col gap-2">
        <label htmlFor="thema" className="font-medium text-gray-700">
          Thème <span className="text-red-500">*</span>
        </label>
        <select
          id="thema"
          {...register("thema", { required: "Le thème est requis" })}
          className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
        >
          {themas.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.thema && (
          <span className="text-red-500 text-xs">{errors.thema.message}</span>
        )}
      </div>

      {/* Auteur (rempli automatiquement, non éditable) */}
      <div className="flex flex-col gap-2">
        <label htmlFor="authorId" className="font-medium text-gray-700">
          Auteur
        </label>
        <Input
          id="authorId"
          value={user?.name || ""}
          disabled
          className="bg-gray-100 text-gray-600"
        />
        {/* Champ caché pour l'id */}
        <input
          type="hidden"
          {...register("authorId", { required: true })}
          value={user?.id || ""}
        />
      </div>

      {/* Parent Commentaire */}
      <div className="flex flex-col gap-2">
        <label htmlFor="parentCommentId" className="font-medium text-gray-700">
          Commentaire parent (optionnel)
        </label>
        <select
          id="parentCommentId"
          {...register("parentCommentId")}
          className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
        >
          <option value="">Aucun</option>
          {parentCommentOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Feature */}
      <div className="flex flex-col gap-2">
        <label htmlFor="featureId" className="font-medium text-gray-700">
          Feature liée (optionnel)
        </label>
        <select
          id="featureId"
          {...register("featureId")}
          className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
        >
          <option value="">Aucune</option>
          {featureOptions.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* User Story */}
      <div className="flex flex-col gap-2">
        <label htmlFor="userStoryId" className="font-medium text-gray-700">
          User Story liée (optionnel)
        </label>
        <select
          id="userStoryId"
          {...register("userStoryId")}
          className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
        >
          <option value="">Aucune</option>
          {userStoryOptions.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label}
            </option>
          ))}
        </select>
      </div>

      {/* Task */}
      <div className="flex flex-col gap-2">
        <label htmlFor="taskId" className="font-medium text-gray-700">
          Tâche liée (optionnel)
        </label>
        <select
          id="taskId"
          {...register("taskId")}
          className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
        >
          <option value="">Aucune</option>
          {taskOptions.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sprint */}
      <div className="flex flex-col gap-2">
        <label htmlFor="sprintId" className="font-medium text-gray-700">
          Sprint lié (optionnel)
        </label>
        <select
          id="sprintId"
          {...register("sprintId")}
          className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
        >
          <option value="">Aucun</option>
          {sprintOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* RoadMap */}
      <div className="flex flex-col gap-2">
        <label htmlFor="roadMapId" className="font-medium text-gray-700">
          RoadMap liée (optionnel)
        </label>
        <select
          id="roadMapId"
          {...register("roadMapId")}
          className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
        >
          <option value="">Aucune</option>
          {roadMapOptions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Envoi..."
            : comment?.id
              ? "Mettre à jour"
              : "Publier"}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
