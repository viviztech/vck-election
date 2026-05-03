import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(role: string) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get("year") ?? "2026");

  const results = await prisma.electionResult.findMany({
    where: { year },
    include: {
      constituency: {
        select: {
          id: true,
          nameEnglish: true,
          nameTamil: true,
          district: { select: { nameEnglish: true, nameTamil: true } },
        },
      },
      updatedBy: { select: { name: true, email: true } },
    },
    orderBy: [{ isWon: "desc" }, { winMargin: "desc" }],
  });

  const serialized = results.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  return NextResponse.json(serialized);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const {
    year,
    electionType,
    constituencyId,
    candidateName,
    candidatePhoto,
    partySymbol,
    vckVotes,
    totalVotes,
    winMargin,
    isWon,
    status,
    rank1CandidateName,
    rank1Votes,
  } = body;

  if (!constituencyId || !candidateName) {
    return NextResponse.json({ error: "constituencyId and candidateName are required" }, { status: 400 });
  }

  const result = await prisma.electionResult.create({
    data: {
      year: year ?? 2026,
      electionType: electionType ?? "STATE",
      constituencyId,
      candidateName,
      candidatePhoto,
      partySymbol,
      vckVotes,
      totalVotes,
      winMargin,
      isWon: isWon ?? false,
      status: status ?? "COUNTING",
      rank1CandidateName,
      rank1Votes,
      updatedById: session.user.id,
    },
  });

  return NextResponse.json(result, { status: 201 });
}
