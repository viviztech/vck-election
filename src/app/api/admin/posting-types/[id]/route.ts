import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  const updated = await prisma.postingType.update({
    where: { id },
    data: {
      nameTamil: body.nameTamil,
      nameEnglish: body.nameEnglish,
      bodyType: body.bodyType,
      order: body.order,
      isActive: body.isActive,
    },
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

  const inUse = await prisma.constituencyMember.count({ where: { postingTypeId: id } });
  if (inUse > 0) {
    return NextResponse.json(
      { error: "Cannot delete — posting type is assigned to members" },
      { status: 409 }
    );
  }

  await prisma.postingType.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
