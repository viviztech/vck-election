import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPresignedReadUrl } from "@/lib/s3";
import { OrgMembersClient } from "@/components/admin/OrgMembersClient";

export const dynamic = "force-dynamic";

export default async function OrgZonePage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user.role === "ADMIN" || session?.user.role === "SUPER_ADMIN";
  if (!isAdmin) return notFound();

  const [allPostingTypes, wings, parliamentaryConstituencies, members] = await Promise.all([
    prisma.postingType.findMany({
      where: { isActive: true },
      orderBy: [{ bodyType: "asc" }, { order: "asc" }],
    }),
    prisma.partyWing.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.parliamentaryConstituency.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    prisma.orgMember.findMany({
      where: {
        stateLevel: false,
        parliamentaryConstituencyId: { not: null },
        districtId: null,
        constituencyId: null,
      },
      include: { postingType: true, wing: true, parliamentaryConstituency: true },
      orderBy: [
        { parliamentaryConstituency: { order: "asc" } },
        { wing: { name: "asc" } },
        { postingType: { order: "asc" } },
        { order: "asc" },
      ],
    }),
  ]);

  // Show only zone-scope posting types
  const postingTypes = allPostingTypes.filter(
    (p) => p.nameEnglish.startsWith("Zone ") || p.nameEnglish.startsWith("Wing Zone ")
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
      scope="zone"
      postingTypes={postingTypes}
      wings={wings}
      parliamentaryConstituencies={parliamentaryConstituencies}
      districts={[]}
      initialMembers={serializedMembers}
    />
  );
}
