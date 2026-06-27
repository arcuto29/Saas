// @ts-nocheck
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/trades - List trades for authenticated user
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const direction = searchParams.get("direction");
    const setup = searchParams.get("setup");
    const status = searchParams.get("status") || "closed";

    const where: Record<string, unknown> = {
      userId: session.user.id,
      status,
    };

    if (direction) where.direction = direction;
    if (setup) where.setup = { contains: setup, mode: "insensitive" };

    const [trades, total] = await Promise.all([
      prisma.trade.findMany({
        where,
        include: {
          emotions: true,
          mistakes: true,
          tags: { include: { tag: true } },
          screenshots: true,
        },
        orderBy: { entryDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.trade.count({ where }),
    ]);

    return NextResponse.json({
      trades,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching trades:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/trades - Create a new trade
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      instrument,
      direction,
      entryPrice,
      exitPrice,
      stopLoss,
      takeProfit,
      quantity,
      commission,
      setup,
      tradeSession,
      entryDate,
      exitDate,
      notes,
      rating,
      accountId,
      emotions,
      mistakes,
      tags,
    } = body;

    // Calculate result
    let result: number | null = null;
    let riskReward: number | null = null;

    if (exitPrice) {
      if (direction === "long") {
        result = (exitPrice - entryPrice) * quantity - (commission || 0);
      } else {
        result = (entryPrice - exitPrice) * quantity - (commission || 0);
      }

      if (stopLoss) {
        const risk = Math.abs(entryPrice - stopLoss);
        const reward = Math.abs(exitPrice - entryPrice);
        riskReward = risk > 0 ? reward / risk : null;
      }
    }

    const trade = await prisma.trade.create({
      data: {
        userId: session.user.id,
        accountId: accountId || undefined,
        instrument,
        direction,
        entryPrice: parseFloat(entryPrice),
        exitPrice: exitPrice ? parseFloat(exitPrice) : null,
        stopLoss: stopLoss ? parseFloat(stopLoss) : null,
        takeProfit: takeProfit ? parseFloat(takeProfit) : null,
        quantity: parseFloat(quantity) || 1,
        commission: parseFloat(commission) || 0,
        result,
        riskReward,
        status: exitPrice ? "closed" : "open",
        setup: setup || null,
        session: tradeSession || null,
        entryDate: new Date(entryDate),
        exitDate: exitDate ? new Date(exitDate) : null,
        notes: notes || null,
        rating: rating || null,
        emotions: emotions?.length
          ? { create: emotions.map((e: string) => ({ emotion: e })) }
          : undefined,
        mistakes: mistakes?.length
          ? { create: mistakes.map((m: string) => ({ mistake: m })) }
          : undefined,
      },
      include: {
        emotions: true,
        mistakes: true,
      },
    });

    // Handle tags separately (create if not exists)
    if (tags?.length) {
      for (const tagName of tags) {
        const tag = await prisma.tag.upsert({
          where: { userId_name: { userId: session.user.id, name: tagName } },
          update: {},
          create: { userId: session.user.id, name: tagName },
        });
        await prisma.tradeTag.create({
          data: { tradeId: trade.id, tagId: tag.id },
        });
      }
    }

    return NextResponse.json({ trade }, { status: 201 });
  } catch (error) {
    console.error("Error creating trade:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
