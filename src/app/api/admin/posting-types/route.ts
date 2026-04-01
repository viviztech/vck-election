import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(role: string) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const postingTypes = await prisma.postingType.findMany({
    orderBy: [{ bodyType: "asc" }, { order: "asc" }],
  });

  return NextResponse.json(postingTypes);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { nameTamil, nameEnglish, bodyType, order } = body;

  if (!nameTamil || !nameEnglish) {
    return NextResponse.json({ error: "nameTamil and nameEnglish are required" }, { status: 400 });
  }

  const postingType = await prisma.postingType.create({
    data: {
      nameTamil,
      nameEnglish,
      bodyType: bodyType ?? "MAIN_BODY",
      order: order ?? 0,
    },
  });

  return NextResponse.json(postingType, { status: 201 });
}
