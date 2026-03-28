import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPresignedReadUrl } from "@/lib/s3";
import { UpdateEntrySchema } from "@/lib/validations/entry.schema";
import { z } from "zod";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const entry = await prisma.formEntry.findUnique({
    where: { id },
    include: {
      district: true,
      constituency: true,
      submittedBy: { select: { name: true, email: true, id: true } },
      auditLogs: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { user: { select: { name: true, email: true } } },
      },
    },
  });

  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (entry.submittedById !== session.user.id && session.user.role === "USER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    ...entry,
    imageUrl: await getPresignedReadUrl(entry.imageKey),
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const updates = UpdateEntrySchema.parse(body);

    const existing = await prisma.formEntry.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing.submittedById !== session.user.id && session.user.role === "USER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Build field-level diff for audit log
    const changes: Record<string, { old: unknown; new: unknown }> = {};
    for (const [key, newVal] of Object.entries(updates)) {
      const oldVal = existing[key as keyof typeof existing];
      if (oldVal !== newVal) {
        changes[key] = { old: oldVal, new: newVal };
      }
    }

    const verifiedData =
      updates.isVerified
        ? { verifiedAt: new Date(), verifiedById: session.user.id }
        : {};

    // Parse entryDate string to Date object (Prisma requires DateTime, not string)
    const { entryDate: entryDateStr, ...restUpdates } = updates;
    let entryDate: Date | null | undefined;
    if (entryDateStr === null) {
      entryDate = null;
    } else if (entryDateStr) {
      const d = new Date(entryDateStr);
      entryDate = isNaN(d.getTime()) ? undefined : d;
    }

    const entry = await prisma.formEntry.update({
      where: { id },
      data: {
        ...restUpdates,
        ...(entryDate !== undefined ? { entryDate } : {}),
        ...verifiedData,
        lastEditedAt: new Date(),
      },
      include: {
        district: true,
        constituency: true,
      },
    });

    if (Object.keys(changes).length > 0) {
      await prisma.auditLog.create({
        data: {
          entryId: id,
          userId: session.user.id,
          action: updates.isVerified ? "VERIFIED" : "EDITED",
          changes: changes as object,
        },
      });
    }

    return NextResponse.json(entry);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role === "USER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const entry = await prisma.formEntry.findUnique({ where: { id } });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.formEntry.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
