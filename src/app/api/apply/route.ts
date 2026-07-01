import { NextResponse } from "next/server";

// In production, you'd store this in a database and/or send a notification
// For now, this logs the application and returns success
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, discord, plan, experience, market, goal, message } = body;

    // Validate required fields
    if (!name || !email || !plan || !experience) {
      return NextResponse.json(
        { error: "Name, email, plan, and experience level are required" },
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

    // Log the application (in production, save to DB)
    const application = {
      id: crypto.randomUUID(),
      name,
      email,
      discord: discord || null,
      plan,
      experience,
      market: market || null,
      goal: goal || null,
      message: message || null,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    // In production, you would:
    // 1. Save to database: await prisma.application.create({ data: application })
    // 2. Send email notification to yourself
    // 3. Send Discord webhook to a private channel
    // 4. Send confirmation email to applicant

    console.log("📋 New mentorship application:", JSON.stringify(application, null, 2));

    // TODO: Uncomment when you have a Discord webhook URL
    // await fetch(process.env.DISCORD_WEBHOOK_URL!, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     embeds: [{
    //       title: "🎓 New Mentorship Application",
    //       color: 0xD4AF37,
    //       fields: [
    //         { name: "Name", value: name, inline: true },
    //         { name: "Email", value: email, inline: true },
    //         { name: "Discord", value: discord || "Not provided", inline: true },
    //         { name: "Plan", value: plan, inline: true },
    //         { name: "Experience", value: experience, inline: true },
    //         { name: "Market", value: market || "Not specified", inline: true },
    //         { name: "Goal", value: goal || "Not specified", inline: false },
    //         { name: "Message", value: message || "None", inline: false },
    //       ],
    //       timestamp: new Date().toISOString(),
    //     }],
    //   }),
    // });

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
  // In production, this would fetch from the database
  // and be protected by authentication
  return NextResponse.json(
    { message: "Applications endpoint. Add auth to access." },
    { status: 200 }
  );
}
