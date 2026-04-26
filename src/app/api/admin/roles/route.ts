import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"

function isAdmin(role: string): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN"
}

function isSuperAdmin(role: string): boolean {
  return role === "SUPER_ADMIN"
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isAdmin(session.user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const allRoles = [Role.USER, Role.ADMIN, Role.SUPER_ADMIN]

  const matrix = await Promise.all(
    allRoles.map(async (r) => {
      const rolePermissions = await prisma.rolePermission.findMany({
        where: { role: r },
        include: { permission: true },
        orderBy: [{ permission: { resource: "asc" } }, { permission: { action: "asc" } }],
      })
      return {
        role: r,
        permissions: rolePermissions.map((rp) => rp.permission),
      }
    })
  )

  return NextResponse.json(matrix)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isSuperAdmin(session.user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { role, permissionId } = body as { role?: string; permissionId?: string }

  if (!role || !permissionId) {
    return NextResponse.json({ error: "role and permissionId are required" }, { status: 400 })
  }

  if (!Object.values(Role).includes(role as Role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 })
  }

  const permission = await prisma.permission.findUnique({ where: { id: permissionId } })
  if (!permission) return NextResponse.json({ error: "Permission not found" }, { status: 404 })

  const rolePermission = await prisma.rolePermission.upsert({
    where: { role_permissionId: { role: role as Role, permissionId } },
    create: { role: role as Role, permissionId },
    update: {},
    include: { permission: true },
  })

  return NextResponse.json(rolePermission, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isSuperAdmin(session.user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { role, permissionId } = body as { role?: string; permissionId?: string }

  if (!role || !permissionId) {
    return NextResponse.json({ error: "role and permissionId are required" }, { status: 400 })
  }

  if (!Object.values(Role).includes(role as Role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 })
  }

  const existing = await prisma.rolePermission.findUnique({
    where: { role_permissionId: { role: role as Role, permissionId } },
  })
  if (!existing) return NextResponse.json({ error: "Role permission not found" }, { status: 404 })

  await prisma.rolePermission.delete({
    where: { role_permissionId: { role: role as Role, permissionId } },
  })

  return NextResponse.json({ success: true })
}
