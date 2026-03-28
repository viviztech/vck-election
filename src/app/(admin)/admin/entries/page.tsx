import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { EntriesClient } from "@/components/entries/EntriesClient";

export default async function AdminEntriesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "USER") redirect("/dashboard");

  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1");
  const search = sp.search ?? "";
  const districtId = sp.district ?? "";
  const constituencyId = sp.constituency ?? "";
  const status = sp.status ?? "";
  const verified = sp.verified ?? "";

  const where: Record<string, unknown> = {};
  if (districtId) where.districtId = districtId;
  if (constituencyId) where.constituencyId = constituencyId;
  if (status) where.ocrStatus = status;
  if (verified !== "") where.isVerified = verified === "true";
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { serialNumber: { contains: search } },
      { contactNumber: { contains: search } },
    ];
  }

  const limit = 20;
  const [total, entries, districts] = await Promise.all([
    prisma.formEntry.count({ where }),
    prisma.formEntry.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        district: { select: { id: true, nameEnglish: true, nameTamil: true } },
        constituency: { select: { id: true, nameEnglish: true, nameTamil: true } },
        submittedBy: { select: { name: true, email: true } },
      },
    }),
    prisma.district.findMany({ orderBy: { nameEnglish: "asc" } }),
  ]);

  const serializedEntries = entries.map((e) => ({
    ...e,
    entryDate: e.entryDate?.toISOString() ?? null,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
    ocrProcessedAt: e.ocrProcessedAt?.toISOString() ?? null,
    verifiedAt: e.verifiedAt?.toISOString() ?? null,
    lastEditedAt: e.lastEditedAt?.toISOString() ?? null,
    ocrRawResponse: null,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="All Entries (Admin)" />
      <div className="flex-1 p-6">
        <EntriesClient
          entries={serializedEntries}
          districts={districts}
          total={total}
          page={page}
          limit={limit}
          filters={{ search, districtId, constituencyId, status, verified }}
          isAdmin={true}
          isSuperAdmin={session.user.role === "SUPER_ADMIN"}
        />
      </div>
    </div>
  );
}
