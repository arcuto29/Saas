import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!status || !["pending", "contacted", "accepted", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be: pending, contacted, accepted, or rejected" },
        { status: 400 }
      );
    }

    try {
      const { db } = await import("@/lib/prisma");
      const client = await db();
      if (!client) throw new Error("No DB");
      const application = await client.application.update({
        where: { id },
        data: { status },
      });
      return NextResponse.json({ application }, { status: 200 });
    } catch {
      return NextResponse.json(
        { error: "Application not found or database error" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Update application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    try {
      const { db } = await import("@/lib/prisma");
      const client = await db();
      if (!client) throw new Error("No DB");
      await client.application.delete({ where: { id } });
      return NextResponse.json({ message: "Application deleted" }, { status: 200 });
    } catch {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Delete application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
