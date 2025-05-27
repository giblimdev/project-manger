"use client";
import React, { useState } from "react";

// Liens utiles avec descriptif
const links = [
  {
    title: "Next.js",
    url: "https://nextjs.org",
    description:
      "Le framework React de référence pour créer des applications web performantes et modernes. SSR, SSG, API intégrées, et plus.",
  },
  {
    title: "shadcn/ui",
    url: "https://ui.shadcn.com/",
    description:
      "Une bibliothèque de composants UI accessibles et élégants, basée sur Tailwind CSS. Parfait pour accélérer le design.",
  },
  {
    title: "Lucid",
    url: "https://lucid.co/fr",
    description:
      "Suite de collaboration visuelle pour créer des diagrammes, des roadmaps produit, de la documentation et plus.",
  },
  {
    title: "Prisma",
    url: "https://www.prisma.io/docs/",
    description:
      "ORM TypeScript moderne pour gérer la base de données, les migrations et la génération de client.",
  },
  {
    title: "Perplexity",
    url: "https://www.perplexity.ai/",
    description:
      "Moteur de recherche conversationnel basé sur l’IA, pour obtenir des réponses précises à toutes vos questions.",
  },
  {
    title: "ChatGPT",
    url: "https://chat.openai.com/",
    description:
      "Le chatbot IA d’OpenAI, idéal pour l’assistance, la génération de texte, de code, ou l’exploration d’idées.",
  },
  {
    title: "Google Gemini",
    url: "https://gemini.google.com/",
    description:
      "L’IA multimodale de Google, pour générer du texte, des images, du code et bien plus.",
  },
  {
    title: "Claude",
    url: "https://claude.ai/",
    description:
      "Le chatbot IA d’Anthropic, reconnu pour sa sécurité et la qualité de ses réponses.",
  },
];

// Commandes npm/npx avec descriptif
const npmCommands = [
  {
    cmd: "npm init",
    desc: "Initialiser un nouveau projet Node.js.",
  },
  {
    cmd: "npx create-next-app@latest mon-app",
    desc: "Créer une nouvelle application Next.js.",
  },
  {
    cmd: "npm install",
    desc: "Installer toutes les dépendances du projet.",
  },
  {
    cmd: "npm install tailwindcss autoprefixer postcss",
    desc: "Installer Tailwind CSS et ses dépendances.",
  },
  {
    cmd: "npx shadcn-ui@latest init",
    desc: "Initialiser shadcn/ui dans le projet.",
  },
  {
    cmd: "npm install prisma --save-dev",
    desc: "Installer Prisma (outil de migration) en développement.",
  },
  {
    cmd: "npm install @prisma/client",
    desc: "Installer le client Prisma pour interagir avec la base de données.",
  },
  {
    cmd: "npx prisma init",
    desc: "Initialiser la configuration Prisma.",
  },
  {
    cmd: "npx prisma generate",
    desc: "Générer le client Prisma à partir du schéma.",
  },
  {
    cmd: 'npx prisma migrate dev --name "nom_migration"',
    desc: "Créer et appliquer une migration de base de données.",
  },
];

// Commandes Git avec descriptif
const gitCommands = [
  {
    cmd: "git init",
    desc: "Initialiser un nouveau dépôt Git local.",
  },
  {
    cmd: "git clone <url>",
    desc: "Cloner un dépôt distant sur ta machine.",
  },
  {
    cmd: "git status",
    desc: "Afficher l’état des fichiers suivis et non suivis.",
  },
  {
    cmd: "git add <fichier>",
    desc: "Ajouter un fichier à l’index (pour le prochain commit).",
  },
  {
    cmd: 'git commit -m "message"',
    desc: "Valider les changements avec un message.",
  },
  {
    cmd: "git branch",
    desc: "Lister, créer ou supprimer des branches.",
  },
  {
    cmd: "git checkout <branche>",
    desc: "Basculer sur une autre branche.",
  },
  {
    cmd: "git switch <branche>",
    desc: "Changer de branche (commande moderne).",
  },
  {
    cmd: "git merge <branche>",
    desc: "Fusionner une branche dans la branche courante.",
  },
  {
    cmd: "git pull",
    desc: "Récupérer et fusionner les changements distants.",
  },
  {
    cmd: "git push",
    desc: "Envoyer les commits locaux vers le dépôt distant.",
  },
  {
    cmd: "git log",
    desc: "Afficher l’historique des commits.",
  },
  {
    cmd: "git diff",
    desc: "Afficher les différences entre les versions de fichiers.",
  },
  {
    cmd: "git remote add origin <url>",
    desc: "Ajouter un dépôt distant nommé 'origin'.",
  },
  {
    cmd: "git fetch",
    desc: "Récupérer les changements distants sans fusionner.",
  },
];

// Composant bouton de copie
interface CopyButtonProps {
  text: string;
}

function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className={`ml-2 px-2 py-1 text-xs rounded ${copied ? "bg-green-400 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
      aria-label="Copier la commande"
    >
      {copied ? "Copié !" : "Copier"}
    </button>
  );
}

export default function ResourcesPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Ressources et Commandes Utiles
      </h1>

      {/* Liens */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">🌐 Liens Utiles</h2>
        <ul className="space-y-4">
          {links.map((link) => (
            <li
              key={link.url}
              className="border rounded-lg p-4 hover:shadow transition flex flex-col bg-white"
            >
              <div className="flex items-center mb-1">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium underline mr-2"
                >
                  {link.title}
                </a>
                <span className="text-xs text-gray-400">(nouvel onglet)</span>
              </div>
              <span className="text-gray-700">{link.description}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Commandes npm/npx */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          📦 Commandes <span className="text-green-700">npm & npx</span>
        </h2>
        <ul className="space-y-4">
          {npmCommands.map((item, idx) => (
            <li
              key={idx}
              className="bg-gray-50 border rounded-lg p-4 flex flex-col"
            >
              <div className="flex items-center">
                <code className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">
                  {item.cmd}
                </code>
                <CopyButton text={item.cmd} />
              </div>
              <span className="text-gray-700 mt-1 text-sm">{item.desc}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Commandes Git */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          🔧 Commandes <span className="text-purple-700">Git</span>
        </h2>
        <ul className="space-y-4">
          {gitCommands.map((item, idx) => (
            <li
              key={idx}
              className="bg-gray-50 border rounded-lg p-4 flex flex-col"
            >
              <div className="flex items-center">
                <code className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">
                  {item.cmd}
                </code>
                <CopyButton text={item.cmd} />
              </div>
              <span className="text-gray-700 mt-1 text-sm">{item.desc}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
