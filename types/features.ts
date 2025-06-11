// lib/types/features.ts
export enum Status {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  CANCELLED = "CANCELLED",
}

export interface Features {
  id: string;
  name: string;
  description?: string;
  priority: number;
  status: Status;
  projectId: string;
  startDate?: Date;
  endDate?: Date;
  parentFeatureId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateFeatureData = Omit<
  Features,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateFeatureData = Partial<CreateFeatureData>;
