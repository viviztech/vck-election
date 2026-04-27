"use client";

import { useCallback, useEffect, useState } from "react";

interface Volunteer {
  id: string;
  name: string | null;
  age: number | null;
  phone: string;
  education: string;
  district: string;
  constituency: string;
  itKnowledge: boolean;
  videoCreation: boolean;
  imageCreation: boolean;
  joinReason: string;
  createdAt: string;
}

const PAGE_SIZE = 20;

function Badge({ yes }: { yes: boolean }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
        yes ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
      }`}
    >
      {yes ? "ஆம்" : "இல்லை"}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-full" />
        </td>
      ))}
    </tr>
  );
}

export function ItWingVolunteersClient() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [draftSearch, setDraftSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);

    const res = await fetch(`/api/admin/it-wing-volunteers?${params}`);
    if (res.ok) {
      const data = await res.json();
      setVolunteers(data.volunteers);
      setTotal(data.total);
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(draftSearch);
  }

  function handleExport() {
    const params = new URLSearchParams({ format: "csv" });
    if (search) params.set("search", search);
    window.location.href = `/api/admin/it-wing-volunteers?${params}`;
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
            placeholder="பெயர், தொலைபேசி, மாவட்டம்..."
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 w-72"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition"
          >
            தேடு
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setDraftSearch(""); setSearch(""); setPage(1); }}
              className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50"
            >
              ×
            </button>
          )}
        </form>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            மொத்தம்: <strong>{total}</strong>
          </span>
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2"
          >
            ⬇ CSV ஏற்றுமதி
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left">
                <th className="px-4 py-3 font-semibold text-gray-600">#</th>
                <th className="px-4 py-3 font-semibold text-gray-600">பெயர்</th>
                <th className="px-4 py-3 font-semibold text-gray-600">தொலைபேசி</th>
                <th className="px-4 py-3 font-semibold text-gray-600">மாவட்டம்</th>
                <th className="px-4 py-3 font-semibold text-gray-600">தொகுதி</th>
                <th className="px-4 py-3 font-semibold text-gray-600">IT</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Video</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Image</th>
                <th className="px-4 py-3 font-semibold text-gray-600">தேதி</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              ) : volunteers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                    தன்னார்வலர்கள் இல்லை
                  </td>
                </tr>
              ) : (
                volunteers.map((v, idx) => (
                  <>
                    <tr
                      key={v.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setExpanded(expanded === v.id ? null : v.id)}
                    >
                      <td className="px-4 py-3 text-gray-400">
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <div>{v.name ?? <span className="text-gray-400 italic">—</span>}</div>
                        {v.age && <div className="text-xs text-gray-400">வயது: {v.age}</div>}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{v.phone}</td>
                      <td className="px-4 py-3 text-gray-700">{v.district}</td>
                      <td className="px-4 py-3 text-gray-700">{v.constituency}</td>
                      <td className="px-4 py-3"><Badge yes={v.itKnowledge} /></td>
                      <td className="px-4 py-3"><Badge yes={v.videoCreation} /></td>
                      <td className="px-4 py-3"><Badge yes={v.imageCreation} /></td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(v.createdAt).toLocaleDateString("ta-IN")}
                      </td>
                    </tr>
                    {expanded === v.id && (
                      <tr key={`${v.id}-detail`} className="bg-blue-50">
                        <td colSpan={9} className="px-6 py-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">கல்வித்தகுதி</p>
                              <p className="text-sm text-gray-800">{v.education}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">இணைய காரணம்</p>
                              <p className="text-sm text-gray-800 whitespace-pre-wrap">{v.joinReason}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
          >
            ← முந்தைய
          </button>
          <span className="text-sm text-gray-500">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
          >
            அடுத்த →
          </button>
        </div>
      )}
    </div>
  );
}
