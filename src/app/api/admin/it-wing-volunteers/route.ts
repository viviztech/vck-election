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
      { email: { contains: search, mode: "insensitive" } },
      { district: { contains: search, mode: "insensitive" } },
      { constituency: { contains: search, mode: "insensitive" } },
      { town: { contains: search, mode: "insensitive" } },
      { occupation: { contains: search, mode: "insensitive" } },
    ];
  }

  if (format === "csv") {
    const all = await prisma.itWingVolunteer.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const header = [
      "பெயர்", "வயது", "பிறந்த தேதி", "பாலினம்",
      "தொலைபேசி", "வாட்ஸ்அப்", "மின்னஞ்சல்", "வாக்காளர் அடையாள எண்",
      "ஊர்", "பின்கோடு", "முகவரி",
      "கல்வித்தகுதி", "தொழில்",
      "மாவட்டம்", "சட்டமன்றத்தொகுதி",
      "IT knowledge", "Video creation", "Image creation",
      "IT திறன்கள்", "மென்பொருள் கருவிகள்", "அனுபவம் (ஆண்டுகள்)", "முதன்மை சாதனம்",
      "Facebook", "YouTube", "Instagram", "Twitter/X", "பின்தொடர்பவர்கள்",
      "கிடைக்கும் நேரம்", "தெரிந்த மொழிகள்", "பயணிக்க முடியுமா?", "VCK உறுப்பினரா?",
      "முன்னர் தன்னார்வ அனுபவம்", "எப்படி அறிந்தீர்கள்",
      "இணைய காரணம்",
      "அவசர தொடர்பு பெயர்", "அவசர தொடர்பு எண்",
      "பதிவு தேதி",
    ].join(",");

    const rows = all.map((v) =>
      [
        `"${v.name ?? ""}"`,
        v.age ?? "",
        `"${v.dob ?? ""}"`,
        v.gender ?? "",
        `"${v.phone}"`,
        `"${v.whatsapp ?? ""}"`,
        `"${v.email ?? ""}"`,
        `"${v.voterId ?? ""}"`,
        `"${v.town ?? ""}"`,
        `"${v.pincode ?? ""}"`,
        `"${(v.address ?? "").replace(/"/g, '""')}"`,
        `"${v.education}"`,
        `"${v.occupation ?? ""}"`,
        `"${v.district}"`,
        `"${v.constituency}"`,
        v.itKnowledge ? "ஆம்" : "இல்லை",
        v.videoCreation ? "ஆம்" : "இல்லை",
        v.imageCreation ? "ஆம்" : "இல்லை",
        `"${v.itSkills.join("; ")}"`,
        `"${v.softwareTools ?? ""}"`,
        v.yearsExp ?? "",
        `"${v.primaryDevice ?? ""}"`,
        `"${v.facebook ?? ""}"`,
        `"${v.youtube ?? ""}"`,
        `"${v.instagram ?? ""}"`,
        `"${v.twitterX ?? ""}"`,
        `"${v.followers ?? ""}"`,
        `"${v.availability ?? ""}"`,
        `"${v.languages.join("; ")}"`,
        v.canTravel === true ? "ஆம்" : v.canTravel === false ? "இல்லை" : "",
        v.vckMember === true ? "ஆம்" : v.vckMember === false ? "இல்லை" : "",
        `"${(v.priorExperience ?? "").replace(/"/g, '""')}"`,
        `"${v.hearAboutUs ?? ""}"`,
        `"${v.joinReason.replace(/"/g, '""')}"`,
        `"${v.emergencyName ?? ""}"`,
        `"${v.emergencyPhone ?? ""}"`,
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
