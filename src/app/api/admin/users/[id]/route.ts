import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const UpdateUserSchema = z.object({
  role: z.enum(["USER", "ADMIN", "SUPER_ADMIN"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  try {
    const body = await req.json();
    const { role } = UpdateUserSchema.parse(body);

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true, name: true },
    });

    return NextResponse.json(user);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
