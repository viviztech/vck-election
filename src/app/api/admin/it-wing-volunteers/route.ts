import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "USER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const search = searchParams.get("search") ?? "";
  const district = searchParams.get("district") ?? "";
  const format = searchParams.get("format") ?? "";
  const PAGE_SIZE = 20;

  const where: Record<string, unknown> = {};
  if (district) where.district = { contains: district, mode: "insensitive" };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { district: { contains: search, mode: "insensitive" } },
      { constituency: { contains: search, mode: "insensitive" } },
    ];
  }

  if (format === "csv") {
    const all = await prisma.itWingVolunteer.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const header = [
      "பெயர்", "வயது", "தொலைபேசி", "கல்வித்தகுதி",
      "மாவட்டம்", "சட்டமன்றத்தொகுதி",
      "IT knowledge", "Video creation", "Image creation",
      "இணைய காரணம்", "பதிவு தேதி",
    ].join(",");

    const rows = all.map((v) =>
      [
        `"${v.name ?? ""}"`,
        v.age ?? "",
        `"${v.phone}"`,
        `"${v.education}"`,
        `"${v.district}"`,
        `"${v.constituency}"`,
        v.itKnowledge ? "ஆம்" : "இல்லை",
        v.videoCreation ? "ஆம்" : "இல்லை",
        v.imageCreation ? "ஆம்" : "இல்லை",
        `"${v.joinReason.replace(/"/g, '""')}"`,
        new Date(v.createdAt).toLocaleDateString("ta-IN"),
      ].join(",")
    );

    const csv = [header, ...rows].join("\n");
    return new NextResponse("﻿" + csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="it-wing-volunteers.csv"`,
      },
    });
  }

  const [total, volunteers] = await Promise.all([
    prisma.itWingVolunteer.count({ where }),
    prisma.itWingVolunteer.findMany({
      where,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    volunteers: volunteers.map((v) => ({
      ...v,
      createdAt: v.createdAt.toISOString(),
    })),
    total,
    page,
    pageSize: PAGE_SIZE,
  });
}
