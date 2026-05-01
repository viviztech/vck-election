import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPresignedReadUrl } from "@/lib/s3";

function isAdmin(role: string) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

const PERSON_FIELDS = [
  "name", "address", "age", "gender", "contact", "alternateContact",
  "email", "partyMembershipId", "photoKey",
  "facebook", "instagram", "x", "whatsapp", "youtube", "linkedin", "telegram",
] as const;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope"); // state | zone | district | constituency | local
  const parliamentaryConstituencyId = searchParams.get("parliamentaryConstituencyId");
  const districtId = searchParams.get("districtId");
  const constituencyId = searchParams.get("constituencyId");
  const localUnitId = searchParams.get("localUnitId");
  const wingId = searchParams.get("wingId");

  // Build where clause based on scope + optional filters
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {};

  if (scope === "state") {
    where.stateLevel = true;
  } else if (scope === "zone") {
    where.stateLevel = false;
    where.parliamentaryConstituencyId = parliamentaryConstituencyId ?? { not: null };
  } else if (scope === "district") {
    where.stateLevel = false;
    where.parliamentaryConstituencyId = null;
    where.districtId = districtId ?? { not: null };
  } else if (scope === "constituency") {
    where.stateLevel = false;
    where.parliamentaryConstituencyId = null;
    where.districtId = null;
    where.constituencyId = constituencyId ?? { not: null };
  } else if (scope === "local") {
    where.localUnitId = localUnitId ?? { not: null };
  }

  if (wingId) where.wingId = wingId;

  const members = await prisma.orgMember.findMany({
    where,
    include: {
      postingType: true,
      wing: true,
      parliamentaryConstituency: true,
      district: true,
      constituency: { include: { district: true } },
      localUnit: true,
    },
    orderBy: [{ postingType: { order: "asc" } }, { order: "asc" }],
  });

  const serialized = await Promise.all(
    members.map(async (m) => ({
      ...m,
      photoUrl: m.photoKey ? await getPresignedReadUrl(m.photoKey) : null,
    }))
  );

  return NextResponse.json(serialized);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const {
    postingTypeId, order, stateLevel, parliamentaryConstituencyId, districtId,
    constituencyId, localUnitId, wingId,
    name, address, age, gender, contact, alternateContact, email,
    partyMembershipId, photoKey, facebook, instagram, x, whatsapp,
    youtube, linkedin, telegram,
  } = body;

  if (!postingTypeId || !name) {
    return NextResponse.json(
      { error: "postingTypeId and name are required" },
      { status: 400 },
    );
  }

  const member = await prisma.orgMember.create({
    data: {
      postingTypeId,
      stateLevel: stateLevel ?? false,
      parliamentaryConstituencyId: parliamentaryConstituencyId || null,
      districtId: districtId || null,
      constituencyId: constituencyId || null,
      localUnitId: localUnitId || null,
      wingId: wingId || null,
      order: order ?? 0,
      name,
      address: address || null,
      age: age ? parseInt(age) : null,
      gender: gender || null,
      contact: contact || null,
      alternateContact: alternateContact || null,
      email: email || null,
      partyMembershipId: partyMembershipId || null,
      photoKey: photoKey || null,
      facebook: facebook || null,
      instagram: instagram || null,
      x: x || null,
      whatsapp: whatsapp || null,
      youtube: youtube || null,
      linkedin: linkedin || null,
      telegram: telegram || null,
    },
    include: {
      postingType: true,
      wing: true,
      parliamentaryConstituency: true,
      district: true,
      constituency: true,
    },
  });

  return NextResponse.json(member, { status: 201 });
}
