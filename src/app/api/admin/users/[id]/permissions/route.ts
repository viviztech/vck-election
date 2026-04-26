import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getUserPermissions } from "@/lib/permissions"

function isAdmin(role: string): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN"
}

function isSuperAdmin(role: string): boolean {
  return role === "SUPER_ADMIN"
}

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isAdmin(session.user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params

  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const permMap = await getUserPermissions(user.id, user.role)

  const permissions = Array.from(permMap.entries()).map(([key, granted]) => {
    const [resource, action] = key.split(":")
    return { resource, action, granted }
  })

  return NextResponse.json({ userId: id, role: user.role, permissions })
}

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

  const { permissionId, granted } = body as { permissionId?: string; granted?: boolean }

  if (!permissionId || typeof granted !== "boolean") {
    return NextResponse.json({ error: "permissionId and granted (boolean) are required" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const permission = await prisma.permission.findUnique({ where: { id: permissionId } })
  if (!permission) return NextResponse.json({ error: "Permission not found" }, { status: 404 })

  const userPermission = await prisma.userPermission.upsert({
    where: { userId_permissionId: { userId: id, permissionId } },
    create: { userId: id, permissionId, granted },
    update: { granted },
    include: { permission: true },
  })

  return NextResponse.json(userPermission)
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
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

  const { permissionId } = body as { permissionId?: string }

  if (!permissionId) {
    return NextResponse.json({ error: "permissionId is required" }, { status: 400 })
  }

  const existing = await prisma.userPermission.findUnique({
    where: { userId_permissionId: { userId: id, permissionId } },
  })
  if (!existing) return NextResponse.json({ error: "Permission override not found" }, { status: 404 })

  await prisma.userPermission.delete({
    where: { userId_permissionId: { userId: id, permissionId } },
  })

  return NextResponse.json({ success: true })
}
