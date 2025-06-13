// app/roadmap/page.tsx

"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProjectsStore } from "@/stores/useProjectStore";
import DisplayView from "@/components/DisplayView";
import ItemFilter from "@/components/ItemFilters";
import ItemList from "@/components/ItemList";
import RoadMapForm from "@/components/models/roadmap/RoaMmapForm";
import { RoadMap } from "@/lib/generated/prisma/client";

const tableName = "roadmaps"; // Définition explicite de la variable

async function fetchRoadmaps(projectId: string): Promise<RoadMap[]> {
  const response = await fetch(
    `/api/roadmap?projectId=${encodeURIComponent(projectId)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );
  if (!response.ok) {
    throw new Error("Erreur lors du chargement des roadmaps");
  }
  const data = await response.json();
  return data as RoadMap[];
}

function RoadmapPage() {
  const router = useRouter();
  const { project, projectId, setProjectId } = useProjectsStore();
  const [roadmaps, setRoadmaps] = useState<RoadMap[]>([]);
  const [displayMode, setDisplayMode] = useState<"table" | "list">("table");
  const [search, setSearch] = useState<string>("");
  const [themaFilter, setThemaFilter] = useState<string | null>(null);
  const [themas, setThemas] = useState<string[]>([]);
  const [editingRoadmap, setEditingRoadmap] = useState<RoadMap | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      router.push("/projects");
    }
  }, [projectId, router]);

  useEffect(() => {
    if (projectId) {
      setLoading(true);
      setError(null);
      fetchRoadmaps(projectId)
        .then((data) => {
          setRoadmaps(data);
          const uniquePhases = Array.from(new Set(data.map((rm) => rm.phase)));
          setThemas(uniquePhases);
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [projectId]);

  const handleChangeProject = () => {
    setProjectId(null);
    router.push("/projects");
  };

  const filteredRoadmaps = roadmaps.filter((rm) => {
    return (
      (!search || rm.title.toLowerCase().includes(search.toLowerCase())) &&
      (!themaFilter || rm.phase === themaFilter)
    );
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          Roadmap du projet : {project?.name || "Chargement..."}
        </h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleChangeProject}
        >
          Changer de projet
        </button>
      </div>

      {loading && (
        <div className="mb-4 text-blue-600 font-semibold">
          Chargement des roadmaps...
        </div>
      )}
      {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}

      <DisplayView
        value={displayMode}
        onChange={setDisplayMode}
        options={[
          { label: "Tableau", value: "table" },
          { label: "Liste", value: "list" },
        ]}
      />

      <ItemFilter
        tableName={tableName}
        search={search}
        setSearch={setSearch}
        thema={themaFilter ?? ""}
        setThema={setThemaFilter}
        themas={themas}
      />

      <ItemList
        items={filteredRoadmaps}
        displayMode={displayMode}
        onEdit={setEditingRoadmap}
        onDelete={() => {}}
        onReorder={() => {}}
        onAdd={() => setEditingRoadmap({} as RoadMap)}
        onMoveUp={() => {}}
        onMoveDown={() => {}}
      />

      {editingRoadmap !== null && (
        <RoadMapForm
          roadmap={editingRoadmap}
          themas={themas}
          onCancel={() => setEditingRoadmap(null)}
          onSuccess={async () => {
            setEditingRoadmap(null);
            if (projectId) {
              setLoading(true);
              setError(null);
              try {
                const data = await fetchRoadmaps(projectId);
                setRoadmaps(data);
              } catch (e: any) {
                setError(e.message);
              } finally {
                setLoading(false);
              }
            }
          }}
        />
      )}

      <div className="mt-8 bg-gray-50 p-4 rounded-lg shadow-sm">
        <pre className="text-sm text-gray-700">
          {JSON.stringify(
            {
              themaFilter,
              displayMode,
              search,
              roadmaps: roadmaps.map((c) => c.id),
              editingRoadmap: editingRoadmap ? editingRoadmap.id : null,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}

export default RoadmapPage;
