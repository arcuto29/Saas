import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/trades/[id] - Get single trade
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const trade = await prisma.trade.findFirst({
      where: { id, userId: session.user.id },
      include: {
        emotions: true,
        mistakes: true,
        tags: { include: { tag: true } },
        screenshots: true,
        account: true,
      },
    });

    if (!trade) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }

    return NextResponse.json({ trade });
  } catch (error) {
    console.error("Error fetching trade:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/trades/[id] - Update trade
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Verify ownership
    const existing = await prisma.trade.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }

    const { emotions, mistakes, tags, ...updateData } = body;

    // Recalculate result if prices changed
    if (updateData.exitPrice) {
      const entry = updateData.entryPrice || existing.entryPrice;
      const exit = parseFloat(updateData.exitPrice);
      const qty = updateData.quantity || existing.quantity;
      const comm = updateData.commission || existing.commission;
      const dir = updateData.direction || existing.direction;

      if (dir === "long") {
        updateData.result = (exit - entry) * qty - comm;
      } else {
        updateData.result = (entry - exit) * qty - comm;
      }
      updateData.status = "closed";
    }

    const trade = await prisma.trade.update({
      where: { id },
      data: updateData,
      include: { emotions: true, mistakes: true },
    });

    // Update emotions if provided
    if (emotions !== undefined) {
      await prisma.tradeEmotion.deleteMany({ where: { tradeId: id } });
      if (emotions.length > 0) {
        await prisma.tradeEmotion.createMany({
          data: emotions.map((e: string) => ({ tradeId: id, emotion: e })),
        });
      }
    }

    // Update mistakes if provided
    if (mistakes !== undefined) {
      await prisma.tradeMistake.deleteMany({ where: { tradeId: id } });
      if (mistakes.length > 0) {
        await prisma.tradeMistake.createMany({
          data: mistakes.map((m: string) => ({ tradeId: id, mistake: m })),
        });
      }
    }

    return NextResponse.json({ trade });
  } catch (error) {
    console.error("Error updating trade:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/trades/[id] - Delete trade
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.trade.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }

    await prisma.trade.delete({ where: { id } });

    return NextResponse.json({ message: "Trade deleted" });
  } catch (error) {
    console.error("Error deleting trade:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
