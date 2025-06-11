// app/layout.tsx
import React from "react";
import "../globals.css";
import { Toaster } from "sonner";
import ProjectNav from "@/components/models/projects/ProjectNav";
export const metadata = {
  title: "Gestion de Projets - Application Agile",
  description:
    "Plateforme complète de gestion de projets avec méthodologie agile",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex">
        <nav className="">
          <ProjectNav />
        </nav>
        <div className="flex-1">
          <main className=" flex-1 container mx-auto px-4 py-6">
            {children}
          </main>
        </div>
        <Toaster richColors />
      </div>
    </div>
  );
}
