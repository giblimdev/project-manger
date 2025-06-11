//@/validation/features.ts
import { z } from "zod";
import { Status } from "@/lib/generated/prisma/client";

export const createFeatureSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  projectId: z.string(),
  description: z.string().optional(),
  status: z.enum([
    "TODO",
    "IN_PROGRESS",
    "REVIEW",
    "DONE",
    "BLOCKED",
    "CANCELLED",
  ]),
  priority: z.number().min(1).max(5),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  parentFeatureId: z.string().optional(),
});

export type CreateFeatureInput = z.infer<typeof createFeatureSchema>;
