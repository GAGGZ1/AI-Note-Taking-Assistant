import { db } from '@/lib/db';
import { generateImagePrompt, generateImage } from '@/lib/openai';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";
import { $notes } from '@/lib/db/schema'; // ✅ Corrected import

export const runtime = "nodejs"; 

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse('unauthorised', { status: 401 });
  }

  const body = await req.json();
  const { name } = body;

  const image_description = await generateImagePrompt(name);
  if (!image_description) {
    return new NextResponse("failed to generate image description", {
      status: 500
    });
  }

  const image_url = await generateImage(image_description);
  if (!image_url) {
    return new NextResponse("failed to generate image", {
      status: 500
    });
  }

  const note_ids = await db.insert($notes).values({
    name,
    userId,
    imageUrl: image_url,
  }).returning();

  return NextResponse.json({
    note_id: note_ids[0].id
  });
}
