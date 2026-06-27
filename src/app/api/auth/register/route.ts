import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Create default trading account
    await prisma.tradingAccount.create({
      data: {
        userId: user.id,
        name: "Main Account",
        type: "live",
        balance: 0,
      },
    });

    // Create default checklist items
    await prisma.checklistItem.createMany({
      data: [
        { userId: user.id, title: "Check daily bias", category: "pre-trade", order: 1, isDefault: true },
        { userId: user.id, title: "Mark key levels", category: "pre-trade", order: 2, isDefault: true },
        { userId: user.id, title: "Set risk for the day", category: "pre-trade", order: 3, isDefault: true },
        { userId: user.id, title: "Review economic calendar", category: "pre-trade", order: 4, isDefault: true },
        { userId: user.id, title: "Confirm setup before entry", category: "during-trade", order: 1, isDefault: true },
        { userId: user.id, title: "Set stop loss immediately", category: "during-trade", order: 2, isDefault: true },
        { userId: user.id, title: "Log trade in journal", category: "post-trade", order: 1, isDefault: true },
        { userId: user.id, title: "Review what went right/wrong", category: "post-trade", order: 2, isDefault: true },
      ],
    });

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
