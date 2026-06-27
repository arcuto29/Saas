import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/prop-firms - List prop firm accounts
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accounts = await prisma.propFirmAccount.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error("Error fetching prop firms:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/prop-firms - Create prop firm account
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      firmName,
      accountSize,
      currentBalance,
      dailyLossLimit,
      overallMaxLoss,
      trailingDrawdown,
      profitTarget,
      requiredDays,
      consistencyRule,
      phase,
    } = body;

    const account = await prisma.propFirmAccount.create({
      data: {
        userId: session.user.id,
        firmName,
        accountSize: parseFloat(accountSize),
        currentBalance: parseFloat(currentBalance || accountSize),
        dailyLossLimit: parseFloat(dailyLossLimit),
        overallMaxLoss: parseFloat(overallMaxLoss),
        trailingDrawdown: trailingDrawdown || false,
        profitTarget: parseFloat(profitTarget),
        requiredDays: requiredDays ? parseInt(requiredDays) : null,
        consistencyRule: consistencyRule || null,
        phase: phase || "challenge",
        startDate: new Date(),
      },
    });

    return NextResponse.json({ account }, { status: 201 });
  } catch (error) {
    console.error("Error creating prop firm:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
