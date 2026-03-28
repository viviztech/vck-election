import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { ExportClient } from "@/components/shared/ExportClient";

export default async function ExportPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user.role !== "USER";

  const [districts, totalEntries] = await Promise.all([
    prisma.district.findMany({ orderBy: { nameEnglish: "asc" } }),
    isAdmin
      ? prisma.formEntry.count()
      : prisma.formEntry.count({ where: { submittedById: session?.user.id ?? "" } }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Export Data" />
      <div className="flex-1 p-6 max-w-2xl mx-auto w-full">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Export Form Entries</h2>
          <p className="text-gray-500 text-sm mt-1">
            Download entries as Excel (.xlsx) with Tamil Unicode support.
            Total available: <strong>{totalEntries}</strong> entries.
          </p>
        </div>
        <ExportClient districts={districts} />
      </div>
    </div>
  );
}
