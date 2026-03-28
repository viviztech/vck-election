import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const entry = await prisma.formEntry.findUnique({ where: { id } });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Reset OCR status so trigger can re-run
  await prisma.formEntry.update({
    where: { id },
    data: { ocrStatus: "PENDING", ocrJobId: null, ocrErrorMessage: null },
  });

  // Call the OCR trigger endpoint internally
  const triggerRes = await fetch(
    new URL("/api/ocr/trigger", process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: _req.headers.get("cookie") ?? "",
      },
      body: JSON.stringify({ entryId: id }),
    }
  );

  const data = await triggerRes.json();
  return NextResponse.json(data, { status: triggerRes.status });
}
