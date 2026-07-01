import { NextResponse } from "next/server";
import { updateApplicationStatus, deleteApplication } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!status || !["pending", "contacted", "accepted", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const result = await updateApplicationStatus(id, status);
    if (!result) {
      return NextResponse.json({ error: "Not found or DB error" }, { status: 404 });
    }
    return NextResponse.json({ application: result }, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const success = await deleteApplication(id);
    if (!success) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
