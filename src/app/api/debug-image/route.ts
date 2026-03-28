import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const entry = await prisma.formEntry.findFirst({
      select: { imageKey: true, imageUrl: true },
      orderBy: { createdAt: "desc" },
    });

    if (!entry) return NextResponse.json({ error: "no entries" });

    const { getPresignedReadUrl } = await import("@/lib/s3");
    const signedUrl = await getPresignedReadUrl(entry.imageKey);

    return NextResponse.json({
      imageKey: entry.imageKey,
      storedImageUrl: entry.imageUrl,
      presignedUrl: signedUrl.substring(0, 100) + "...",
      s3Env: {
        S3_REGION: process.env.S3_REGION,
        S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID?.substring(0, 8) + "...",
        S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
