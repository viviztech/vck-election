"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { CreateUserModal } from "./CreateUserModal"
import { EditRoleModal } from "./EditRoleModal"
import { ResetPasswordModal } from "./ResetPasswordModal"

interface UserRow {
  id: string
  name?: string | null
  email: string
  role: string
  createdAt: string
  suspendedAt?: string | null
  _count: { formEntries: number }
}

interface Props {
  currentUserId: string
  currentRole: string
}

type Modal =
  | { type: "create" }
  | { type: "editRole"; user: UserRow }
  | { type: "resetPassword"; user: UserRow }
  | null

const ROLES = ["ALL", "USER", "ADMIN", "SUPER_ADMIN"] as const
const PAGE_SIZE = 20

function RoleBadge({ role }: { role: string }) {
  const cls =
    role === "SUPER_ADMIN"
      ? "bg-red-100 text-red-700"
      : role === "ADMIN"
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-100 text-gray-600"
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{role}</span>
  )
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-full" />
        </td>
      ))}
    </tr>
  )
}

export function UserManagementClient({ currentUserId, currentRole }: Props) {
  const [users, setUsers] = useState<UserRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<Modal>(null)
  const [acting, setActing] = useState<string | null>(null)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isSuperAdmin = currentRole === "SUPER_ADMIN"
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const fetchUsers = useCallback(async (p: number, q: string, rf: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(PAGE_SIZE) })
      if (q) params.set("search", q)
      if (rf !== "ALL") params.set("role", rf)
      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json() as { users: UserRow[]; total: number }
      setUsers(data.users ?? [])
      setTotal(data.total ?? 0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchUsers(page, search, roleFilter)
  }, [fetchUsers, page, roleFilter])

  function handleSearchChange(value: string) {
    setSearch(value)
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      setPage(1)
      void fetchUsers(1, value, roleFilter)
    }, 350)
  }

  function handleRoleFilter(rf: string) {
    setRoleFilter(rf)
    setPage(1)
  }

  async function suspendUser(user: UserRow, suspend: boolean) {
    const label = suspend ? "suspend" : "unsuspend"
    if (!confirm(`${suspend ? "Suspend" : "Unsuspend"} ${user.email}?`)) return
    setActing(user.id)
    try {
      await fetch(`/api/admin/users/${user.id}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suspend }),
      })
      void fetchUsers(page, search, roleFilter)
    } finally {
      setActing(null)
    }
  }

  async function deleteUser(user: UserRow) {
    if (!confirm(`Permanently delete ${user.email}? This cannot be undone.`)) return
    setActing(user.id)
    try {
      await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" })
      void fetchUsers(page, search, roleFilter)
    } finally {
      setActing(null)
    }
  }

  function refresh() {
    setModal(null)
    void fetchUsers(page, search, roleFilter)
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-gray-900">Users ({total})</h2>
          {isSuperAdmin && (
            <button
              onClick={() => setModal({ type: "create" })}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition"
            >
              + Create User
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 min-w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          <select
            value={roleFilter}
            onChange={(e) => handleRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r === "ALL" ? "All Roles" : r}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Name / Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Entries</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Created</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                  : users.length === 0
                  ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400">No users found</td>
                    </tr>
                  )
                  : users.map((user) => (
                    <tr key={user.id} className={`hover:bg-gray-50 ${acting === user.id ? "opacity-50" : ""}`}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{user.name ?? "—"}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </td>
                      <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-xs">
                          <span className={`w-2 h-2 rounded-full ${user.suspendedAt ? "bg-red-500" : "bg-green-500"}`} />
                          {user.suspendedAt ? "Suspended" : "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{user._count.formEntries}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(user.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          <a
                            href={`/admin/users/${user.id}`}
                            className="text-xs px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
                          >
                            View
                          </a>
                          {isSuperAdmin && user.id !== currentUserId && (
                            <button
                              onClick={() => setModal({ type: "editRole", user })}
                              className="text-xs px-2 py-1 border border-blue-300 rounded text-blue-600 hover:bg-blue-50"
                            >
                              Role
                            </button>
                          )}
                          {user.id !== currentUserId && (
                            <button
                              onClick={() => void suspendUser(user, !user.suspendedAt)}
                              className={`text-xs px-2 py-1 border rounded ${user.suspendedAt ? "border-green-300 text-green-600 hover:bg-green-50" : "border-amber-300 text-amber-600 hover:bg-amber-50"}`}
                            >
                              {user.suspendedAt ? "Unsuspend" : "Suspend"}
                            </button>
                          )}
                          {isSuperAdmin && (
                            <button
                              onClick={() => setModal({ type: "resetPassword", user })}
                              className="text-xs px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
                            >
                              Reset PW
                            </button>
                          )}
                          {isSuperAdmin && user.id !== currentUserId && (
                            <button
                              onClick={() => void deleteUser(user)}
                              className="text-xs px-2 py-1 border border-red-300 rounded text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Page {page} of {totalPages} ({total} users)</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {modal?.type === "create" && (
        <CreateUserModal onSuccess={refresh} onClose={() => setModal(null)} />
      )}
      {modal?.type === "editRole" && (
        <EditRoleModal
          userId={modal.user.id}
          currentRole={modal.user.role}
          userName={modal.user.name ?? modal.user.email}
          onSuccess={refresh}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "resetPassword" && (
        <ResetPasswordModal
          userId={modal.user.id}
          userName={modal.user.name ?? modal.user.email}
          onSuccess={refresh}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}
