// app/layout.tsx
import React from "react";
import Header from "@/components/layout/header/Header";
import "./globals.css";
import { Toaster } from "sonner";
import AnimatedBackground from "@/components/layout/Background";
import Footer from "@/components/layout/footer/Footer";

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
        <h1 className="text-xl text-green-300">app/layout</h1>
        <AnimatedBackground />
        <Header />
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">{children}</main>
        </div>
        <Toaster richColors />
        <Footer />
      </body>
    </html>
  );
}
