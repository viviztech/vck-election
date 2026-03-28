import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ConfirmUploadSchema } from "@/lib/validations/upload.schema";
import { z } from "zod";

function hasAwsCredentials() {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_S3_BUCKET_NAME
  );
}

function getImageUrl(imageKey: string): string {
  if (hasAwsCredentials()) {
    const bucket = process.env.AWS_S3_BUCKET_NAME!;
    const region = process.env.AWS_REGION ?? "ap-south-1";
    return `https://${bucket}.s3.${region}.amazonaws.com/${imageKey}`;
  }
  // Local storage: served from public/uploads/
  return `/uploads/${imageKey}`;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { imageKey, mimeType, sizeBytes } = ConfirmUploadSchema.parse(body);

    const imageUrl = getImageUrl(imageKey);

    const entry = await prisma.formEntry.create({
      data: {
        imageKey,
        imageUrl,
        imageMimeType: mimeType,
        imageSizeBytes: sizeBytes,
        submittedById: session.user.id,
        ocrStatus: "PENDING",
      },
    });

    await prisma.auditLog.create({
      data: {
        entryId: entry.id,
        userId: session.user.id,
        action: "CREATED",
      },
    });

    return NextResponse.json({ entryId: entry.id }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Failed to confirm upload" }, { status: 500 });
  }
}
