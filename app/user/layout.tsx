// app/layout.tsx
import React from "react";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import "../globals.css";
import { Toaster } from "sonner";
import AnimatedBackground from "@/components/layout/Background";

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
    <html lang="fr">
      <body className="min-h-screen">
        <AnimatedBackground />
        <Header />
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
