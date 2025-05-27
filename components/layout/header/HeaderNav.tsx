// components/navigation/NavigationButtons.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Users,
  Code2,
  Route,
  Database,
  Menu,
  Link as LinkIcon,
  X,
  ScrollText,
} from "lucide-react";

interface NavigationItem {
  title: string;
  link: string;
  icon: React.ComponentType<any>;
}

export default function NavigationButtons() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    {
      title: "Gestion de projet",
      link: "/projects",
      icon: FolderKanban,
    },
    {
      title: "Mon organisation",
      link: "/user/teams",
      icon: Users,
    },
    {
      title: "Architecture",
      link: "/dev/architecture",
      icon: Code2,
    },
    {
      title: "Road Map",
      link: "/dev/roadmap",
      icon: Route,
    },
    {
      title: "Schema",
      link: "/dev/schema",
      icon: Database,
    },
    {
      title: "Liens",
      link: "/dev/link",
      icon: LinkIcon,
    },
    {
      title: "Promptes",
      link: "/dev/promptes",
      icon: ScrollText,
    },
  ];

  return (
    <>
      {/* Menu desktop - icônes et liens sur la même ligne */}
      <div className="hidden md:flex items-center space-x-6 p-6">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.link}
              className="flex items-center space-x-2 p-3 border rounded-lg hover:shadow-md transition-shadow"
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.title}</span>
            </Link>
          );
        })}
      </div>

      {/* Menu mobile - burger */}
      <div className="md:hidden p-4">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center space-x-2 p-3 border rounded-lg"
        >
          {isMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">Menu</span>
        </button>

        {/* Menu mobile ouvert */}
        {isMenuOpen && (
          <div className="mt-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.link}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
