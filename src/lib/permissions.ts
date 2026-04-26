import { prisma } from "./prisma"
import { Role, Prisma } from "@prisma/client"

export async function getUserPermissions(userId: string, role: Role): Promise<Map<string, boolean>> {
  const [rolePerms, userPerms] = await Promise.all([
    prisma.rolePermission.findMany({
      where: { role },
      include: { permission: true },
    }),
    prisma.userPermission.findMany({
      where: { userId },
      include: { permission: true },
    }),
  ])

  const base = new Map<string, boolean>(
    rolePerms.map((rp) => [`${rp.permission.resource}:${rp.permission.action}`, true])
  )

  for (const up of userPerms) {
    base.set(`${up.permission.resource}:${up.permission.action}`, up.granted)
  }

  return base
}

export function hasPermission(
  permissions: Map<string, boolean>,
  resource: string,
  action: string
): boolean {
  return permissions.get(`${resource}:${action}`) === true
}

export async function logActivity(
  userId: string,
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, unknown>,
  ipAddress?: string
) {
  return prisma.adminActivityLog.create({
    data: {
      userId,
      action,
      resource,
      resourceId,
      details: (details ?? undefined) as Prisma.InputJsonValue | undefined,
      ipAddress,
    },
  })
}
