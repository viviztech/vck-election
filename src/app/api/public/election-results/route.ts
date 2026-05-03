import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get("year") ?? "2026");

  const results = await prisma.electionResult.findMany({
    where: { year, electionType: "STATE" },
    include: {
      constituency: {
        select: {
          id: true,
          nameEnglish: true,
          nameTamil: true,
          district: { select: { nameEnglish: true, nameTamil: true } },
        },
      },
    },
    orderBy: [{ isWon: "desc" }, { winMargin: "desc" }],
  });

  const serialized = results.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  return NextResponse.json(serialized, {
    headers: { "Cache-Control": "no-store" },
  });
}
