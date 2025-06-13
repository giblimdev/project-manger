// components/DisplayView.tsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List as ListIcon } from "lucide-react";

type DisplayViewProps = {
  value: "list" | "table";
  onChange: (value: "list" | "table") => void;
  options?: { label: string; value: "list" | "table" }[];
};

const DisplayView: React.FC<DisplayViewProps> = ({
  value,
  onChange,
  options = [
    { label: "Grille", value: "table" },
    { label: "Liste", value: "list" },
  ],
}) => {
  return (
    <div className="flex justify-end p-2">
      <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 p-1 shadow-sm">
        {options.map((opt) => (
          <Button
            key={opt.value}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(opt.value)}
            aria-label={`Vue ${opt.label.toLowerCase()}`}
            className={`rounded-full transition-all duration-200 ease-in-out ${
              value === opt.value
                ? "bg-white shadow-md text-blue-400 hover:bg-white/90"
                : "text-gray-500 hover:text-gray-700 hover:bg-transparent"
            }`}
          >
            {opt.value === "table" ? (
              <LayoutGrid size={18} className="stroke-[2.5]" />
            ) : (
              <ListIcon size={18} className="stroke-[2.5]" />
            )}
            <span className="ml-2 text-sm font-medium">{opt.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DisplayView;
