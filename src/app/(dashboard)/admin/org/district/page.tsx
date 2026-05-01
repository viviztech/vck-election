import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPresignedReadUrl } from "@/lib/s3";
import { OrgMembersClient } from "@/components/admin/OrgMembersClient";

export const dynamic = "force-dynamic";

const DISTRICT_ORDER: Record<string, number> = {
  TVL: 1, CHN: 2, KAN: 3, VEL: 4, KRI: 5, DHR: 6, TVN: 7, VIL: 8,
  SLM: 9, NMK: 10, EDE: 11, NLR: 12, CBE: 13, DIN: 14, KAR: 15,
  TIR: 16, PER: 17, CUD: 18, NAG: 19, TVR: 20, THA: 21, PUD: 22,
  SIV: 23, MDU: 24, THN: 25, VRT: 26, RMN: 27, TPN: 28, TNV: 29,
  KKN: 30, ARY: 31, TRV: 32, KAL: 33, TEN: 34, CGT: 35, TPR: 36,
  RAN: 37, MAY: 38,
};

export default async function OrgDistrictPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user.role === "ADMIN" || session?.user.role === "SUPER_ADMIN";
  if (!isAdmin) return notFound();

  const [allPostingTypes, wings, districts, members] = await Promise.all([
    prisma.postingType.findMany({
      where: { isActive: true },
      orderBy: [{ bodyType: "asc" }, { order: "asc" }],
    }),
    prisma.partyWing.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.district.findMany({ orderBy: { nameEnglish: "asc" } }),
    prisma.orgMember.findMany({
      where: {
        stateLevel: false,
        parliamentaryConstituencyId: null,
        districtId: { not: null },
        constituencyId: null,
      },
      include: { postingType: true, wing: true, district: true },
      orderBy: [
        { district: { nameEnglish: "asc" } },
        { wing: { name: "asc" } },
        { postingType: { order: "asc" } },
        { order: "asc" },
      ],
    }),
  ]);

  const postingTypes = allPostingTypes.filter(
    (p) => p.nameEnglish.startsWith("District ") || p.nameEnglish.startsWith("Wing District ")
  );

  const sortedDistricts = [...districts].sort(
    (a, b) => (DISTRICT_ORDER[a.code] ?? 99) - (DISTRICT_ORDER[b.code] ?? 99)
  );

  const serializedMembers = await Promise.all(
    members.map(async (m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
      photoUrl: m.photoKey ? await getPresignedReadUrl(m.photoKey) : null,
    }))
  );

  return (
    <OrgMembersClient
      scope="district"
      postingTypes={postingTypes}
      wings={wings}
      parliamentaryConstituencies={[]}
      districts={sortedDistricts}
      initialMembers={serializedMembers}
    />
  );
}
