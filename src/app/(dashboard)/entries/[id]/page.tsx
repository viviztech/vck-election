import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPresignedReadUrl } from "@/lib/s3";
import { SplitReviewPage } from "@/components/entries/SplitReviewPage";

export default async function EntryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const { id } = await params;

  const [entry, districts, constituencies] = await Promise.all([
    prisma.formEntry.findUnique({
      where: { id },
      include: {
        district: true,
        constituency: true,
        submittedBy: { select: { name: true, email: true } },
        auditLogs: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { user: { select: { name: true, email: true } } },
        },
      },
    }),
    prisma.district.findMany({ orderBy: { nameEnglish: "asc" } }),
    prisma.constituency.findMany({ orderBy: { nameEnglish: "asc" } }),
  ]);

  if (!entry) return notFound();

  // Users can view all entries (they are reviewers)
  // but can only edit — access based on role handled in editor

  const serializedEntry = {
    ...entry,
    imageUrl: await getPresignedReadUrl(entry.imageKey),
    entryDate: entry.entryDate?.toISOString() ?? null,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
    ocrProcessedAt: entry.ocrProcessedAt?.toISOString() ?? null,
    verifiedAt: entry.verifiedAt?.toISOString() ?? null,
    lastEditedAt: entry.lastEditedAt?.toISOString() ?? null,
    ocrRawResponse: null,
    auditLogs: entry.auditLogs.map((log) => ({
      ...log,
      createdAt: log.createdAt.toISOString(),
    })),
  };

  return (
    <SplitReviewPage
      entry={serializedEntry}
      districts={districts}
      constituencies={constituencies}
      currentUserRole={session.user.role}
    />
  );
}
