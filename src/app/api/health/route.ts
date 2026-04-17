import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", db: "connected" });
  } catch (e) {
    return NextResponse.json({ status: "ok", db: "error", error: String(e) }, { status: 200 });
  }
}
