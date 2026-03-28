import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateImageKey } from "@/lib/s3";
import { PresignedUrlSchema } from "@/lib/validations/upload.schema";
import { z } from "zod";

function hasAwsCredentials() {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_S3_BUCKET_NAME
  );
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { filename, mimeType, sizeBytes } = PresignedUrlSchema.parse(body);

    const imageKey = generateImageKey(session.user.id, filename);

    if (!hasAwsCredentials()) {
      // Local storage mode — client will POST directly to /api/upload/local
      return NextResponse.json({ imageKey, sizeBytes, useLocal: true });
    }

    const { getPresignedUploadUrl } = await import("@/lib/s3");
    const uploadUrl = await getPresignedUploadUrl(imageKey, mimeType);

    return NextResponse.json({ uploadUrl, imageKey, sizeBytes, useLocal: false });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
