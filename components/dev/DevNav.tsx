import React from "react";
import { Route, Database, LinkIcon, ScrollText } from "lucide-react";

// Déclaration typée du tableau (TypeScript)
const DevNavigationItems = [
  {
    title: "Road Map",
    link: "/dev/roadMap",
    icon: Route,
  },
  {
    title: "Schema",
    link: "/dev/schema",
    icon: Database,
  },
  {
    title: "Dev Tools",
    link: "/dev/devTools",
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

export default function DevNav() {
  return (
    <nav className="flex flex-row gap-2">
      {DevNavigationItems.map((item) => (
        <a
          key={item.link}
          href={item.link}
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition-colors"
        >
          <item.icon className="w-4 h-4 text-indigo-600" />
          <span>{item.title}</span>
        </a>
      ))}
    </nav>
  );
}
