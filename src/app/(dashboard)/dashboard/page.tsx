import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPresignedReadUrl } from "@/lib/s3";
import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DistrictChart } from "@/components/dashboard/DistrictChart";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user.role !== "USER";

  if (isAdmin) {
    // ── ADMIN DASHBOARD ──────────────────────────────────────────
    const [total, verified, pendingOcr, failedOcr, pendingVerify, districtGroups, recentUploads] =
      await Promise.all([
        prisma.formEntry.count(),
        prisma.formEntry.count({ where: { isVerified: true } }),
        prisma.formEntry.count({ where: { ocrStatus: { in: ["PENDING", "PROCESSING"] } } }),
        prisma.formEntry.count({ where: { ocrStatus: "FAILED" } }),
        prisma.formEntry.count({ where: { isVerified: false, ocrStatus: "COMPLETED" } }),
        prisma.formEntry.groupBy({
          by: ["districtId"],
          _count: { id: true },
          orderBy: { _count: { id: "desc" } },
          take: 8,
        }),
        prisma.formEntry.findMany({
          take: 6,
          orderBy: { createdAt: "desc" },
          include: {
            district: { select: { nameEnglish: true } },
            constituency: { select: { nameEnglish: true } },
          },
        }),
      ]);

    const districtIds = districtGroups.map((d) => d.districtId).filter(Boolean) as string[];
    const districtNames = await prisma.district.findMany({
      where: { id: { in: districtIds } },
      select: { id: true, nameEnglish: true },
    });
    const nameMap = Object.fromEntries(districtNames.map((d) => [d.id, d.nameEnglish]));
    const signedRecentUploads = await Promise.all(
      recentUploads.map(async (e) => ({ ...e, imageUrl: await getPresignedReadUrl(e.imageKey) }))
    );
    const chartData = districtGroups.map((d) => ({
      name: d.districtId ? (nameMap[d.districtId] ?? "Unknown") : "No District",
      count: d._count.id,
    }));

    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Admin Overview" />
        <div className="flex-1 p-6 space-y-6">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Welcome, {session?.user.name}</h2>
              <p className="text-gray-500 text-sm mt-0.5">விடுதலைச் சிறுத்தைகள் கட்சி — 2026 சட்டமன்றத் தேர்தல்</p>
            </div>
            <Link
              href="/upload"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition"
            >
              <span>📤</span> Upload New Form
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatsCard title="Total Forms" value={total} icon="📋" color="blue" />
            <StatsCard title="Verified" value={verified} icon="✅" color="green" />
            <StatsCard title="Awaiting Review" value={pendingVerify} icon="👁️" color="yellow" />
            <StatsCard title="OCR Processing" value={pendingOcr} icon="⏳" color="yellow" />
            <StatsCard title="OCR Failed" value={failedOcr} icon="❌" color="red" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DistrictChart data={chartData} />
            </div>

            {/* Recently uploaded */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Recently Uploaded</h3>
                <Link href="/admin/entries" className="text-xs text-blue-600 hover:underline">View all</Link>
              </div>
              {signedRecentUploads.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-3xl mb-2">📭</p>
                  <p className="text-sm">No forms uploaded yet</p>
                  <Link href="/upload" className="text-blue-600 text-sm hover:underline mt-1 block">Upload first form</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {signedRecentUploads.map((entry) => (
                    <Link
                      key={entry.id}
                      href={`/entries/${entry.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition group"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate tamil-text">
                          {entry.name ?? <span className="text-gray-400 italic">Unnamed</span>}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {entry.district?.nameEnglish ?? "—"} · {new Date(entry.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                      <span className={`shrink-0 ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${
                        entry.isVerified ? "bg-green-100 text-green-700" :
                        entry.ocrStatus === "COMPLETED" ? "bg-yellow-100 text-yellow-700" :
                        entry.ocrStatus === "FAILED" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-500"
                      }`}>
                        {entry.isVerified ? "Verified" :
                         entry.ocrStatus === "COMPLETED" ? "Pending Review" :
                         entry.ocrStatus}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ── USER / REVIEWER DASHBOARD ─────────────────────────────────
  const [totalPending, totalVerifiedByMe, allPendingEntries] = await Promise.all([
    prisma.formEntry.count({ where: { isVerified: false, ocrStatus: "COMPLETED" } }),
    prisma.formEntry.count({ where: { isVerified: true, verifiedById: session?.user.id } }),
    prisma.formEntry.findMany({
      where: { isVerified: false, ocrStatus: "COMPLETED" },
      take: 8,
      orderBy: { createdAt: "asc" }, // oldest first — review in order
      include: {
        district: { select: { nameEnglish: true, nameTamil: true } },
        constituency: { select: { nameEnglish: true, nameTamil: true } },
      },
    }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Review Dashboard" />
      <div className="flex-1 p-6 space-y-6">

        <div>
          <h2 className="text-xl font-bold text-gray-900">Hello, {session?.user.name}</h2>
          <p className="text-gray-500 text-sm mt-0.5">Review extracted form data and verify accuracy</p>
        </div>

        {/* User stats */}
        <div className="grid grid-cols-2 gap-4 max-w-sm">
          <StatsCard title="Pending Review" value={totalPending} icon="📋" color="yellow" />
          <StatsCard title="Verified by Me" value={totalVerifiedByMe} icon="✅" color="green" />
        </div>

        {/* Pending review queue */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Forms Waiting for Review</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Open each form to view the scanned image alongside extracted data and correct any errors
              </p>
            </div>
            <Link href="/entries" className="text-sm text-blue-600 hover:underline">
              See full queue →
            </Link>
          </div>

          {allPendingEntries.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <p className="text-4xl mb-3">🎉</p>
              <p className="font-semibold text-gray-600">All caught up!</p>
              <p className="text-sm mt-1">No forms are pending review right now.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {allPendingEntries.map((entry, idx) => (
                <Link
                  key={entry.id}
                  href={`/entries/${entry.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-blue-50 transition group"
                >
                  {/* Queue number */}
                  <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center text-sm font-bold text-gray-500 group-hover:text-blue-600 shrink-0 transition">
                    {idx + 1}
                  </div>

                  {/* Form thumb */}
                  <div className="w-12 h-14 bg-gray-100 rounded border border-gray-200 overflow-hidden shrink-0">
                    <img
                      src={entry.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 tamil-text truncate">
                      {entry.name ?? <span className="text-gray-400 italic font-normal">Name not extracted</span>}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {entry.district?.nameTamil ?? "—"}
                      {entry.constituency ? ` · ${entry.constituency.nameTamil}` : ""}
                    </p>
                    {entry.serialNumber && (
                      <p className="text-xs font-mono text-gray-400">#{entry.serialNumber}</p>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-xs text-gray-400">
                      {new Date(entry.createdAt).toLocaleDateString("en-IN")}
                    </span>
                    <p className="text-xs text-blue-600 font-semibold group-hover:underline mt-0.5">
                      Review →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
