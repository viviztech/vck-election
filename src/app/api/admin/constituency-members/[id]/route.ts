import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteObject } from "@/lib/s3";

function isAdmin(role: string) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  const updated = await prisma.constituencyMember.update({
    where: { id },
    data: {
      constituencyId: body.constituencyId,
      postingTypeId: body.postingTypeId,
      name: body.name,
      address: body.address,
      age: body.age ? parseInt(body.age) : undefined,
      gender: body.gender,
      contact: body.contact,
      alternateContact: body.alternateContact,
      email: body.email,
      partyMembershipId: body.partyMembershipId,
      photoKey: body.photoKey,
      facebook: body.facebook,
      instagram: body.instagram,
      x: body.x,
      whatsapp: body.whatsapp,
      youtube: body.youtube,
      linkedin: body.linkedin,
      telegram: body.telegram,
      order: body.order,
      isActive: body.isActive,
    },
    include: { postingType: true, constituency: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const member = await prisma.constituencyMember.findUnique({ where: { id } });
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (member.photoKey) {
    await deleteObject(member.photoKey).catch(() => {});
  }

  await prisma.constituencyMember.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
