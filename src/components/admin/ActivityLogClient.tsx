"use client"

import { useCallback, useEffect, useState } from "react"

interface LogEntry {
  id: string
  userId: string
  action: string
  resource: string
  resourceId?: string | null
  details?: unknown
  ipAddress?: string | null
  createdAt: string
  user: { name?: string | null; email: string }
}

interface Props {
  currentRole: string
}

const RESOURCES = ["", "users", "entries", "roles", "stats", "exports", "permissions"]
const PAGE_SIZE = 20

function actionColor(action: string): string {
  const lower = action.toLowerCase()
  if (lower.includes("create") || lower.includes("grant")) return "text-green-700 bg-green-50"
  if (lower.includes("update") || lower.includes("patch") || lower.includes("reset") || lower.includes("unsuspend")) return "text-blue-700 bg-blue-50"
  if (lower.includes("delete") || lower.includes("suspend") || lower.includes("revoke")) return "text-red-700 bg-red-50"
  return "text-gray-600 bg-gray-100"
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

export function ActivityLogClient({ currentRole: _currentRole }: Props) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [userSearch, setUserSearch] = useState("")
  const [resource, setResource] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const fetchLogs = useCallback(async (p: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(PAGE_SIZE) })
      if (userSearch) params.set("userId", userSearch)
      if (resource) params.set("resource", resource)
      if (dateFrom) params.set("dateFrom", dateFrom)
      if (dateTo) params.set("dateTo", dateTo)
      const res = await fetch(`/api/admin/activity?${params}`)
      const data = await res.json() as { logs: LogEntry[]; total: number }
      setLogs(data.logs ?? [])
      setTotal(data.total ?? 0)
    } finally {
      setLoading(false)
    }
  }, [userSearch, resource, dateFrom, dateTo])

  useEffect(() => { void fetchLogs(page) }, [fetchLogs, page])

  function applyFilters() { setPage(1); void fetchLogs(1) }

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Activity Log ({total})</h2>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="User ID or email…"
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          className="flex-1 min-w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        <select
          value={resource}
          onChange={(e) => setResource(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
        >
          {RESOURCES.map((r) => (
            <option key={r} value={r}>{r || "All Resources"}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
        />
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700 transition"
        >
          Filter
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Timestamp</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">User</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Action</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Resource</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">No activity found</td>
                </tr>
              ) : logs.map((log) => (
                <>
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      <span title={new Date(log.createdAt).toLocaleString("en-IN")}>
                        {relativeTime(log.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 text-xs">{log.user.name ?? "—"}</p>
                      <p className="text-xs text-gray-400">{log.user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${actionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 capitalize">
                      {log.resource}
                      {log.resourceId && <span className="text-gray-400"> #{log.resourceId.slice(0, 8)}</span>}
                    </td>
                    <td className="px-4 py-3">
                      {log.details ? (
                        <button
                          onClick={() => toggleExpand(log.id)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          {expanded.has(log.id) ? "Hide" : "View"}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                  {expanded.has(log.id) && log.details && (
                    <tr key={`${log.id}-details`}>
                      <td colSpan={5} className="px-4 py-2 bg-gray-50">
                        <pre className="text-xs text-gray-600 whitespace-pre-wrap break-all font-mono">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Page {page} of {totalPages}</span>
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
  )
}
