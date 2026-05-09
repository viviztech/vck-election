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
  const gender = searchParams.get("gender") ?? "";
  const studentWingMember = searchParams.get("studentWingMember") ?? "";
  const hearAboutUs = searchParams.get("hearAboutUs") ?? "";
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";
  const format = searchParams.get("format") ?? "";
  const PAGE_SIZE = 20;

  const where: Record<string, unknown> = {};
  if (district) where.district = { contains: district, mode: "insensitive" };
  if (gender) where.gender = gender;
  if (studentWingMember === "true") where.studentWingMember = true;
  else if (studentWingMember === "false") where.studentWingMember = false;
  if (hearAboutUs) where.hearAboutUs = { contains: hearAboutUs, mode: "insensitive" };
  if (dateFrom || dateTo) {
    where.createdAt = {
      ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
      ...(dateTo ? { lte: new Date(dateTo + "T23:59:59.999Z") } : {}),
    };
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { email: { contains: search, mode: "insensitive" } },
      { schoolName: { contains: search, mode: "insensitive" } },
      { district: { contains: search, mode: "insensitive" } },
      { rollNumber: { contains: search, mode: "insensitive" } },
    ];
  }

  if (format === "csv") {
    const all = await prisma.studentRegistration.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const header = [
      "பெயர்", "தந்தை / பாதுகாவலர் பெயர்",
      "பிறந்த தேதி", "வயது", "பாலினம்",
      "தொலைபேசி", "வாட்ஸ்அப்", "மின்னஞ்சல்",
      "படிக்கும் வகுப்பு / ஆண்டு", "துறை / பிரிவு",
      "பள்ளி / கல்லூரி பெயர்", "சேர்க்கை / பதிவு எண்",
      "10th - மதிப்பெண்", "10th - மொத்தம்", "10th - சதவீதம்",
      "12th - மதிப்பெண்", "12th - மொத்தம்", "12th - சதவீதம்",
      "தற்போதைய - மதிப்பெண்", "தற்போதைய - மொத்தம்", "தற்போதைய - சதவீதம்",
      "கதவு எண் / தெரு", "கிராமம் / பகுதி", "வட்டம்", "மாவட்டம்", "பின்கோடு",
      "மாணவர் அமைப்பு உறுப்பினர்", "அமைப்பின் பெயர்",
      "எப்படி அறிந்தீர்கள்", "கருத்துக்கள்",
      "பதிவு தேதி",
    ].join(",");

    const rows = all.map((s) =>
      [
        `"${s.name}"`,
        `"${s.fatherName ?? ""}"`,
        `"${s.dob ?? ""}"`,
        s.age ?? "",
        s.gender ?? "",
        `"${s.phone}"`,
        `"${s.whatsapp ?? ""}"`,
        `"${s.email ?? ""}"`,
        `"${s.currentClass ?? ""}"`,
        `"${s.department ?? ""}"`,
        `"${s.schoolName}"`,
        `"${s.rollNumber ?? ""}"`,
        `"${s.marks10th ?? ""}"`,
        `"${s.max10th ?? ""}"`,
        `"${s.percent10th ?? ""}"`,
        `"${s.marks12th ?? ""}"`,
        `"${s.max12th ?? ""}"`,
        `"${s.percent12th ?? ""}"`,
        `"${s.marksCurrent ?? ""}"`,
        `"${s.maxCurrent ?? ""}"`,
        `"${s.percentCurrent ?? ""}"`,
        `"${s.doorNo ?? ""}"`,
        `"${s.village ?? ""}"`,
        `"${s.taluk ?? ""}"`,
        `"${s.district}"`,
        `"${s.pincode ?? ""}"`,
        s.studentWingMember === true ? "ஆம்" : s.studentWingMember === false ? "இல்லை" : "",
        `"${s.studentWingName ?? ""}"`,
        `"${s.hearAboutUs ?? ""}"`,
        `"${(s.remarks ?? "").replace(/"/g, '""')}"`,
        new Date(s.createdAt).toLocaleDateString("ta-IN"),
      ].join(",")
    );

    const csv = [header, ...rows].join("\n");
    return new NextResponse("﻿" + csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="student-registrations.csv"`,
      },
    });
  }

  const [total, registrations] = await Promise.all([
    prisma.studentRegistration.count({ where }),
    prisma.studentRegistration.findMany({
      where,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    registrations: registrations.map((s) => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
    })),
    total,
    page,
    pageSize: PAGE_SIZE,
  });
}
