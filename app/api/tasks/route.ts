import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust the import path based on your project structure
import { z } from "zod";
import { getServerSession } from "@/lib/auth/auth-server"; // Adjust based on your auth setup

// Validation schema for GET query parameters
const GetQuerySchema = z.object({
  projectId: z.string().uuid().optional(),
  status: z
    .enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE", "BLOCKED", "CANCELLED"])
    .optional(),
  limit: z.coerce.number().int().positive().default(10).optional(),
  offset: z.coerce.number().int().nonnegative().default(0).optional(),
  sortBy: z
    .enum(["createdAt", "priority", "dueDate"])
    .default("createdAt")
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc").optional(),
});

// Validation schema for POST body
const PostTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z
    .enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE", "BLOCKED", "CANCELLED"])
    .default("TODO")
    .optional(),
  priority: z.number().int().min(1).default(1).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  projectId: z.string().uuid("Invalid project ID"),
  assigneeId: z.string().uuid("Invalid assignee ID").optional().nullable(),
  parentTaskId: z.string().uuid("Invalid parent task ID").optional().nullable(),
});

// GET: Retrieve tasks with optional filtering and pagination
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate query parameters
    const url = new URL(req.url);
    const query = {
      projectId: url.searchParams.get("projectId") || undefined,
      status: url.searchParams.get("status") || undefined,
      limit: url.searchParams.get("limit") || undefined,
      offset: url.searchParams.get("offset") || undefined,
      sortBy: url.searchParams.get("sortBy") || undefined,
      sortOrder: url.searchParams.get("sortOrder") || undefined,
    };
    const { projectId, status, limit, offset, sortBy, sortOrder } =
      GetQuerySchema.parse(query);

    // Build Prisma query
    const where = {
      ...(projectId && { projectId }),
      ...(status && { status }),
    };
    const orderBy = { [sortBy]: sortOrder };

    // Fetch tasks
    const [tasks, total] = await Promise.all([
      prisma.tasks.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          dueDate: true,
          createdAt: true,
          updatedAt: true,
          projectId: true,
          assigneeId: true,
          parentTaskId: true,
        },
      }),
      prisma.tasks.count({ where }),
    ]);

    return NextResponse.json(
      {
        tasks,
        total,
        limit,
        offset,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST: Create a new task
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await req.json();
    const data = PostTaskSchema.parse(body);

    // Verify project exists
    const project = await prisma.projects.findUnique({
      where: { id: data.projectId },
    });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Verify assignee exists (if provided)
    if (data.assigneeId) {
      const assignee = await prisma.user.findUnique({
        where: { id: data.assigneeId },
      });
      if (!assignee) {
        return NextResponse.json(
          { error: "Assignee not found" },
          { status: 404 }
        );
      }
    }

    // Verify parent task exists (if provided)
    if (data.parentTaskId) {
      const parentTask = await prisma.tasks.findUnique({
        where: { id: data.parentTaskId },
      });
      if (!parentTask) {
        return NextResponse.json(
          { error: "Parent task not found" },
          { status: 404 }
        );
      }
    }

    // Create task
    const task = await prisma.tasks.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        projectId: data.projectId,
        assigneeId: data.assigneeId,
        parentTaskId: data.parentTaskId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
        projectId: true,
        assigneeId: true,
        parentTaskId: true,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
