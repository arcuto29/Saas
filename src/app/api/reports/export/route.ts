import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/reports/export - Export trades to CSV
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "csv";

    const trades = await prisma.trade.findMany({
      where: { userId: session.user.id, status: "closed" },
      include: {
        emotions: true,
        mistakes: true,
        account: true,
      },
      orderBy: { entryDate: "desc" },
    });

    if (format === "csv") {
      const headers = [
        "Date",
        "Instrument",
        "Direction",
        "Entry Price",
        "Exit Price",
        "Stop Loss",
        "Take Profit",
        "Quantity",
        "Commission",
        "Result ($)",
        "R:R",
        "Setup",
        "Session",
        "Account",
        "Emotions",
        "Mistakes",
        "Notes",
        "Rating",
      ].join(",");

      const rows = trades.map((t) =>
        [
          t.entryDate.toISOString().split("T")[0],
          t.instrument,
          t.direction,
          t.entryPrice,
          t.exitPrice || "",
          t.stopLoss || "",
          t.takeProfit || "",
          t.quantity,
          t.commission,
          t.result?.toFixed(2) || "",
          t.riskReward?.toFixed(2) || "",
          t.setup || "",
          t.session || "",
          t.account?.name || "",
          t.emotions.map((e) => e.emotion).join(";"),
          t.mistakes.map((m) => m.mistake).join(";"),
          `"${(t.notes || "").replace(/"/g, '""')}"`,
          t.rating || "",
        ].join(",")
      );

      const csv = [headers, ...rows].join("\n");

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="priisma-edge-trades-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    // JSON export
    return NextResponse.json({ trades });
  } catch (error) {
    console.error("Error exporting:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
