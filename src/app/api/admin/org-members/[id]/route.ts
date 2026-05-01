import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteObject } from "@/lib/s3";

function isAdmin(role: string) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = params;
  const body = await req.json();

  const updated = await prisma.orgMember.update({
    where: { id },
    data: {
      ...body,
      age: body.age ? parseInt(body.age) : undefined,
      parliamentaryConstituencyId: body.parliamentaryConstituencyId || null,
      districtId: body.districtId || null,
      constituencyId: body.constituencyId || null,
      localUnitId: body.localUnitId || null,
      wingId: body.wingId || null,
    },
    include: {
      postingType: true,
      wing: true,
      parliamentaryConstituency: true,
      district: true,
      constituency: true,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = params;
  const member = await prisma.orgMember.findUnique({ where: { id } });
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (member.photoKey) {
    await deleteObject(member.photoKey).catch(() => null);
  }

  await prisma.orgMember.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
