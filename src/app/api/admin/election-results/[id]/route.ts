import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(role: string) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  const allowed = [
    "candidateName",
    "candidatePhoto",
    "partySymbol",
    "vckVotes",
    "totalVotes",
    "winMargin",
    "isWon",
    "status",
    "rank1CandidateName",
    "rank1Votes",
    "opponentParty",
    "opponentPhoto",
    "rank2CandidateName",
    "rank2Votes",
    "rank2Party",
    "rank2Photo",
  ];

  const data: Record<string, unknown> = { updatedById: session.user.id };
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  const result = await prisma.electionResult.update({
    where: { id },
    data,
    include: {
      constituency: {
        select: {
          nameEnglish: true,
          nameTamil: true,
          district: { select: { nameEnglish: true } },
        },
      },
      updatedBy: { select: { name: true } },
    },
  });

  return NextResponse.json({
    ...result,
    createdAt: result.createdAt.toISOString(),
    updatedAt: result.updatedAt.toISOString(),
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.electionResult.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
