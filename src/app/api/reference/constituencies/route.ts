import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const districtId = searchParams.get("districtId");

  const constituencies = await prisma.constituency.findMany({
    where: districtId ? { districtId } : undefined,
    orderBy: { nameEnglish: "asc" },
  });
  return NextResponse.json(constituencies);
}
