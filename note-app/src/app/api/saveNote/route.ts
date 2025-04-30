// app/api/saveNote/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // adjust path
import { $notes } from "@/lib/db/schema"; // adjust schema/table name
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { noteId, editorState } = body;

  try {
    await db.update($notes).set({ editorState }).where(eq($notes.id, noteId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving note:", error);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}
