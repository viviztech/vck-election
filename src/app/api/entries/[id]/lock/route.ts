import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const LOCK_TTL_MS = 10 * 60 * 1000; // 10 minutes

function isLockExpired(reviewingAt: Date | null) {
  if (!reviewingAt) return true;
  return Date.now() - reviewingAt.getTime() > LOCK_TTL_MS;
}

// POST — acquire lock
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const userId = session.user.id;

  const entry = await prisma.formEntry.findUnique({
    where: { id },
    select: { id: true, isVerified: true, reviewingById: true, reviewingAt: true },
  });

  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (entry.isVerified) return NextResponse.json({ error: "Already verified" }, { status: 409 });

  // If locked by someone else and not expired
  if (
    entry.reviewingById &&
    entry.reviewingById !== userId &&
    !isLockExpired(entry.reviewingAt)
  ) {
    const locker = await prisma.user.findUnique({
      where: { id: entry.reviewingById },
      select: { name: true, email: true },
    });
    return NextResponse.json(
      { error: "locked", lockedBy: locker?.name ?? locker?.email ?? "another user" },
      { status: 423 }
    );
  }

  // Release any previous lock held by this user (one active entry at a time)
  await prisma.formEntry.updateMany({
    where: { reviewingById: userId, id: { not: id } },
    data: { reviewingById: null, reviewingAt: null },
  });

  // Acquire lock
  await prisma.formEntry.update({
    where: { id },
    data: { reviewingById: userId, reviewingAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}

// PATCH — heartbeat (refresh lock)
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const userId = session.user.id;

  await prisma.formEntry.updateMany({
    where: { id, reviewingById: userId },
    data: { reviewingAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}

// DELETE — release lock
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const userId = session.user.id;

  await prisma.formEntry.updateMany({
    where: { id, reviewingById: userId },
    data: { reviewingById: null, reviewingAt: null },
  });

  return NextResponse.json({ ok: true });
}
