export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  phase: string;
  estimatedDays: number;
  progress: number;
  deliverables: string[];
  technologies: string[];
  dependencies: number[];
  priority: "High" | "Medium" | "Low";
}

const roadmapData: RoadmapTask[] = [
  {
    id: "1",
    title: "Configuration de l'environnement et outils",
    description:
      "Initialisation du projet Next.js 15+, configuration Prisma, setup de la base de données SQLite, configuration des outils de développement et CI/CD",
    phase: "Setup",
    estimatedDays: 5,
    progress: 0,
    deliverables: [
      "Projet Next.js 15+ configuré",
      "Prisma client généré",
      "Base de données SQLite initialisée",
      "Configuration TypeScript",
      "Setup ESLint et Prettier",
      "Configuration Tailwind CSS",
    ],
    technologies: [
      "Next.js 15",
      "Prisma",
      "SQLite",
      "TypeScript",
      "Tailwind CSS",
    ],
    dependencies: [],
    priority: "High",
  },
  {
    id: "2",
    title: "Système d'authentification et gestion des rôles",
    description:
      "Implémentation complète du système d'authentification avec sessions sécurisées, comptes multiples, vérification email et gestion des rôles utilisateur",
    phase: "Authentication",
    estimatedDays: 10,
    progress: 0,
    deliverables: [
      "Modèle User avec rôles",
      "Système de sessions sécurisées",
      "Gestion des comptes multiples",
      "Vérification par email",
      "Middleware d'authentification",
      "Pages de connexion/inscription",
      "Gestion des permissions par rôle",
    ],
    technologies: ["Next.js Auth", "Prisma", "JWT", "Nodemailer", "bcrypt"],
    dependencies: [1],
    priority: "High",
  },
  {
    id: "3",
    title: "Modules de gestion des équipes et projets",
    description:
      "Développement des modèles Team et Project avec relations many-to-many, CRUD complet, gestion des types d'équipes et statuts de projets",
    phase: "Core",
    estimatedDays: 15,
    progress: 0,
    deliverables: [
      "Modèles Team et Project",
      "Relations many-to-many",
      "CRUD équipes et projets",
      "Gestion des types d'équipes",
      "Système de statuts et priorités",
      "Interface de gestion",
      "Tableaux de bord projets",
    ],
    technologies: ["Prisma", "React", "Next.js API Routes", "Zod"],
    dependencies: [2],
    priority: "High",
  },
  {
    id: "4",
    title: "Fonctionnalités méthodologie agile",
    description:
      "Implémentation complète des features, user stories, sprints et tâches avec hiérarchies, assignations et suivi du temps",
    phase: "Agile",
    estimatedDays: 20,
    progress: 0,
    deliverables: [
      "Modèles Feature avec hiérarchie",
      "User Stories avec objectifs",
      "Système de sprints",
      "Gestion des tâches",
      "Assignation et suivi",
      "Tableaux Kanban",
      "Burndown charts",
      "Suivi du temps (TimeLog)",
    ],
    technologies: ["React DnD", "Chart.js", "Date-fns", "Prisma"],
    dependencies: [3],
    priority: "High",
  },
  {
    id: "5",
    title: "Collaboration et communication",
    description:
      "Système de commentaires hiérarchiques, notifications en temps réel et fonctionnalités de collaboration d'équipe",
    phase: "Collaboration",
    estimatedDays: 10,
    progress: 0,
    deliverables: [
      "Système de commentaires hiérarchiques",
      "Commentaires polymorphes",
      "Notifications en temps réel",
      "Mentions utilisateurs",
      "Historique des discussions",
      "Interface de chat",
      "Notifications push",
    ],
    technologies: ["Socket.io", "React", "Web Push API", "Prisma"],
    dependencies: [4],
    priority: "Medium",
  },
  {
    id: "6",
    title: "Système de gestion de fichiers et documentation",
    description:
      "Upload de fichiers, organisation hiérarchique, types de fichiers, prévisualisation et gestion des versions",
    phase: "Files",
    estimatedDays: 10,
    progress: 0,
    deliverables: [
      "Upload de fichiers sécurisé",
      "Organisation hiérarchique",
      "Types de fichiers multiples",
      "Prévisualisation fichiers",
      "Gestion des versions",
      "Recherche dans les fichiers",
      "Permissions de fichiers",
    ],
    technologies: ["Multer", "Sharp", "AWS S3", "React Dropzone"],
    dependencies: [3],
    priority: "Medium",
  },
  {
    id: "7",
    title: "Gestion dynamique des schémas de base de données",
    description:
      "Système de schémas personnalisés par projet avec hiérarchie Schema → Table → Champ et types de données flexibles",
    phase: "Advanced",
    estimatedDays: 15,
    progress: 0,
    deliverables: [
      "Modèles ProjectSchema et SchemaField",
      "Hiérarchie à 3 niveaux",
      "Types de champs dynamiques",
      "Validation des schémas",
      "Interface de création",
      "Génération automatique de formulaires",
      "Export/Import de schémas",
    ],
    technologies: ["React Hook Form", "Zod", "JSON Schema", "Prisma"],
    dependencies: [3],
    priority: "Low",
  },
  {
    id: "8",
    title: "Audit et journalisation des activités",
    description:
      "Système complet de logs d'activité, traçabilité des actions utilisateur et monitoring des performances",
    phase: "Quality",
    estimatedDays: 7,
    progress: 0,
    deliverables: [
      "Modèle ActivityLog",
      "Middleware de logging",
      "Traçabilité complète",
      "Interface de consultation",
      "Filtres et recherche",
      "Export des logs",
      "Monitoring des performances",
    ],
    technologies: ["Winston", "Prisma", "React", "Date-fns"],
    dependencies: [2],
    priority: "Medium",
  },
  {
    id: "9",
    title: "Tests, débogage et optimisation",
    description:
      "Tests unitaires, tests d'intégration, tests E2E, optimisation des performances et correction des bugs",
    phase: "Quality",
    estimatedDays: 15,
    progress: 0,
    deliverables: [
      "Tests unitaires complets",
      "Tests d'intégration API",
      "Tests E2E avec Playwright",
      "Optimisation des requêtes",
      "Mise en cache Redis",
      "Optimisation des performances",
      "Documentation technique",
    ],
    technologies: ["Jest", "Playwright", "Redis", "React Testing Library"],
    dependencies: [1, 2, 3, 4, 5, 6, 7, 8],
    priority: "High",
  },
  {
    id: "10",
    title: "Déploiement et monitoring",
    description:
      "Déploiement en production, configuration du monitoring, analytics et mise en place de la surveillance",
    phase: "Deployment",
    estimatedDays: 5,
    progress: 0,
    deliverables: [
      "Déploiement Vercel/AWS",
      "Configuration base de données production",
      "Monitoring avec Sentry",
      "Analytics utilisateur",
      "Backup automatique",
      "Documentation déploiement",
      "Surveillance des performances",
    ],
    technologies: ["Vercel", "AWS", "Sentry", "Google Analytics", "PostgreSQL"],
    dependencies: [9],
    priority: "High",
  },
];

export default roadmapData;
