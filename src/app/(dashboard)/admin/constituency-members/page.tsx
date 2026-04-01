import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ConstituencyMembersClient } from "@/components/admin/ConstituencyMembersClient";
import { getPresignedReadUrl } from "@/lib/s3";

export const dynamic = "force-dynamic";

// Official district order
const DISTRICT_ORDER: Record<string, number> = {
  TVL: 1, CHN: 2, KAN: 3, VEL: 4, KRI: 5, DHR: 6, TVN: 7, VIL: 8,
  SLM: 9, NMK: 10, EDE: 11, NLR: 12, CBE: 13, DIN: 14, KAR: 15,
  TIR: 16, PER: 17, CUD: 18, NAG: 19, TVR: 20, THA: 21, PUD: 22,
  SIV: 23, MDU: 24, THN: 25, VRT: 26, RMN: 27, TPN: 28, TNV: 29,
  KKN: 30, ARY: 31, TRV: 32, KAL: 33, TEN: 34, CGT: 35, TPR: 36,
  RAN: 37, MAY: 38,
};

export default async function ConstituencyMembersPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user.role === "ADMIN" || session?.user.role === "SUPER_ADMIN";
  if (!isAdmin) return notFound();

  const [districts, postingTypes, members] = await Promise.all([
    prisma.district.findMany({ include: { constituencies: { orderBy: { nameEnglish: "asc" } } } }),
    prisma.postingType.findMany({ where: { isActive: true }, orderBy: [{ bodyType: "asc" }, { order: "asc" }] }),
    prisma.constituencyMember.findMany({
      include: { postingType: true, constituency: { include: { district: true } } },
      orderBy: [{ constituency: { nameEnglish: "asc" } }, { postingType: { order: "asc" } }, { order: "asc" }],
    }),
  ]);

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
    <ConstituencyMembersClient
      districts={sortedDistricts}
      postingTypes={postingTypes}
      initialMembers={serializedMembers}
    />
  );
}
