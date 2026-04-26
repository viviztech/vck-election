import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logActivity } from "@/lib/permissions"

function isAdmin(role: string): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN"
}

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isAdmin(session.user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { suspend, reason } = body as { suspend?: boolean; reason?: string }

  if (typeof suspend !== "boolean") {
    return NextResponse.json({ error: "suspend (boolean) is required" }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const user = await prisma.user.update({
    where: { id },
    data: {
      suspendedAt: suspend ? new Date() : null,
      suspendedReason: suspend ? (reason ?? null) : null,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      suspendedAt: true,
      suspendedReason: true,
    },
  })

  await logActivity(
    session.user.id,
    suspend ? "SUSPEND_USER" : "UNSUSPEND_USER",
    "users",
    id,
    { targetEmail: existing.email, reason: reason ?? null },
    req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? undefined
  )

  return NextResponse.json(user)
}
