// components/layout/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, User, Menu, X, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TodoButton from "../TodoButton";
import HeaderNav from "./HeaderNav";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const router = useRouter();

  // Navigation items
  const navItems = [
    { href: "/dashboard", label: "Tableau de bord" },
    { href: "/projects", label: "Projets" },
    { href: "/teams", label: "Équipes" },
    { href: "/tasks", label: "Tâches" },
    { href: "/reports", label: "Rapports" },
  ];

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
    localStorage.setItem("soundEnabled", (!isSoundEnabled).toString());
  };

  useEffect(() => {
    const savedSoundPreference = localStorage.getItem("soundEnabled");
    if (savedSoundPreference !== null) {
      setIsSoundEnabled(savedSoundPreference === "true");
    }
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PM</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Project Manager
            </span>
          </Link>

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
              className="p-2"
              title={isSoundEnabled ? "Désactiver le son" : "Activer le son"}
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
                className="p-2 relative"
                onClick={() => {
                  // Toggle notifications dropdown
                }}
              >
                <Bell className="w-5 h-5 text-gray-600" />
              </Button>
            </div>

            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => {
                  // Toggle user menu
                }}
              >
                <User className="w-5 h-5 text-gray-600" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
      <TodoButton />
    </header>
  );
}
