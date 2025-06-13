import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust the import path based on your project structure
import { z } from "zod";

// Define the expected input schema using Zod
const OrderSchema = z.array(
  z.object({
    id: z.string(),
    order: z.number().int().nonnegative(),
  })
);

// PATCH handler for updating the order of comments
export async function PATCH(req: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await req.json();
    const { items } = z.object({ items: OrderSchema }).parse(body);

    // Update the order of comments in a transaction
    await prisma.$transaction(
      items.map((item) =>
        prisma.comments.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    // Return success response
    return NextResponse.json(
      { message: "Order updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.errors },
        { status: 400 }
      );
    }

    // Handle database or other errors
    console.error("Error updating comment order:", error);
    return NextResponse.json(
      { error: "Failed in updating comment order" },
      { status: 500 }
    );
  }
}
