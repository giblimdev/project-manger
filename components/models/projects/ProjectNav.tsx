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
  FolderKanban,
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
    title: "PROJETS",
    link: "/projets",
    icon: FolderKanban,
  },
  {
    ordred: 2,
    title: "Commentaires",
    link: "/comments",
    icon: MessageCircle,
  },
  {
    ordred: 3,
    title: "Roadmap",
    link: "/projects/roadmap",
    icon: Map,
  },
  {
    ordred: 4,
    title: "Architecture",
    link: "/projects/files",
    icon: FileCode,
  },
  {
    ordred: 5,
    title: "Schéma",
    link: "/projects/schemas",
    icon: Database,
  },
  {
    ordred: 6,
    title: "Features",
    link: "/projects/features",
    icon: Layers,
  },
  {
    ordred: 7,
    title: "User Stories",
    link: "/projects/user-stories",
    icon: BookOpen,
  },
  {
    ordred: 8,
    title: "Sprints",
    link: "/projects/sprints",
    icon: Timer,
  },
  {
    ordred: 9,
    title: "Tasks",
    link: "/projects/tasks",
    icon: CheckSquare,
  },
  {
    ordred: 10,
    title: "Teams",
    link: "/projects/teams",
    icon: Users,
  },
];

function ProjectNav() {
  const pathname = usePathname();

  // Trier les éléments par ordre
  const sortedNavItems = navItems.sort((a, b) => a.ordred - b.ordred);

  return (
    <nav className="bg-white shadow-sm rounded-xl border-gray-200 mt-10 ml-4">
      <div className="items-center space-x-1 overflow-x-auto p-2">
        {sortedNavItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.link;

          return (
            <Link
              key={item.ordred}
              href={item.link}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
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
    </nav>
  );
}

export default ProjectNav;
