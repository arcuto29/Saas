import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const settings = await req.json();

    // Send Discord notification when risk settings are locked in
    if (process.env.DISCORD_WEBHOOK_URL) {
      await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [{
            title: "🔒 Risk Settings Locked for Session",
            color: 0xD4AF37,
            fields: [
              { name: "Risk %", value: `${settings.riskPercent}%`, inline: true },
              { name: "Risk $", value: `$${settings.riskDollars}`, inline: true },
              { name: "Min R:R", value: settings.rr, inline: true },
              { name: "PDLL", value: `$${settings.pdll}`, inline: true },
              { name: "PDLL Action", value: settings.pdllAction, inline: true },
              { name: "Max Trades", value: String(settings.maxTrades), inline: true },
              { name: "Max Contracts", value: String(settings.maxContracts), inline: true },
              { name: "Session", value: settings.sessionWindow, inline: true },
              { name: "Blocked", value: settings.blockedSymbols || "None", inline: true },
            ],
            footer: { text: "PrismaFx Risk Management | Discipline = Funded" },
            timestamp: new Date().toISOString(),
          }],
        }),
      });
    }

    return NextResponse.json({ message: "Notification sent" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
