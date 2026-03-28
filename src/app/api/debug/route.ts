import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "db_ok" });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
