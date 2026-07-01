import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      discord,
      plan,
      experience,
      market,
      goal,
      biggestStruggle,
      moneyLost,
      triedBefore,
      availability,
      whyNow,
      message,
    } = body;

    // Validate required fields
    if (!name || !email || !plan || !experience || !biggestStruggle) {
      return NextResponse.json(
        { error: "Please fill in all required fields (name, email, plan, experience, and biggest struggle)" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const application = {
      id: crypto.randomUUID(),
      name,
      email,
      discord: discord || null,
      plan,
      experience,
      market: market || null,
      goal: goal || null,
      biggestStruggle: biggestStruggle || null,
      moneyLost: moneyLost || null,
      triedBefore: triedBefore || null,
      availability: availability || null,
      whyNow: whyNow || null,
      message: message || null,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    // Try to save to database if available
    try {
      const { db } = await import("@/lib/prisma");
      const client = await db();
      if (client) {
        await client.application.create({
          data: {
            name,
            email,
            discord: discord || null,
            plan,
            experience,
            market: market || null,
            goal: goal || null,
            biggestStruggle: biggestStruggle || null,
            moneyLost: moneyLost || null,
            triedBefore: triedBefore || null,
            availability: availability || null,
            whyNow: whyNow || null,
            message: message || null,
          },
        });
        console.log("✅ Application saved to database:", application.id);
      } else {
        console.log("📋 New mentorship application (no DB):", JSON.stringify(application, null, 2));
      }
    } catch (dbError) {
      console.log("📋 DB save failed, logging application:", JSON.stringify(application, null, 2));
    }

    // Send Discord webhook notification if configured
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [
              {
                title: "🎓 New Mentorship Application",
                color: 0xd4af37, // Gold
                fields: [
                  { name: "👤 Name", value: name, inline: true },
                  { name: "📧 Email", value: email, inline: true },
                  { name: "💬 Discord", value: discord || "Not provided", inline: true },
                  { name: "💰 Plan", value: plan, inline: true },
                  { name: "📊 Experience", value: experience, inline: true },
                  { name: "📈 Market", value: market || "Not specified", inline: true },
                  { name: "🎯 Goal", value: goal || "Not specified", inline: false },
                  { name: "🔥 Biggest Struggle", value: biggestStruggle || "Not shared", inline: false },
                  { name: "💸 Money Lost", value: moneyLost || "Not shared", inline: true },
                  { name: "⏰ Availability", value: availability || "Not shared", inline: true },
                  { name: "❓ Why Now", value: whyNow || "Not shared", inline: false },
                  { name: "📚 Tried Before", value: triedBefore || "Not shared", inline: false },
                  { name: "📝 Message", value: message || "None", inline: false },
                ],
                timestamp: new Date().toISOString(),
                footer: { text: "PrismaFx Mentorship Applications" },
              },
            ],
          }),
        });
        console.log("📨 Discord webhook sent");
      } catch (webhookError) {
        console.error("Discord webhook failed:", webhookError);
      }
    }

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        applicationId: application.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint to list applications (admin only — you'd add auth here)
export async function GET() {
  try {
    const { db } = await import("@/lib/prisma");
    const client = await db();
    if (!client) {
      return NextResponse.json(
        { applications: [], message: "Database not connected" },
        { status: 200 }
      );
    }
    const applications = await client.application.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ applications }, { status: 200 });
  } catch {
    return NextResponse.json(
      { applications: [], message: "Database error" },
      { status: 200 }
    );
  }
}
