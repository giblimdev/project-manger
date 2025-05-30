// @/components/models/projects/ProjectNav.tsx

"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageCircle,
  Map,
  Users,
  FileCode,
  Database,
  Layers,
  BookOpen,
  Timer,
  CheckSquare,
  LucideIcon,
} from "lucide-react";

interface NavItem {
  ordred: number;
  title: string;
  link: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    ordred: 1,
    title: "Commentaires",
    link: "/comments",
    icon: MessageCircle,
  },
  {
    ordred: 2,
    title: "Roadmap",
    link: "/roadmap",
    icon: Map,
  },
  {
    ordred: 3,
    title: "Architecture",
    link: "/files",
    icon: FileCode,
  },
  {
    ordred: 4,
    title: "Schéma",
    link: "/schemas",
    icon: Database,
  },
  {
    ordred: 5,
    title: "Features",
    link: "/features",
    icon: Layers,
  },
  {
    ordred: 6,
    title: "User Stories",
    link: "/user-stories",
    icon: BookOpen,
  },
  {
    ordred: 7,
    title: "Sprints",
    link: "/sprints",
    icon: Timer,
  },
  {
    ordred: 8,
    title: "Tasks",
    link: "/tasks",
    icon: CheckSquare,
  },
  {
    ordred: 9,
    title: "Teams",
    link: "/teams",
    icon: Users,
  },
];

function ProjectNav() {
  const pathname = usePathname();

  // Trier les éléments par ordre
  const sortedNavItems = navItems.sort((a, b) => a.ordred - b.ordred);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 my-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-1 overflow-x-auto py-2">
          {sortedNavItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.link;

            return (
              <Link
                key={item.ordred}
                href={item.link}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <IconComponent size={16} />
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default ProjectNav;
