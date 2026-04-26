import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function isAdmin(role: string): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN"
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isAdmin(session.user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const permissions = await prisma.permission.findMany({
    orderBy: [{ resource: "asc" }, { action: "asc" }],
    include: {
      _count: {
        select: {
          rolePermissions: true,
          userPermissions: true,
        },
      },
    },
  })

  // Group by resource
  const grouped = permissions.reduce<
    Record<
      string,
      {
        resource: string
        permissions: typeof permissions
      }
    >
  >((acc, perm) => {
    if (!acc[perm.resource]) {
      acc[perm.resource] = { resource: perm.resource, permissions: [] }
    }
    acc[perm.resource].permissions.push(perm)
    return acc
  }, {})

  return NextResponse.json({ groups: Object.values(grouped), total: permissions.length })
}
