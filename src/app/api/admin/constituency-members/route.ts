import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPresignedReadUrl } from "@/lib/s3";

function isAdmin(role: string) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const constituencyId = searchParams.get("constituencyId");

  const members = await prisma.constituencyMember.findMany({
    where: constituencyId ? { constituencyId } : undefined,
    include: {
      postingType: true,
      constituency: { include: { district: true } },
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
    constituencyId, postingTypeId, name, address, age, gender,
    contact, alternateContact, email, partyMembershipId, photoKey,
    facebook, instagram, x, whatsapp, youtube, linkedin, telegram, order,
  } = body;

  if (!constituencyId || !postingTypeId || !name || !contact) {
    return NextResponse.json(
      { error: "constituencyId, postingTypeId, name, contact are required" },
      { status: 400 }
    );
  }

  const member = await prisma.constituencyMember.create({
    data: {
      constituencyId, postingTypeId, name,
      address, age: age ? parseInt(age) : undefined,
      gender, contact, alternateContact, email,
      partyMembershipId, photoKey,
      facebook, instagram, x, whatsapp, youtube, linkedin, telegram,
      order: order ?? 0,
    },
    include: { postingType: true, constituency: true },
  });

  return NextResponse.json(member, { status: 201 });
}
