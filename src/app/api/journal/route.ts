import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { startOfDay } from "date-fns";

// GET /api/journal - Get journal entry for a date
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");
    const date = dateParam ? startOfDay(new Date(dateParam)) : startOfDay(new Date());

    const journal = await prisma.dailyJournal.findFirst({
      where: { userId: session.user.id, date },
    });

    return NextResponse.json({ journal });
  } catch (error) {
    console.error("Error fetching journal:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/journal - Create or update journal entry
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { date, ...data } = body;
    const journalDate = startOfDay(new Date(date || Date.now()));

    const journal = await prisma.dailyJournal.upsert({
      where: {
        userId_date: {
          userId: session.user.id,
          date: journalDate,
        },
      },
      update: data,
      create: {
        userId: session.user.id,
        date: journalDate,
        ...data,
      },
    });

    return NextResponse.json({ journal });
  } catch (error) {
    console.error("Error saving journal:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
