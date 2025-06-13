import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { z } from "zod";
import { SprintStatus } from "@/lib/generated/prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Validation schema for PUT request body
const updateSprintSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  goal: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z
    .enum([
      SprintStatus.PLANNED,
      SprintStatus.ACTIVE,
      SprintStatus.COMPLETED,
      SprintStatus.CANCELLED,
    ])
    .optional(),
  projectId: z.string().uuid().optional(),
  creatorId: z.string().uuid().optional(),
});

// GET: Fetch a sprint by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { sprintId: string } }
) {
  try {
    const { sprintId } = params;

    if (!sprintId) {
      return NextResponse.json(
        { error: "Sprint ID is required" },
        { status: 400 }
      );
    }

    const sprint = await prisma.sprints.findUnique({
      where: { id: sprintId },
      include: {
        project: true,
        creator: true,
        comments: true,
        roadMaps: true,
        features: true,
        userStories: true,
        tasks: true,
      },
    });

    if (!sprint) {
      return NextResponse.json({ error: "Sprint not found" }, { status: 404 });
    }

    return NextResponse.json(sprint, { status: 200 });
  } catch (error) {
    console.error("Error fetching sprint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: Update a sprint by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { sprintId: string } }
) {
  try {
    const { sprintId } = params;

    if (!sprintId) {
      return NextResponse.json(
        { error: "Sprint ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validation = updateSprintSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validation.error.errors },
        { status: 400 }
      );
    }

    const sprint = await prisma.sprints.findUnique({
      where: { id: sprintId },
    });

    if (!sprint) {
      return NextResponse.json({ error: "Sprint not found" }, { status: 404 });
    }

    const updatedSprint = await prisma.sprints.update({
      where: { id: sprintId },
      data: {
        ...validation.data,
        startDate: validation.data.startDate
          ? new Date(validation.data.startDate)
          : undefined,
        endDate: validation.data.endDate
          ? new Date(validation.data.endDate)
          : undefined,
      },
    });

    return NextResponse.json(updatedSprint, { status: 200 });
  } catch (error) {
    console.error("Error updating sprint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a sprint by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { sprintId: string } }
) {
  try {
    const { sprintId } = params;

    if (!sprintId) {
      return NextResponse.json(
        { error: "Sprint ID is required" },
        { status: 400 }
      );
    }

    const sprint = await prisma.sprints.findUnique({
      where: { id: sprintId },
    });

    if (!sprint) {
      return NextResponse.json({ error: "Sprint not found" }, { status: 404 });
    }

    await prisma.sprints.delete({
      where: { id: sprintId },
    });

    return NextResponse.json(
      { message: "Sprint deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting sprint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
