import { prisma } from "@/lib/prisma";
import { ElectionResultsClient } from "./ElectionResultsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "தேர்தல் முடிவுகள் 2026 | விடுதலைச் சிறுத்தைகள் கட்சி",
};

export const dynamic = "force-dynamic";

export default async function ElectionResultsPage() {
  const results = await prisma.electionResult.findMany({
    where: { year: 2026, electionType: "STATE" },
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

  const wonCount = serialized.filter((r) => r.isWon).length;
  const hasLiveResults = serialized.some((r) => r.status === "COUNTING" || r.status === "LEADING");

  return (
    <>
      <div className="h-14" aria-hidden="true" />
      <ElectionResultsClient
        initialResults={serialized}
        wonCount={wonCount}
        hasLiveResults={hasLiveResults}
      />
    </>
  );
}
