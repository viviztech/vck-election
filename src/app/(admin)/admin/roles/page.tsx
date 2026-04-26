import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/Header"
import { RolesMatrixClient } from "@/components/admin/RolesMatrixClient"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Roles & Permissions" }

export default async function RolesPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role === "USER") redirect("/dashboard")

  const [permissions, rolePermissions] = await Promise.all([
    prisma.permission.findMany({
      orderBy: [{ resource: "asc" }, { action: "asc" }],
    }),
    prisma.rolePermission.findMany(),
  ])

  const roleMatrix: Record<string, string[]> = {}
  for (const rp of rolePermissions) {
    if (!roleMatrix[rp.role]) roleMatrix[rp.role] = []
    roleMatrix[rp.role].push(rp.permissionId)
  }

  const serializedPermissions = permissions.map((p) => ({
    id: p.id,
    resource: p.resource,
    action: p.action,
    description: p.description ?? null,
  }))

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Roles & Permissions" />
      <div className="flex-1 p-6">
        <RolesMatrixClient
          permissions={serializedPermissions}
          roleMatrix={roleMatrix}
          currentRole={session.user.role}
        />
      </div>
    </div>
  )
}
