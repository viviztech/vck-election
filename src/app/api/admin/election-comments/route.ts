import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(role: string) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const pending = searchParams.get("pending") === "true";

  const comments = await prisma.electionComment.findMany({
    where: pending ? { isApproved: false } : undefined,
    include: {
      electionResult: {
        select: {
          constituency: { select: { nameEnglish: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(
    comments.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() }))
  );
}
