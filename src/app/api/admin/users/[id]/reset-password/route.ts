import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logActivity } from "@/lib/permissions"
import bcrypt from "bcryptjs"

function isSuperAdmin(role: string): boolean {
  return role === "SUPER_ADMIN"
}

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isSuperAdmin(session.user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { password } = body as { password?: string }

  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.user.update({
    where: { id },
    data: { passwordHash },
  })

  await logActivity(
    session.user.id,
    "RESET_PASSWORD",
    "users",
    id,
    { targetEmail: existing.email },
    req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? undefined
  )

  return NextResponse.json({ success: true })
}
