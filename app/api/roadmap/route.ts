// app/api/roadmap/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/roadmap?projectId=...
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json(
      { error: "projectId is required" },
      { status: 400 }
    );
  }

  try {
    const roadmaps = await prisma.roadMap.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(roadmaps);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch roadmaps" },
      { status: 500 }
    );
  }
}

// POST /api/roadmap
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // Optionnel : ajouter une validation stricte ici
    const newRoadmap = await prisma.roadMap.create({ data });
    return NextResponse.json(newRoadmap, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create roadmap" },
      { status: 500 }
    );
  }
}

// PUT /api/roadmap
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.id) {
      return NextResponse.json(
        { error: "id is required for update" },
        { status: 400 }
      );
    }
    const updatedRoadmap = await prisma.roadMap.update({
      where: { id: data.id },
      data,
    });
    return NextResponse.json(updatedRoadmap);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update roadmap" },
      { status: 500 }
    );
  }
}

// DELETE /api/roadmap?id=...
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "id is required for deletion" },
      { status: 400 }
    );
  }
  try {
    await prisma.roadMap.delete({ where: { id } });
    return NextResponse.json({ message: "Roadmap deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete roadmap" },
      { status: 500 }
    );
  }
}
