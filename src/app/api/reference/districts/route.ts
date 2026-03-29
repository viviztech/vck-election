import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const districts = await prisma.district.findMany({
    orderBy: { nameEnglish: "asc" },
  });
  return NextResponse.json(districts);
}
