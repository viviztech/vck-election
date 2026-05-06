import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "USER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    total,
    byDistrict,
    byConstituency,
    byGender,
    byAvailability,
    byDevice,
    byVckMember,
    byCanTravel,
    byItKnowledge,
    byVideoCreation,
    byImageCreation,
    byOccupation,
    byHearAboutUs,
    byState,
    skillCounts,
    languageCounts,
    registrationsByMonth,
  ] = await Promise.all([
    prisma.itWingVolunteer.count(),

    // By district
    prisma.itWingVolunteer.groupBy({
      by: ["district"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    // By constituency
    prisma.itWingVolunteer.groupBy({
      by: ["constituency", "district"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    // By gender
    prisma.itWingVolunteer.groupBy({
      by: ["gender"],
      _count: { id: true },
    }),

    // By availability
    prisma.itWingVolunteer.groupBy({
      by: ["availability"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    // By primary device
    prisma.itWingVolunteer.groupBy({
      by: ["primaryDevice"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    // VCK member
    prisma.itWingVolunteer.groupBy({
      by: ["vckMember"],
      _count: { id: true },
    }),

    // Can travel
    prisma.itWingVolunteer.groupBy({
      by: ["canTravel"],
      _count: { id: true },
    }),

    // IT knowledge
    prisma.itWingVolunteer.aggregate({
      _count: { itKnowledge: true },
      where: { itKnowledge: true },
    }),

    // Video creation
    prisma.itWingVolunteer.aggregate({
      _count: { videoCreation: true },
      where: { videoCreation: true },
    }),

    // Image creation
    prisma.itWingVolunteer.aggregate({
      _count: { imageCreation: true },
      where: { imageCreation: true },
    }),

    // By occupation
    prisma.itWingVolunteer.groupBy({
      by: ["occupation"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    // By hear about us
    prisma.itWingVolunteer.groupBy({
      by: ["hearAboutUs"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    // By state
    prisma.itWingVolunteer.groupBy({
      by: ["state"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    // IT skill counts (raw — requires post-processing)
    prisma.itWingVolunteer.findMany({
      select: { itSkills: true },
    }),

    // Language counts
    prisma.itWingVolunteer.findMany({
      select: { languages: true },
    }),

    // Registrations by month (last 12 months)
    prisma.$queryRaw<{ month: string; count: bigint }[]>`
      SELECT TO_CHAR("createdAt", 'YYYY-MM') AS month, COUNT(*) AS count
      FROM it_wing_volunteers
      WHERE "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY month
      ORDER BY month ASC
    `,
  ]);

  // Aggregate itSkills
  const skillMap: Record<string, number> = {};
  for (const v of skillCounts) {
    for (const s of v.itSkills) {
      skillMap[s] = (skillMap[s] ?? 0) + 1;
    }
  }
  const bySkill = Object.entries(skillMap)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count);

  // Aggregate languages
  const langMap: Record<string, number> = {};
  for (const v of languageCounts) {
    for (const l of v.languages) {
      langMap[l] = (langMap[l] ?? 0) + 1;
    }
  }
  const byLanguage = Object.entries(langMap)
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count);

  return NextResponse.json({
    total,
    byDistrict: byDistrict.map((r) => ({ district: r.district, count: r._count.id })),
    byConstituency: byConstituency.map((r) => ({ constituency: r.constituency, district: r.district, count: r._count.id })),
    byGender: byGender.map((r) => ({ gender: r.gender ?? "Unknown", count: r._count.id })),
    byAvailability: byAvailability.map((r) => ({ availability: r.availability ?? "Not specified", count: r._count.id })),
    byDevice: byDevice.map((r) => ({ device: r.primaryDevice ?? "Not specified", count: r._count.id })),
    byVckMember: byVckMember.map((r) => ({ vckMember: r.vckMember, count: r._count.id })),
    byCanTravel: byCanTravel.map((r) => ({ canTravel: r.canTravel, count: r._count.id })),
    itKnowledgeCount: byItKnowledge._count.itKnowledge,
    videoCreationCount: byVideoCreation._count.videoCreation,
    imageCreationCount: byImageCreation._count.imageCreation,
    byOccupation: byOccupation.map((r) => ({ occupation: r.occupation ?? "Not specified", count: r._count.id })),
    byHearAboutUs: byHearAboutUs.map((r) => ({ source: r.hearAboutUs ?? "Not specified", count: r._count.id })),
    byState: byState.map((r) => ({ state: r.state, count: r._count.id })),
    bySkill,
    byLanguage,
    byMonth: registrationsByMonth.map((r) => ({ month: r.month, count: Number(r.count) })),
  });
}
