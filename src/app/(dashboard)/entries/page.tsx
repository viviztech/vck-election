import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPresignedReadUrl } from "@/lib/s3";
import { Header } from "@/components/layout/Header";
import { EntriesClient } from "@/components/entries/EntriesClient";

export default async function EntriesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const session = await getServerSession(authOptions);
  const sp = await searchParams;

  const page = parseInt(sp.page ?? "1");
  const search = sp.search ?? "";
  const districtId = sp.district ?? "";
  const status = sp.status ?? "";
  // Users default to showing unverified OCR-completed entries (review queue)
  const isAdmin = session?.user.role !== "USER";
  const verified = sp.verified ?? (isAdmin ? "" : "false");

  const where: Record<string, unknown> = {};
  // Users see all forms (they are reviewers for everything)
  if (districtId) where.districtId = districtId;
  if (status) where.ocrStatus = status;
  else if (!isAdmin) where.ocrStatus = "COMPLETED"; // users see OCR-done forms
  if (verified !== "") where.isVerified = verified === "true";
  if (search) {
    where.OR = [
      { id: { contains: search } },
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
      orderBy: isAdmin ? { createdAt: "desc" } : { createdAt: "asc" }, // users see oldest first
      include: {
        district: { select: { id: true, nameEnglish: true, nameTamil: true } },
        constituency: { select: { id: true, nameEnglish: true, nameTamil: true } },
        submittedBy: { select: { name: true, email: true } },
      },
    }),
    prisma.district.findMany({ orderBy: { nameEnglish: "asc" } }),
  ]);

  const serializedEntries = await Promise.all(entries.map(async (e) => ({
    ...e,
    imageUrl: await getPresignedReadUrl(e.imageKey),
    entryDate: e.entryDate?.toISOString() ?? null,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
    ocrProcessedAt: e.ocrProcessedAt?.toISOString() ?? null,
    verifiedAt: e.verifiedAt?.toISOString() ?? null,
    lastEditedAt: e.lastEditedAt?.toISOString() ?? null,
    ocrRawResponse: null,
  })));

  return (
    <div className="flex flex-col min-h-screen">
      <Header title={isAdmin ? "All Entries" : "Review Queue"} />
      <div className="flex-1 p-6">
        <EntriesClient
          entries={serializedEntries}
          districts={districts}
          total={total}
          page={page}
          limit={limit}
          filters={{ search, districtId, constituencyId: "", status, verified }}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}
