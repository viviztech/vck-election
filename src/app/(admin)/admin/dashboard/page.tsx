import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DistrictChart } from "@/components/dashboard/DistrictChart";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "USER") redirect("/dashboard");

  const [total, verified, pendingOcr, failedOcr, totalUsers, districtGroups] =
    await Promise.all([
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
    ]);

  const districtIds = districtGroups.map((d) => d.districtId).filter(Boolean) as string[];
  const districtNames = await prisma.district.findMany({
    where: { id: { in: districtIds } },
    select: { id: true, nameEnglish: true },
  });
  const nameMap = Object.fromEntries(districtNames.map((d) => [d.id, d.nameEnglish]));

  const chartData = districtGroups.map((d) => ({
    name: d.districtId ? (nameMap[d.districtId] ?? "Unknown") : "No District",
    count: d._count.id,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Admin Dashboard" />
      <div className="flex-1 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900">System Overview</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatsCard title="Total Entries" value={total} icon="📋" color="blue" />
          <StatsCard title="Verified" value={verified} icon="✅" color="green" />
          <StatsCard title="Pending OCR" value={pendingOcr} icon="⏳" color="yellow" />
          <StatsCard title="OCR Failed" value={failedOcr} icon="❌" color="red" />
          <StatsCard title="Total Users" value={totalUsers} icon="👥" color="blue" />
        </div>

        <DistrictChart data={chartData} />
      </div>
    </div>
  );
}
