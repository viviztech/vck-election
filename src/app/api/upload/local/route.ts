import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const imageKey = formData.get("imageKey") as string | null;

    if (!file || !imageKey) {
      return NextResponse.json({ error: "Missing file or imageKey" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // imageKey format: forms/{userId}/{timestamp}-{random}.{ext}
    const relativeDir = path.dirname(imageKey); // forms/{userId}
    const uploadsDir = path.join(process.cwd(), "public", "uploads", relativeDir);
    await mkdir(uploadsDir, { recursive: true });

    const filename = path.basename(imageKey);
    const filePath = path.join(process.cwd(), "public", "uploads", relativeDir, filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Local upload error:", err);
    return NextResponse.json({ error: "Local upload failed" }, { status: 500 });
  }
}
