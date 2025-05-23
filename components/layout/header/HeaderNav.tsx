// components/navigation/NavigationButtons.tsx
"use client";

import React from "react";
import Link from "next/link";
import { FolderKanban, Users, Code2, Route, Database } from "lucide-react";

interface NavigationItem {
  title: string;
  link: string;
  icon: React.ComponentType<any>;
}

export default function NavigationButtons() {
  const navigationItems: NavigationItem[] = [
    {
      title: "Gestion de projet",
      link: "/user/projects",
      icon: FolderKanban,
    },
    {
      title: "Mon organisation",
      link: "/use/teams",
      icon: Users,
    },
    {
      title: "Architecture",
      link: "/dev/architecture",
      icon: Code2,
    },
    {
      title: "Road Map",
      link: "/dev/roadMap",
      icon: Route,
    },
    {
      title: "Schema",
      link: "/dev/schema",
      icon: Database,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-6">
      {navigationItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link key={item.title} href={item.link}>
            <div className="p-6 border rounded-lg hover:shadow-md">
              <Icon className="w-3 h-3 mb-1" />
              <h3 className="">{item.title}</h3>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
