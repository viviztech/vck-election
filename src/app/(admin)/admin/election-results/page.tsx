import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { ElectionResultsAdmin } from "./ElectionResultsAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Election Results 2026 | Admin" };

// The 8 VCK-won constituencies — fixed list, no other constituencies shown
const VCK_CONSTITUENCY_IDS = [
  "cmnfj5ok800773cuu68x3tgmf", // Cheyyur
  "cmnfj5ok800763cuuvd2bcbqe", // Thiruporur
  "cmnfj5ok7004n3cuubxt8csnt", // Kattumannarkoil
  "cmnfj5ok7004i3cuuhf1j45ls", // Panruti
  "cmnfj5ok7006w3cuusv551syn", // Kallakurichi
  "cmnfj5ok7005o3cuuubqrhl2o", // Periyakulam
  "cmnfj5ok6002m3cuu8wwt9lb8", // Tindivanam
  "cmnfj5ok8007d3cuundsrgq4j", // Arakkonam
];

export default async function ElectionResultsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "USER") redirect("/dashboard");

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
