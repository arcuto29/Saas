import { NextResponse } from "next/server";
import { createApplication, listApplications } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name, email, discord, plan, experience, market,
      goal, biggestStruggle, moneyLost, triedBefore,
      availability, whyNow, message,
    } = body;

    if (!name || !email || !plan || !experience) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Save to database
    const result = await createApplication({
      name, email,
      discord: discord || null,
      plan, experience,
      market: market || null,
      goal: goal || null,
      biggestStruggle: biggestStruggle || null,
      moneyLost: moneyLost || null,
      triedBefore: triedBefore || null,
      availability: availability || null,
      whyNow: whyNow || null,
      message: message || null,
    });

    // Send Discord webhook
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [{
              title: "🎓 New Mentorship Application",
              color: 0xD4AF37,
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
                { name: "📝 Message", value: message || "None", inline: false },
              ],
              timestamp: new Date().toISOString(),
              footer: { text: "PrismaFx Mentorship Applications" },
            }],
          }),
        });
      } catch (e) {
        console.error("Webhook failed:", e);
      }
    }

    return NextResponse.json(
      { message: "Application submitted successfully", applicationId: result?.id || "submitted" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Application error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const applications = await listApplications();
    return NextResponse.json({ applications }, { status: 200 });
  } catch {
    return NextResponse.json({ applications: [] }, { status: 200 });
  }
}
