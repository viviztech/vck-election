import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPresignedReadUrl } from "@/lib/s3";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
  const district = searchParams.get("district");
  const constituency = searchParams.get("constituency");
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const verified = searchParams.get("verified");
  const myEntries = searchParams.get("mine") === "true";

  const where: Record<string, unknown> = {};

  if (session.user.role === "USER" || myEntries) {
    where.submittedById = session.user.id;
  }
  if (district) where.districtId = district;
  if (constituency) where.constituencyId = constituency;
  if (status) where.ocrStatus = status;
  if (verified !== null && verified !== "") where.isVerified = verified === "true";
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { serialNumber: { contains: search } },
      { contactNumber: { contains: search } },
      { feeReceiptNumber: { contains: search } },
    ];
  }

  const [total, entries] = await Promise.all([
    prisma.formEntry.count({ where }),
    prisma.formEntry.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        district: { select: { nameEnglish: true, nameTamil: true } },
        constituency: { select: { nameEnglish: true, nameTamil: true } },
        submittedBy: { select: { name: true, email: true } },
      },
    }),
  ]);

  const entriesWithSignedUrls = await Promise.all(
    entries.map(async (entry) => ({
      ...entry,
      imageUrl: await getPresignedReadUrl(entry.imageKey),
    }))
  );

  return NextResponse.json({
    data: entriesWithSignedUrls,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
