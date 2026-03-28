import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role === "USER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [
    totalEntries,
    verifiedEntries,
    pendingOcr,
    failedOcr,
    totalUsers,
    byDistrict,
    recentEntries,
  ] = await Promise.all([
    prisma.formEntry.count(),
    prisma.formEntry.count({ where: { isVerified: true } }),
    prisma.formEntry.count({ where: { ocrStatus: { in: ["PENDING", "PROCESSING"] } } }),
    prisma.formEntry.count({ where: { ocrStatus: "FAILED" } }),
    prisma.user.count(),
    prisma.formEntry.groupBy({
      by: ["districtId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    prisma.formEntry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        submittedBy: { select: { name: true } },
        district: { select: { nameEnglish: true } },
      },
    }),
  ]);

  // Enrich byDistrict with names
  const districtIds = byDistrict.map((d) => d.districtId).filter(Boolean) as string[];
  const districts = await prisma.district.findMany({
    where: { id: { in: districtIds } },
    select: { id: true, nameEnglish: true, nameTamil: true },
  });
  const districtMap = Object.fromEntries(districts.map((d) => [d.id, d]));

  const districtStats = byDistrict.map((d) => ({
    districtId: d.districtId,
    count: d._count.id,
    district: d.districtId ? districtMap[d.districtId] : null,
  }));

  return NextResponse.json({
    totalEntries,
    verifiedEntries,
    pendingOcr,
    failedOcr,
    totalUsers,
    districtStats,
    recentEntries,
  });
}
