import { NextResponse } from "next/server";

/**
 * Daily Journal Prompt System
 * 
 * This endpoint sends a daily journal prompt to Discord.
 * Call it via a cron job (Vercel Cron, or externally via cron-job.org)
 * at market close time (e.g., 4:30 PM EST).
 * 
 * GET /api/journal/daily — sends the daily prompt
 * POST /api/journal/daily — receives a journal response
 */

const JOURNAL_PROMPTS = [
  "How was your trading session today? Rate your discipline 1-10.",
  "Did you follow your trading plan today? What worked and what didn't?",
  "What was your biggest mistake today? What would you do differently?",
  "Did you hit your daily tick target? If not, why?",
  "Rate your emotional state during today's session: calm, anxious, confident, or frustrated?",
  "What setup did you trade today? Was it an A+ setup or did you force it?",
  "If you could redo one trade from today, which one and why?",
  "Did you stop trading after hitting your daily loss limit? Be honest.",
  "What's the #1 lesson from today's session you want to remember tomorrow?",
  "Were you patient today, or did FOMO get the best of you?",
  "How many trades did you take? Was that within your plan?",
  "Did you move your stop loss on any trade today? Why?",
  "What's your bias for tomorrow? Bullish or bearish on NQ?",
  "Did you check the economic calendar before trading? Were there any catalysts?",
  "Score yourself: Preparation (1-10), Execution (1-10), Review (1-10).",
];

function getTodaysPrompt(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return JOURNAL_PROMPTS[dayOfYear % JOURNAL_PROMPTS.length];
}

function getJournalEmbed(prompt: string, forStudents: boolean = false) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    embeds: [
      {
        title: "📓 Daily Trading Journal",
        description: forStudents
          ? "Take 5 minutes to reflect on today's session. Post your answers below."
          : "End of day reflection. Be honest with yourself.",
        color: 0xd4af37,
        fields: [
          {
            name: "📅 Date",
            value: dateStr,
            inline: true,
          },
          {
            name: "💭 Today's Prompt",
            value: prompt,
            inline: false,
          },
          {
            name: "📝 Template",
            value: [
              "**Session:** NY Open / London / Asia",
              "**Trades taken:** ___ ",
              "**P&L:** $___",
              "**Win rate today:** ___%",
              "**Discipline (1-10):** ___",
              "**Followed plan?** Yes / No",
              "**Biggest lesson:** ___",
            ].join("\n"),
            inline: false,
          },
        ],
        footer: {
          text: "PrismaFx | Consistency is built one journal entry at a time",
        },
        timestamp: now.toISOString(),
      },
    ],
  };
}

// GET — Trigger the daily journal prompt (call via cron)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");

    // Simple auth — use a secret param to prevent random triggers
    const expectedSecret = process.env.CRON_SECRET || "prismafx-cron-2024";
    if (secret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prompt = getTodaysPrompt();
    const results: string[] = [];

    // Send to owner's private webhook
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        const res = await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(getJournalEmbed(prompt, false)),
        });
        results.push(res.ok ? "Owner webhook: sent" : "Owner webhook: failed");
      } catch (e) {
        results.push("Owner webhook: error");
      }
    }

    // Send to student/community webhook (if configured)
    if (process.env.DISCORD_JOURNAL_WEBHOOK_URL) {
      try {
        const res = await fetch(process.env.DISCORD_JOURNAL_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(getJournalEmbed(prompt, true)),
        });
        results.push(res.ok ? "Student webhook: sent" : "Student webhook: failed");
      } catch (e) {
        results.push("Student webhook: error");
      }
    }

    return NextResponse.json({
      message: "Daily journal prompt sent",
      prompt,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Journal prompt error:", error);
    return NextResponse.json({ error: "Failed to send prompt" }, { status: 500 });
  }
}

// POST — Save a journal entry response
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { session, trades, pnl, winRate, discipline, followedPlan, lesson, notes } = body;

    // For now, log it. In production with DB:
    // await db.dailyJournal.create({ data: { ... } })
    console.log("📓 Journal entry received:", JSON.stringify(body, null, 2));

    // Send to Discord as a formatted entry (optional)
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [
              {
                title: "✅ Journal Entry Logged",
                color: 0x10b981,
                fields: [
                  { name: "Session", value: session || "Not specified", inline: true },
                  { name: "Trades", value: String(trades || 0), inline: true },
                  { name: "P&L", value: `$${pnl || 0}`, inline: true },
                  { name: "Win Rate", value: `${winRate || 0}%`, inline: true },
                  { name: "Discipline", value: `${discipline || 0}/10`, inline: true },
                  { name: "Followed Plan", value: followedPlan ? "Yes ✅" : "No ❌", inline: true },
                  { name: "Lesson", value: lesson || "None noted", inline: false },
                ],
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        });
      } catch {}
    }

    return NextResponse.json({ message: "Journal entry saved" }, { status: 201 });
  } catch (error) {
    console.error("Journal save error:", error);
    return NextResponse.json({ error: "Failed to save entry" }, { status: 500 });
  }
}
