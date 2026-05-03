import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { ElectionResultsAdmin } from "./ElectionResultsAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Election Results 2026 | Admin" };

// 8 VCK-contested seats by name — works across all environments
const VCK_CONSTITUENCY_NAMES = [
  "Cheyyur", "Thiruporur", "Kattumannarkoil", "Panruti",
  "Kallakurichi", "Periyakulam", "Tindivanam", "Arakkonam",
];

export default async function ElectionResultsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "USER") redirect("/dashboard");

  const results = await prisma.electionResult.findMany({
    where: {
      year: 2026,
      electionType: "STATE",
      constituency: { nameEnglish: { in: VCK_CONSTITUENCY_NAMES } },
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
      updatedBy: { select: { name: true, email: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { constituency: { nameEnglish: "asc" } },
  });

  const serialized = results.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Election Results 2026 — VCK Won Seats" />
      <div className="flex-1 p-6">
        <ElectionResultsAdmin
          results={serialized}
          isSuperAdmin={session.user.role === "SUPER_ADMIN"}
        />
      </div>
    </div>
  );
}
