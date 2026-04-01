import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPresignedUploadUrl } from "@/lib/s3";
import { randomUUID } from "crypto";

function isAdmin(role: string) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { filename, contentType } = await req.json();
  const ext = filename?.split(".").pop() ?? "jpg";
  const key = `members/${randomUUID()}.${ext}`;

  const uploadUrl = await getPresignedUploadUrl(key, contentType ?? "image/jpeg");

  return NextResponse.json({ uploadUrl, key });
}
