import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(role: string) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

interface MemberRow {
  name: string;
  constituencyId: string;
  postingTypeId: string;
  contact?: string;
  order?: number;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const members: MemberRow[] = body.members;

  if (!Array.isArray(members) || members.length === 0) {
    return NextResponse.json({ error: "No members provided" }, { status: 400 });
  }

  for (const m of members) {
    if (!m.name || !m.constituencyId || !m.postingTypeId) {
      return NextResponse.json(
        { error: `Each member needs name, constituencyId, and postingTypeId. Missing for: ${m.name ?? "unknown"}` },
        { status: 400 }
      );
    }
  }

  const created = await prisma.constituencyMember.createMany({
    data: members.map((m) => ({
      name: m.name,
      constituencyId: m.constituencyId,
      postingTypeId: m.postingTypeId,
      contact: m.contact ?? null,
      order: m.order ?? 0,
    })),
    skipDuplicates: true,
  });

  return NextResponse.json({ inserted: created.count }, { status: 201 });
}
