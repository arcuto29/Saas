import { NextResponse } from "next/server";
import Papa from "papaparse";

// Column mapping patterns for each platform
const PLATFORM_MAPPINGS: Record<string, PlatformMapping> = {
  topstep: {
    date: ["date", "tradedate", "trade date", "time", "datetime", "close time", "exit time"],
    instrument: ["symbol", "instrument", "contract", "product"],
    direction: ["side", "direction", "type", "action", "buy/sell", "b/s"],
    quantity: ["qty", "quantity", "contracts", "lots", "size", "filled qty"],
    entryPrice: ["entry", "entry price", "entryprice", "avg entry", "open price", "fill price"],
    exitPrice: ["exit", "exit price", "exitprice", "avg exit", "close price"],
    pnl: ["p&l", "pnl", "profit", "realized p&l", "realized pnl", "net p&l", "net pnl", "profit/loss", "realizedpnl", "gross p&l"],
    commission: ["commission", "comm", "fees", "fee", "commissions"],
  },
  apex: {
    date: ["tradedate", "date", "trade date", "close time", "exit time", "datetime"],
    instrument: ["instrument", "symbol", "contract", "product"],
    direction: ["action", "side", "direction", "type", "buy/sell"],
    quantity: ["quantity", "qty", "contracts", "lots", "size"],
    entryPrice: ["price", "entry price", "avg price", "fill price", "entry"],
    exitPrice: ["exit price", "close price", "exit"],
    pnl: ["realized p&l", "realized pnl", "p&l", "pnl", "profit", "net p&l"],
    commission: ["commission", "fees", "comm"],
  },
  myfundedfutures: {
    date: ["date", "trade date", "tradedate", "time", "datetime"],
    instrument: ["symbol", "instrument", "contract"],
    direction: ["side", "action", "direction", "type"],
    quantity: ["qty", "quantity", "contracts", "size"],
    entryPrice: ["entry", "entry price", "open price", "avg entry"],
    exitPrice: ["exit", "exit price", "close price", "avg exit"],
    pnl: ["pnl", "p&l", "profit", "realized pnl", "net pnl"],
    commission: ["commission", "fees"],
  },
  bulenox: {
    date: ["date", "trade date", "time", "datetime"],
    instrument: ["symbol", "instrument", "contract"],
    direction: ["side", "action", "direction", "type"],
    quantity: ["qty", "quantity", "contracts"],
    entryPrice: ["entry", "entry price", "open price"],
    exitPrice: ["exit", "exit price", "close price"],
    pnl: ["pnl", "p&l", "profit", "realized pnl"],
    commission: ["commission", "fees"],
  },
  rithmic: {
    date: ["completiontime", "completion time", "date", "time", "datetime", "update time"],
    instrument: ["symbol", "ticker", "instrument", "contract"],
    direction: ["buysell", "buy/sell", "side", "action", "type"],
    quantity: ["qty", "quantity", "fillqty", "fill qty", "contracts"],
    entryPrice: ["avgprice", "avg price", "price", "fill price", "entry"],
    exitPrice: ["exit price", "close price", "exit"],
    pnl: ["realizedpnl", "realized pnl", "pnl", "p&l", "profit"],
    commission: ["commission", "fees", "comm"],
  },
  tradovate: {
    date: ["filledtime", "filled time", "date", "time", "datetime", "timestamp"],
    instrument: ["contractid", "contract", "symbol", "instrument"],
    direction: ["action", "side", "direction", "type", "buysell"],
    quantity: ["qty", "quantity", "filledqty", "contracts"],
    entryPrice: ["price", "avgprice", "avg price", "fill price", "entry"],
    exitPrice: ["exit price", "close price", "exit"],
    pnl: ["realizedpnl", "realized pnl", "pnl", "p&l", "profit", "pl"],
    commission: ["commission", "fees", "totalfees"],
  },
  ninjatrader: {
    date: ["entry time", "exit time", "date", "time", "datetime"],
    instrument: ["instrument", "symbol", "contract"],
    direction: ["market pos.", "market pos", "position", "side", "type", "direction"],
    quantity: ["qty", "quantity", "contracts"],
    entryPrice: ["entry price", "entry", "avg entry"],
    exitPrice: ["exit price", "exit", "avg exit"],
    pnl: ["profit", "pnl", "p&l", "cum. net profit", "net profit"],
    commission: ["commission", "comm", "fees"],
  },
  tradestation: {
    date: ["date", "time", "datetime", "filled time"],
    instrument: ["symbol", "instrument", "contract"],
    direction: ["type", "side", "action", "buy/sell"],
    quantity: ["qty", "quantity", "filled", "contracts"],
    entryPrice: ["price", "avg price", "fill price", "entry"],
    exitPrice: ["exit price", "close price", "exit"],
    pnl: ["p&l", "pnl", "profit", "realized p&l", "net profit"],
    commission: ["commission", "fees"],
  },
  quantower: {
    date: ["date", "time", "close time", "datetime"],
    instrument: ["symbol", "instrument", "contract"],
    direction: ["side", "direction", "type", "action"],
    quantity: ["qty", "quantity", "lots", "contracts"],
    entryPrice: ["open price", "entry", "entry price", "avg open"],
    exitPrice: ["close price", "exit", "exit price", "avg close"],
    pnl: ["net pnl", "pnl", "p&l", "profit", "result"],
    commission: ["commission", "fees", "swap"],
  },
  tradingview: {
    date: ["date", "close date", "time", "datetime"],
    instrument: ["symbol", "instrument", "ticker"],
    direction: ["side", "type", "direction", "action"],
    quantity: ["qty", "quantity", "contracts", "size"],
    entryPrice: ["entry price", "price", "entry", "avg entry"],
    exitPrice: ["close price", "exit price", "exit"],
    pnl: ["profit", "pnl", "p&l", "net profit"],
    commission: ["commission", "fee", "fees"],
  },
  generic: {
    date: ["date", "time", "datetime", "trade date", "tradedate", "entry time", "exit time", "close time", "timestamp"],
    instrument: ["symbol", "instrument", "contract", "ticker", "product", "contractid"],
    direction: ["side", "direction", "type", "action", "buy/sell", "b/s", "buysell", "market pos.", "position"],
    quantity: ["qty", "quantity", "contracts", "lots", "size", "filled", "filled qty", "fillqty"],
    entryPrice: ["entry", "entry price", "entryprice", "open price", "avg entry", "price", "avg price", "fill price", "avgprice"],
    exitPrice: ["exit", "exit price", "exitprice", "close price", "avg exit", "avg close"],
    pnl: ["pnl", "p&l", "profit", "realized pnl", "realized p&l", "net pnl", "net p&l", "profit/loss", "realizedpnl", "pl", "result", "net profit", "gross p&l"],
    commission: ["commission", "comm", "fees", "fee", "commissions", "totalfees", "swap"],
  },
};

interface PlatformMapping {
  date: string[];
  instrument: string[];
  direction: string[];
  quantity: string[];
  entryPrice: string[];
  exitPrice: string[];
  pnl: string[];
  commission: string[];
}

interface ParsedTrade {
  date: string;
  instrument: string;
  direction: "long" | "short";
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  commission: number;
}

function findColumn(headers: string[], candidates: string[]): number {
  const normalizedHeaders = headers.map((h) => h.toLowerCase().trim());
  for (const candidate of candidates) {
    const idx = normalizedHeaders.indexOf(candidate.toLowerCase());
    if (idx !== -1) return idx;
  }
  // Partial match
  for (const candidate of candidates) {
    const idx = normalizedHeaders.findIndex((h) => h.includes(candidate.toLowerCase()));
    if (idx !== -1) return idx;
  }
  return -1;
}

function parseDirection(value: string): "long" | "short" {
  const v = value.toLowerCase().trim();
  if (["buy", "long", "b", "bot", "bought"].includes(v)) return "long";
  if (["sell", "short", "s", "sld", "sold"].includes(v)) return "short";
  if (v.includes("buy") || v.includes("long")) return "long";
  if (v.includes("sell") || v.includes("short")) return "short";
  return "long"; // default
}

function parseNumber(value: string): number {
  if (!value) return 0;
  // Remove currency symbols, commas, spaces
  const cleaned = value.replace(/[$,\s()]/g, "").trim();
  // Handle negative in parentheses like (500)
  if (value.includes("(") && value.includes(")")) {
    return -Math.abs(parseFloat(cleaned) || 0);
  }
  return parseFloat(cleaned) || 0;
}

function parseDate(value: string): string {
  if (!value) return new Date().toISOString().split("T")[0];
  try {
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split("T")[0];
    }
  } catch {}
  return value.split(" ")[0] || value;
}

function detectSession(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const hour = d.getUTCHours();
    if (hour >= 0 && hour < 8) return "asia";
    if (hour >= 8 && hour < 13) return "london";
    if (hour >= 13 && hour < 17) return "new_york";
    return "overlap";
  } catch {
    return "new_york";
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const platform = formData.get("platform") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!platform || !PLATFORM_MAPPINGS[platform]) {
      return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
    }

    const text = await file.text();
    const mapping = PLATFORM_MAPPINGS[platform];

    // Parse CSV
    const parsed = Papa.parse(text, {
      header: false,
      skipEmptyLines: true,
      dynamicTyping: false,
    });

    if (!parsed.data || parsed.data.length < 2) {
      return NextResponse.json({ error: "File is empty or has no data rows" }, { status: 400 });
    }

    const rows = parsed.data as string[][];
    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Find column indices
    const dateIdx = findColumn(headers, mapping.date);
    const instrumentIdx = findColumn(headers, mapping.instrument);
    const directionIdx = findColumn(headers, mapping.direction);
    const quantityIdx = findColumn(headers, mapping.quantity);
    const entryPriceIdx = findColumn(headers, mapping.entryPrice);
    const exitPriceIdx = findColumn(headers, mapping.exitPrice);
    const pnlIdx = findColumn(headers, mapping.pnl);
    const commissionIdx = findColumn(headers, mapping.commission);

    // Validate we found at least the critical columns
    if (pnlIdx === -1 && entryPriceIdx === -1) {
      return NextResponse.json(
        {
          error: `Could not detect trade columns. Found headers: ${headers.join(", ")}. Need at least P&L or Entry/Exit prices.`,
        },
        { status: 400 }
      );
    }

    const trades: ParsedTrade[] = [];
    const errors: string[] = [];
    let skipped = 0;

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      if (!row || row.length < 3) {
        skipped++;
        continue;
      }

      try {
        const pnl = pnlIdx !== -1 ? parseNumber(row[pnlIdx]) : 0;
        const quantity = quantityIdx !== -1 ? Math.abs(parseNumber(row[quantityIdx])) : 1;
        const entryPrice = entryPriceIdx !== -1 ? parseNumber(row[entryPriceIdx]) : 0;
        const exitPrice = exitPriceIdx !== -1 ? parseNumber(row[exitPriceIdx]) : 0;

        // Skip rows with no meaningful data
        if (pnl === 0 && entryPrice === 0 && exitPrice === 0) {
          skipped++;
          continue;
        }

        // Determine direction
        let direction: "long" | "short" = "long";
        if (directionIdx !== -1) {
          direction = parseDirection(row[directionIdx]);
        } else if (pnl !== 0 && entryPrice > 0 && exitPrice > 0) {
          direction = exitPrice > entryPrice ? "long" : "short";
        }

        const trade: ParsedTrade = {
          date: dateIdx !== -1 ? parseDate(row[dateIdx]) : new Date().toISOString().split("T")[0],
          instrument: instrumentIdx !== -1 ? row[instrumentIdx]?.trim() || "NQ" : "NQ",
          direction,
          quantity: quantity || 1,
          entryPrice,
          exitPrice,
          pnl,
          commission: commissionIdx !== -1 ? Math.abs(parseNumber(row[commissionIdx])) : 0,
        };

        trades.push(trade);
      } catch (e) {
        errors.push(`Row ${i + 2}: Failed to parse — ${(e as Error).message}`);
        skipped++;
      }
    }

    // Sort by date (newest first)
    trades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      total: dataRows.length,
      imported: trades.length,
      skipped,
      errors: errors.slice(0, 10), // Max 10 errors shown
      trades,
      columns: {
        detected: {
          date: dateIdx !== -1 ? headers[dateIdx] : null,
          instrument: instrumentIdx !== -1 ? headers[instrumentIdx] : null,
          direction: directionIdx !== -1 ? headers[directionIdx] : null,
          quantity: quantityIdx !== -1 ? headers[quantityIdx] : null,
          entryPrice: entryPriceIdx !== -1 ? headers[entryPriceIdx] : null,
          exitPrice: exitPriceIdx !== -1 ? headers[exitPriceIdx] : null,
          pnl: pnlIdx !== -1 ? headers[pnlIdx] : null,
          commission: commissionIdx !== -1 ? headers[commissionIdx] : null,
        },
        headers,
      },
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 });
  }
}
