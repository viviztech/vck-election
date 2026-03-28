import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = await params;

  const entry = await prisma.formEntry.findFirst({
    where: { ocrJobId: jobId },
    select: {
      id: true,
      ocrStatus: true,
      ocrProcessedAt: true,
      ocrErrorMessage: true,
      name: true,
      serialNumber: true,
    },
  });

  if (!entry) {
    // Also check by entryId (jobId might be entryId before OCR completes)
    const byId = await prisma.formEntry.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        ocrStatus: true,
        ocrProcessedAt: true,
        ocrErrorMessage: true,
        ocrJobId: true,
      },
    });
    if (!byId) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ status: byId.ocrStatus, entryId: byId.id });
  }

  return NextResponse.json({ status: entry.ocrStatus, entryId: entry.id });
}
