// types/project.ts
import {
  Projects,
  User,
  Teams,
  Features,
  UserStory,
  Sprints,
  RoadMap,
  Files,
  Comments,
  Status,
  Prisma,
} from "@/lib/generated/prisma/client";

// Type de base pour un projet avec toutes ses relations
export type ProjectWithRelations = Projects & {
  creator?: User | null;
  users?: User[];
  teams?: Teams[];
  features?: Features[];
  userStories?: UserStory[];
  sprints?: Sprints[];
  RoadMap?: RoadMap[];
  files?: Files[];
  comments?: Comments[];
  _count?: {
    features: number;
    userStories: number;
    files: number;
    comments: number;
    users: number;
    teams: number;
    sprints: number;
    RoadMap: number;
  };
};

// Type pour un projet avec des relations spécifiques
export type ProjectWithUsers = Prisma.ProjectsGetPayload<{
  include: {
    creator: {
      select: {
        id: true;
        name: true;
        email: true;
        image: true;
        role: true;
      };
    };
    users: {
      select: {
        id: true;
        name: true;
        email: true;
        image: true;
        role: true;
      };
    };
  };
}>;

// Type pour un projet avec équipes
export type ProjectWithTeams = Prisma.ProjectsGetPayload<{
  include: {
    creator: true;
    teams: {
      include: {
        members: {
          select: {
            id: true;
            name: true;
            email: true;
            image: true;
          };
        };
      };
    };
  };
}>;

// Type pour un projet complet avec toutes les relations
export type ProjectFull = Prisma.ProjectsGetPayload<{
  include: {
    creator: {
      select: {
        id: true;
        name: true;
        email: true;
        image: true;
        role: true;
      };
    };
    users: {
      select: {
        id: true;
        name: true;
        email: true;
        image: true;
        role: true;
      };
    };
    teams: {
      include: {
        members: {
          select: {
            id: true;
            name: true;
            email: true;
            image: true;
          };
        };
      };
    };
    features: {
      include: {
        creator: {
          select: {
            id: true;
            name: true;
            email: true;
          };
        };
        _count: {
          select: {
            tasks: true;
            comments: true;
          };
        };
      };
    };
    userStories: {
      include: {
        creator: {
          select: {
            id: true;
            name: true;
            email: true;
          };
        };
        _count: {
          select: {
            tasks: true;
            comments: true;
          };
        };
      };
    };
    sprints: true;
    RoadMap: {
      include: {
        creator: {
          select: {
            id: true;
            name: true;
            email: true;
          };
        };
      };
    };
    files: {
      include: {
        uploader: {
          select: {
            id: true;
            name: true;
            email: true;
          };
        };
      };
    };
    comments: {
      include: {
        author: {
          select: {
            id: true;
            name: true;
            email: true;
            image: true;
          };
        };
      };
    };
    _count: {
      select: {
        features: true;
        userStories: true;
        files: true;
        comments: true;
        users: true;
        teams: true;
        sprints: true;
        RoadMap: true;
      };
    };
  };
}>;

// Type pour la liste des projets (version allégée)
export type ProjectListItem = Prisma.ProjectsGetPayload<{
  include: {
    creator: {
      select: {
        id: true;
        name: true;
        email: true;
        image: true;
      };
    };
    _count: {
      select: {
        features: true;
        userStories: true;
        users: true;
        files: true;
      };
    };
  };
}>;

// Interface pour créer un nouveau projet
export interface CreateProjectData {
  userId: string;
  name: string;
  description?: string;
  image?: string;
  status?: Status;
  priority?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  userIds?: string[];
  teamIds?: string[];
}

// Interface pour mettre à jour un projet
export interface UpdateProjectData {
  name?: string;
  description?: string;
  image?: string;
  status?: Status;
  priority?: number;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  userIds?: string[];
  teamIds?: string[];
}

// Type pour les filtres de projet
export interface ProjectFilters {
  status?: Status | "all";
  priority?: number;
  creatorId?: string;
  teamId?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

// Type pour le tri des projets
export type ProjectSortBy =
  | "newest"
  | "oldest"
  | "priority"
  | "name"
  | "status"
  | "dueDate";

// Interface pour les options de requête
export interface ProjectQueryOptions {
  filters?: ProjectFilters;
  sortBy?: ProjectSortBy;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  include?: {
    creator?: boolean;
    users?: boolean;
    teams?: boolean;
    features?: boolean;
    userStories?: boolean;
    sprints?: boolean;
    roadmaps?: boolean;
    files?: boolean;
    comments?: boolean;
    counts?: boolean;
  };
}

// Type pour les statistiques de projet
export interface ProjectStats {
  totalProjects: number;
  projectsByStatus: Record<Status, number>;
  averagePriority: number;
  totalFeatures: number;
  totalUserStories: number;
  totalUsers: number;
  totalTeams: number;
  recentActivity: number;
}

// Type pour les permissions de projet
export interface ProjectPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  canManageTeams: boolean;
  canCreateFeatures: boolean;
  canCreateUserStories: boolean;
  canManageFiles: boolean;
  isCreator: boolean;
  isAdmin: boolean;
}

// Type pour l'activité récente du projet
export interface ProjectActivity {
  id: string;
  type:
    | "feature_created"
    | "user_story_created"
    | "user_added"
    | "team_added"
    | "status_changed"
    | "comment_added";
  message: string;
  userId: string;
  userName?: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

// Type pour les métriques de projet
export interface ProjectMetrics {
  completionRate: number; // Pourcentage de features/user stories terminées
  averageTaskDuration: number; // Durée moyenne des tâches en jours
  teamProductivity: number; // Nombre de tâches terminées par membre
  timeToCompletion: number; // Estimation du temps restant
  riskLevel: "low" | "medium" | "high"; // Niveau de risque basé sur les échéances
}

// Export des types utilitaires Prisma
export type ProjectInclude = Prisma.ProjectsInclude;
export type ProjectSelect = Prisma.ProjectsSelect;
export type ProjectWhereInput = Prisma.ProjectsWhereInput;
export type ProjectOrderByInput = Prisma.ProjectsOrderByWithRelationInput;
export type ProjectCreateInput = Prisma.ProjectsCreateInput;
export type ProjectUpdateInput = Prisma.ProjectsUpdateInput;
