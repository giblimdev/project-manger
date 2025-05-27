// components/layout/Header.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, User, Menu, X, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import TodoButton from "../TodoButton";
import HeaderNav from "./HeaderNav";
import Logo from "@/components/layout/header/Logo";
import IsConected from "./IsConected";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  const router = useRouter();

  // Optimisation avec useCallback pour éviter les re-renders inutiles
  const toggleSound = useCallback(() => {
    const newSoundState = !isSoundEnabled;
    setIsSoundEnabled(newSoundState);
    localStorage.setItem("soundEnabled", newSoundState.toString());

    // Optionnel: jouer un son de confirmation si activé
    if (newSoundState && typeof window !== "undefined") {
      // Jouer un son de confirmation
    }
  }, [isSoundEnabled]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    let prevPathname = window.location.pathname;

    const handleRouteChange = () => {
      if (window.location.pathname !== prevPathname) {
        setIsMenuOpen(false);
        prevPathname = window.location.pathname;
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("pushstate", handleRouteChange);
    window.addEventListener("replacestate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener("pushstate", handleRouteChange);
      window.removeEventListener("replacestate", handleRouteChange);
    };
  }, []);

  // Charger les préférences utilisateur
  useEffect(() => {
    const savedSoundPreference = localStorage.getItem("soundEnabled");
    if (savedSoundPreference !== null) {
      setIsSoundEnabled(savedSoundPreference === "true");
    }
  }, []);

  // Fermer le menu mobile avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      // Empêcher le scroll du body quand le menu est ouvert
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <header className="p-3 bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <HeaderNav />
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Sound Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSound}
              className="p-2 hover:bg-gray-100 transition-colors"
              title={isSoundEnabled ? "Désactiver le son" : "Activer le son"}
              aria-label={
                isSoundEnabled ? "Désactiver le son" : "Activer le son"
              }
            >
              {isSoundEnabled ? (
                <Volume2 className="w-5 h-5 text-gray-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 relative hover:bg-gray-100 transition-colors"
                onClick={() => {
                  // TODO: Implémenter le dropdown des notifications
                  // Basé sur votre schéma, vous pourriez récupérer:
                  // - Commentaires sur les projets de l'utilisateur
                  // - Nouvelles tâches assignées
                  // - Mises à jour de roadmaps
                }}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </Button>
            </div>

            {/* User Menu */}
            <div className="relative">
              <IsConected />
            </div>

            {/* Todo Button */}
            <div className="hidden sm:block">
              <TodoButton />
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2 hover:bg-gray-100 transition-colors"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100 py-4 border-t border-gray-200"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <nav className="flex flex-col space-y-3">
            <HeaderNav />
            {/* Todo Button pour mobile */}
            <div className="sm:hidden pt-2 border-t border-gray-100">
              <TodoButton />
            </div>
          </nav>
        </div>
      </div>

      {/* Overlay pour mobile */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
