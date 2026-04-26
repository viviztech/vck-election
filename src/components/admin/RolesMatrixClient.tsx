"use client"

import { useState } from "react"

interface Permission {
  id: string
  resource: string
  action: string
  description?: string | null
}

interface Props {
  permissions: Permission[]
  roleMatrix: Record<string, string[]>
  currentRole: string
}

const ROLES = ["USER", "ADMIN", "SUPER_ADMIN"] as const
type Role = typeof ROLES[number]

function groupByResource(permissions: Permission[]): Record<string, Permission[]> {
  return permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    if (!acc[p.resource]) acc[p.resource] = []
    acc[p.resource].push(p)
    return acc
  }, {})
}

export function RolesMatrixClient({ permissions, roleMatrix: initial, currentRole }: Props) {
  const [matrix, setMatrix] = useState<Record<string, string[]>>(initial)
  const [toggling, setToggling] = useState<string | null>(null)
  const isSuperAdmin = currentRole === "SUPER_ADMIN"
  const groups = groupByResource(permissions)

  function hasPermission(role: Role, permId: string): boolean {
    return (matrix[role] ?? []).includes(permId)
  }

  async function toggle(role: Role, permId: string, grant: boolean) {
    if (role === "SUPER_ADMIN") return
    const key = `${role}:${permId}`
    setToggling(key)
    try {
      const method = grant ? "POST" : "DELETE"
      const res = await fetch("/api/admin/roles", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, permissionId: permId }),
      })
      if (res.ok) {
        setMatrix((prev) => {
          const current = prev[role] ?? []
          return {
            ...prev,
            [role]: grant
              ? [...current, permId]
              : current.filter((id) => id !== permId),
          }
        })
      }
    } finally {
      setToggling(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Roles &amp; Permissions</h2>
        <p className="text-sm text-gray-500">{permissions.length} permissions across {Object.keys(groups).length} resources</p>
      </div>

      {!isSuperAdmin && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-700">
          Read-only view. Only SUPER_ADMIN can modify role permissions.
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 min-w-56">Permission</th>
                {ROLES.map((role) => (
                  <th key={role} className="text-center px-4 py-3 font-semibold text-gray-700 w-28">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      role === "SUPER_ADMIN" ? "bg-red-100 text-red-700"
                      : role === "ADMIN" ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                    }`}>
                      {role}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(groups).map(([resource, perms]) => (
                <>
                  <tr key={`group-${resource}`} className="bg-gray-50">
                    <td colSpan={4} className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {resource}
                    </td>
                  </tr>
                  {perms.map((perm) => (
                    <tr key={perm.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-gray-800 capitalize">{perm.action}</p>
                        {perm.description && (
                          <p className="text-xs text-gray-400 mt-0.5">{perm.description}</p>
                        )}
                      </td>
                      {ROLES.map((role) => {
                        const checked = hasPermission(role, perm.id)
                        const isDisabled = role === "SUPER_ADMIN" || !isSuperAdmin || toggling === `${role}:${perm.id}`
                        return (
                          <td key={role} className="px-4 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={role === "SUPER_ADMIN" ? true : checked}
                              disabled={isDisabled}
                              onChange={(e) => void toggle(role, perm.id, e.target.checked)}
                              className="w-4 h-4 accent-slate-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                            />
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
