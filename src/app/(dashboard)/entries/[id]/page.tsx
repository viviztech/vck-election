import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPresignedReadUrl } from "@/lib/s3";
import { SplitReviewPage } from "@/components/entries/SplitReviewPage";

const LOCK_TTL_MS = 10 * 60 * 1000; // 10 minutes

function isLockExpired(reviewingAt: Date | null) {
  if (!reviewingAt) return true;
  return Date.now() - reviewingAt.getTime() > LOCK_TTL_MS;
}

export default async function EntryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const { id } = await params;
  const userId = session.user.id;

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

  // If entry is unverified and locked by someone else (lock not expired), skip to next
  if (
    !entry.isVerified &&
    entry.reviewingById &&
    entry.reviewingById !== userId &&
    !isLockExpired(entry.reviewingAt)
  ) {
    // Find next unlocked unverified entry after this one
    const nextUnlocked = await prisma.formEntry.findFirst({
      where: {
        createdAt: { gt: entry.createdAt },
        isVerified: false,
        OR: [
          { reviewingById: null },
          { reviewingById: userId },
          { reviewingAt: { lt: new Date(Date.now() - LOCK_TTL_MS) } },
        ],
      },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });

    if (nextUnlocked) {
      redirect(`/entries/${nextUnlocked.id}`);
    } else {
      redirect("/entries");
    }
  }

  // Fetch prev/next entry IDs ordered by createdAt, and row number
  const [prevEntry, nextEntry, rowNumber] = await Promise.all([
    prisma.formEntry.findFirst({
      where: { createdAt: { lt: entry.createdAt } },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    }),
    prisma.formEntry.findFirst({
      where: { createdAt: { gt: entry.createdAt } },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    }),
    prisma.formEntry.count({ where: { createdAt: { lte: entry.createdAt } } }),
  ]);

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
    reviewingAt: entry.reviewingAt?.toISOString() ?? null,
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
      prevId={prevEntry?.id ?? null}
      nextId={nextEntry?.id ?? null}
      rowNumber={rowNumber}
    />
  );
}
