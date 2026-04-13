"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface District {
  id: string;
  nameEnglish: string;
  nameTamil: string;
}

interface Entry {
  id: string;
  serialNumber?: string | null;
  name?: string | null;
  contactNumber?: string | null;
  partyPosition?: string | null;
  isVerified: boolean;
  ocrStatus: string;
  createdAt: string;
  imageUrl: string;
  district?: { nameEnglish: string; nameTamil: string } | null;
  constituency?: { nameEnglish: string; nameTamil: string } | null;
  submittedBy?: { name?: string | null; email: string } | null;
}

interface Filters {
  search: string;
  districtId: string;
  constituencyId: string;
  status: string;
  verified: string;
}

interface Props {
  entries: Entry[];
  districts: District[];
  total: number;
  page: number;
  limit: number;
  filters: Filters;
  isAdmin: boolean;
  isSuperAdmin?: boolean;
}

export function EntriesClient({ entries, districts, total, page, limit, filters, isAdmin, isSuperAdmin }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState(filters.search);
  const [districtId, setDistrictId] = useState(filters.districtId);
  const [status, setStatus] = useState(filters.status);
  const [verified, setVerified] = useState(filters.verified);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    await fetch(`/api/entries/${id}`, { method: "DELETE" });
    setDeletingId(null);
    setConfirmId(null);
    startTransition(() => router.refresh());
  }

  function applyFilters(overrides: Partial<Filters> = {}) {
    const params = new URLSearchParams();
    const f = { search, districtId, status, verified, ...overrides };
    if (f.search) params.set("search", f.search);
    if (f.districtId) params.set("district", f.districtId);
    if (f.status) params.set("status", f.status);
    if (f.verified) params.set("verified", f.verified);
    params.set("page", "1");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  const totalPages = Math.ceil(total / limit);

  // ── USER VIEW: card-based review queue ────────────────────────
  if (!isAdmin) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Review Queue</h2>
            <p className="text-sm text-gray-500">{total} forms waiting for verification</p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search name, serial…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters({ search })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
            />
            <select
              value={districtId}
              onChange={(e) => { setDistrictId(e.target.value); applyFilters({ districtId: e.target.value }); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
            >
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>{d.nameEnglish}</option>
              ))}
            </select>
            <select
              value={verified}
              onChange={(e) => { setVerified(e.target.value); applyFilters({ verified: e.target.value }); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
            >
              <option value="false">Pending</option>
              <option value="true">Verified</option>
              <option value="">All</option>
            </select>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center text-gray-400">
            <p className="text-4xl mb-3">🎉</p>
            <p className="font-semibold text-gray-600">Queue is empty!</p>
            <p className="text-sm mt-1">No forms match the current filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {entries.map((entry, idx) => (
              <Link
                key={entry.id}
                href={`/entries/${entry.id}`}
                className="bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all group overflow-hidden flex flex-col"
              >
                {/* Form image thumbnail */}
                <div className="h-36 bg-gray-100 overflow-hidden relative">
                  <img
                    src={entry.imageUrl}
                    alt="Form"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white shadow text-xs font-bold flex items-center justify-center text-gray-600">
                    {(page - 1) * limit + idx + 1}
                  </div>
                  {entry.isVerified && (
                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      ✓ Verified
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col gap-1">
                  <p className="font-semibold text-gray-900 tamil-text truncate text-sm">
                    {entry.name ?? <span className="text-gray-400 italic font-normal">Name not extracted</span>}
                  </p>
                  {entry.serialNumber && (
                    <p className="text-xs font-mono text-gray-400">Serial: {entry.serialNumber}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {entry.district?.nameTamil ?? "—"}
                    {entry.constituency ? ` · ${entry.constituency.nameTamil}` : ""}
                  </p>
                  {entry.contactNumber && (
                    <p className="text-xs text-gray-500">{entry.contactNumber}</p>
                  )}
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {new Date(entry.createdAt).toLocaleDateString("en-IN")}
                    </span>
                    <span className="text-xs font-semibold text-blue-600 group-hover:underline">
                      Review →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} pathname={pathname} filters={filters} />}
      </div>
    );
  }

  // ── ADMIN VIEW: compact table ──────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search name, serial, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters({ search })}
            className="flex-1 min-w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={districtId}
            onChange={(e) => { setDistrictId(e.target.value); applyFilters({ districtId: e.target.value }); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
          >
            <option value="">All Districts</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>{d.nameEnglish}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); applyFilters({ status: e.target.value }); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
          >
            <option value="">All OCR Status</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
          </select>
          <select
            value={verified}
            onChange={(e) => { setVerified(e.target.value); applyFilters({ verified: e.target.value }); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
          >
            <option value="">All</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
          <button
            onClick={() => applyFilters({ search })}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition"
          >
            Search
          </button>
          <Link href="/upload" className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-400 transition ml-auto">
            + Upload Form
          </Link>
        </div>
      </div>

      <div className="text-sm text-gray-500 px-1">Showing {entries.length} of {total} entries</div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {entries.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-medium">No entries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 w-8">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 w-8"></th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Serial #</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">District</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Constituency</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Contact</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">OCR</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Verified</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3"></th>
                  {isSuperAdmin && <th className="px-4 py-3"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entries.map((entry, idx) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs font-mono text-gray-400 text-right">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-8 h-10 bg-gray-100 rounded overflow-hidden">
                        <img src={entry.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-500 text-xs">
                      {entry.serialNumber ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="tamil-text font-medium text-gray-900">
                        {entry.name ?? <span className="text-gray-300">—</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {entry.district ? <span className="tamil-text">{entry.district.nameTamil}</span> : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {entry.constituency ? <span className="tamil-text">{entry.constituency.nameTamil}</span> : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{entry.contactNumber ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        entry.ocrStatus === "COMPLETED" ? "bg-green-100 text-green-700" :
                        entry.ocrStatus === "FAILED" ? "bg-red-100 text-red-700" :
                        entry.ocrStatus === "PROCESSING" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-500"
                      }`}>
                        {entry.ocrStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {entry.isVerified
                        ? <span className="text-green-600 font-semibold text-xs">✓ Yes</span>
                        : <span className="text-gray-400 text-xs">Pending</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(entry.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/entries/${entry.id}`}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline whitespace-nowrap"
                      >
                        Open →
                      </Link>
                    </td>
                    {isSuperAdmin && (
                      <td className="px-4 py-3">
                        {confirmId === entry.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(entry.id)}
                              disabled={deletingId === entry.id}
                              className="text-xs px-2 py-1 bg-red-600 text-white rounded font-medium hover:bg-red-700 disabled:opacity-50"
                            >
                              {deletingId === entry.id ? "..." : "Confirm"}
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="text-xs px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmId(entry.id)}
                            className="text-xs text-red-500 hover:text-red-700 font-medium hover:underline"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} pathname={pathname} filters={filters} />}
    </div>
  );
}

function Pagination({
  page, totalPages, pathname, filters,
}: {
  page: number;
  totalPages: number;
  pathname: string;
  filters: Filters;
}) {
  const pages = Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      {pages.map((p) => (
        <Link
          key={p}
          href={`${pathname}?${new URLSearchParams({ ...filters, page: String(p) })}`}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition ${
            p === page
              ? "bg-slate-900 text-white"
              : "border border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {p}
        </Link>
      ))}
    </div>
  );
}
