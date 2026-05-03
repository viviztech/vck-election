import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { ElectionResultsAdmin } from "./ElectionResultsAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Election Results | Admin" };

export default async function ElectionResultsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "USER") redirect("/dashboard");

  const [results, constituencies] = await Promise.all([
    prisma.electionResult.findMany({
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
        updatedBy: { select: { name: true, email: true } },
      },
      orderBy: [{ isWon: "desc" }, { winMargin: "desc" }],
    }),
    prisma.constituency.findMany({
      select: {
        id: true,
        nameEnglish: true,
        nameTamil: true,
        district: { select: { nameEnglish: true } },
      },
      orderBy: [{ district: { nameEnglish: "asc" } }, { nameEnglish: "asc" }],
    }),
  ]);

  const serialized = results.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Election Results 2026" />
      <div className="flex-1 p-6">
        <ElectionResultsAdmin
          results={serialized}
          constituencies={constituencies}
          isSuperAdmin={session.user.role === "SUPER_ADMIN"}
        />
      </div>
    </div>
  );
}
