//@/components/common/ViewSwitcher.tsx
"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid, List, TreePine } from "lucide-react";

type ViewType = "grid" | "list" | "tree";

interface Props {
  view: ViewType;
  setView: (v: ViewType) => void;
}

export function ViewSwitcher({ view, setView }: Props) {
  return (
    <div className="flex gap-2">
      <Button
        variant={view === "tree" ? "default" : "outline"}
        onClick={() => setView("tree")}
      >
        <TreePine size={18} />
      </Button>
      <Button
        variant={view === "grid" ? "default" : "outline"}
        onClick={() => setView("grid")}
      >
        <LayoutGrid size={18} />
      </Button>
      <Button
        variant={view === "list" ? "default" : "outline"}
        onClick={() => setView("list")}
      >
        <List size={18} />
      </Button>
    </div>
  );
}
