import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const electionResultId = searchParams.get("resultId");
  if (!electionResultId) {
    return NextResponse.json({ error: "resultId is required" }, { status: 400 });
  }

  const comments = await prisma.electionComment.findMany({
    where: { electionResultId, isApproved: true },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      authorName: true,
      body: true,
      createdAt: true,
    },
  });

  return NextResponse.json(
    comments.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() })),
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { electionResultId, authorName, commentBody } = body;

  if (!electionResultId || !authorName?.trim() || !commentBody?.trim()) {
    return NextResponse.json({ error: "resultId, authorName and commentBody are required" }, { status: 400 });
  }

  if (commentBody.trim().length > 500) {
    return NextResponse.json({ error: "Comment too long (max 500 chars)" }, { status: 400 });
  }

  // Verify the result exists
  const result = await prisma.electionResult.findUnique({ where: { id: electionResultId }, select: { id: true } });
  if (!result) return NextResponse.json({ error: "Result not found" }, { status: 404 });

  await prisma.electionComment.create({
    data: {
      electionResultId,
      authorName: authorName.trim().slice(0, 60),
      body: commentBody.trim(),
      isApproved: false, // requires admin approval
    },
  });

  return NextResponse.json({ success: true, message: "Comment submitted for review" }, { status: 201 });
}
