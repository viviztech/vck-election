import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPresignedReadUrl } from "@/lib/s3";
import { OrgMembersClient } from "@/components/admin/OrgMembersClient";

export const dynamic = "force-dynamic";

export default async function OrgStatePage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user.role === "ADMIN" || session?.user.role === "SUPER_ADMIN";
  if (!isAdmin) return notFound();

  const [allPostingTypes, wings, members] = await Promise.all([
    prisma.postingType.findMany({
      where: { isActive: true },
      orderBy: [{ bodyType: "asc" }, { order: "asc" }],
    }),
    prisma.partyWing.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.orgMember.findMany({
      where: { stateLevel: true },
      include: { postingType: true, wing: true },
      orderBy: [{ wing: { name: "asc" } }, { postingType: { order: "asc" } }, { order: "asc" }],
    }),
  ]);

  // Show only state-scope posting types (name starts with "State" or "Wing State")
  const postingTypes = allPostingTypes.filter(
    (p) => p.nameEnglish.startsWith("State ") || p.nameEnglish.startsWith("Wing State ")
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
      scope="state"
      postingTypes={postingTypes}
      wings={wings}
      parliamentaryConstituencies={[]}
      districts={[]}
      initialMembers={serializedMembers}
    />
  );
}
