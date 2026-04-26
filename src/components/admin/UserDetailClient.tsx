"use client"

import { useEffect, useState } from "react"

interface UserProp {
  id: string
  email: string
  name?: string | null
  role: string
  createdAt: string
  suspendedAt?: string | null
}

interface Permission {
  id: string
  resource: string
  action: string
}

interface UserPermission {
  id: string
  permissionId: string
  granted: boolean
  permission: Permission
}

interface ActivityEntry {
  id: string
  action: string
  resource: string
  resourceId?: string | null
  createdAt: string
}

interface Props {
  user: UserProp
  currentRole: string
  currentUserId: string
}

function RoleBadge({ role }: { role: string }) {
  const cls =
    role === "SUPER_ADMIN" ? "bg-red-100 text-red-700"
    : role === "ADMIN" ? "bg-blue-100 text-blue-700"
    : "bg-gray-100 text-gray-600"
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{role}</span>
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function UserDetailClient({ user, currentRole, currentUserId: _currentUserId }: Props) {
  const [userPerms, setUserPerms] = useState<UserPermission[]>([])
  const [allPerms, setAllPerms] = useState<Permission[]>([])
  const [rolePermIds, setRolePermIds] = useState<string[]>([])
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [loadingPerms, setLoadingPerms] = useState(true)
  const [loadingActivity, setLoadingActivity] = useState(true)
  const isSuperAdmin = currentRole === "SUPER_ADMIN"

  useEffect(() => {
    void (async () => {
      try {
        const [userRes, permsRes, rolesRes] = await Promise.all([
          fetch(`/api/admin/users/${user.id}`),
          fetch("/api/admin/permissions"),
          fetch("/api/admin/roles"),
        ])
        const userData = await userRes.json() as { userPermissions?: UserPermission[] }
        const permsData = await permsRes.json() as { groups?: Array<{ permissions: Permission[] }> }
        const rolesData = await rolesRes.json() as Array<{ role: string; permissions: Permission[] }>

        setUserPerms(userData.userPermissions ?? [])

        const flatPerms: Permission[] = []
        for (const g of permsData.groups ?? []) flatPerms.push(...g.permissions)
        setAllPerms(flatPerms)

        const roleEntry = rolesData.find((r) => r.role === user.role)
        setRolePermIds((roleEntry?.permissions ?? []).map((p) => p.id))
      } finally {
        setLoadingPerms(false)
      }
    })()
  }, [user.id, user.role])

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`/api/admin/activity?userId=${user.id}&limit=10`)
        const data = await res.json() as { logs: ActivityEntry[] }
        setActivity(data.logs ?? [])
      } finally {
        setLoadingActivity(false)
      }
    })()
  }, [user.id])

  async function toggleOverride(permId: string, grant: boolean) {
    await fetch(`/api/admin/users/${user.id}/permissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permissionId: permId, granted: grant }),
    })
    setUserPerms((prev) => {
      const existing = prev.find((up) => up.permissionId === permId)
      if (existing) return prev.map((up) => up.permissionId === permId ? { ...up, granted: grant } : up)
      const perm = allPerms.find((p) => p.id === permId)
      if (!perm) return prev
      return [...prev, { id: `temp-${permId}`, permissionId: permId, granted: grant, permission: perm }]
    })
  }

  const initials = (user.name ?? user.email).slice(0, 2).toUpperCase()

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-700 text-white flex items-center justify-center text-xl font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-gray-900">{user.name ?? "—"}</h2>
              <RoleBadge role={user.role} />
              <span className={`flex items-center gap-1 text-xs ${user.suspendedAt ? "text-red-600" : "text-green-600"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${user.suspendedAt ? "bg-red-500" : "bg-green-500"}`} />
                {user.suspendedAt ? "Suspended" : "Active"}
              </span>
            </div>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <p className="text-gray-400 text-xs mt-1">
              Created {new Date(user.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Permissions</h3>
          <p className="text-xs text-gray-400 mt-0.5">Inherited from role or overridden per user</p>
        </div>
        {loadingPerms ? (
          <div className="p-6 text-center text-gray-400 text-sm">Loading permissions…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Permission</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Source</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">Granted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allPerms.map((perm) => {
                  const override = userPerms.find((up) => up.permissionId === perm.id)
                  const fromRole = rolePermIds.includes(perm.id)
                  const granted = override ? override.granted : fromRole
                  const source = override ? "Override" : "Role"
                  return (
                    <tr key={perm.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-gray-700 capitalize">
                        {perm.resource} — {perm.action}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${source === "Override" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"}`}>
                          {source}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {isSuperAdmin ? (
                          <input
                            type="checkbox"
                            checked={granted}
                            onChange={(e) => void toggleOverride(perm.id, e.target.checked)}
                            className="w-4 h-4 accent-slate-700 cursor-pointer"
                          />
                        ) : (
                          <span className={`text-xs font-medium ${granted ? "text-green-600" : "text-red-500"}`}>
                            {granted ? "Yes" : "No"}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Activity */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Recent Activity</h3>
        </div>
        {loadingActivity ? (
          <div className="p-6 text-center text-gray-400 text-sm">Loading…</div>
        ) : activity.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">No activity recorded</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {activity.map((log) => (
              <li key={log.id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-800 capitalize">{log.action}</p>
                  <p className="text-xs text-gray-400">{log.resource}{log.resourceId ? ` #${log.resourceId.slice(0, 8)}` : ""}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0" title={new Date(log.createdAt).toLocaleString("en-IN")}>
                  {relativeTime(log.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
