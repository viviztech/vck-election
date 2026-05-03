import { prisma } from "@/lib/prisma";
import { ElectionResultsClient } from "./ElectionResultsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "தேர்தல் முடிவுகள் 2026 | விடுதலைச் சிறுத்தைகள் கட்சி",
  description: "VCK wins 8 constituencies in Tamil Nadu 2026 State Assembly Elections",
};

export const dynamic = "force-dynamic";

const VCK_CONSTITUENCY_IDS = [
  "cmnfj5ok800773cuu68x3tgmf",
  "cmnfj5ok800763cuuvd2bcbqe",
  "cmnfj5ok7004n3cuubxt8csnt",
  "cmnfj5ok7004i3cuuhf1j45ls",
  "cmnfj5ok7006w3cuusv551syn",
  "cmnfj5ok7005o3cuuubqrhl2o",
  "cmnfj5ok6002m3cuu8wwt9lb8",
  "cmnfj5ok8007d3cuundsrgq4j",
];

export default async function ElectionResultsPage() {
  const results = await prisma.electionResult.findMany({
    where: {
      year: 2026,
      electionType: "STATE",
      constituencyId: { in: VCK_CONSTITUENCY_IDS },
    },
    include: {
      constituency: {
        select: {
          id: true,
          nameEnglish: true,
          nameTamil: true,
          district: { select: { nameEnglish: true, nameTamil: true } },
        },
      },
      comments: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, authorName: true, body: true, createdAt: true },
      },
      _count: { select: { comments: { where: { isApproved: true } } } },
    },
    orderBy: [{ isWon: "desc" }, { winMargin: "desc" }],
  });

  const serialized = results.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    comments: r.comments.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() })),
  }));

  const hasLive = serialized.some((r) => r.status === "COUNTING" || r.status === "LEADING");

  return (
    <>
      <div className="h-14" aria-hidden="true" />
      <ElectionResultsClient initialResults={serialized} hasLiveResults={hasLive} />
    </>
  );
}
