"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ResultStatus = "COUNTING" | "LEADING" | "TRAILING" | "DECLARED";

interface Constituency {
  id: string;
  nameEnglish: string;
  nameTamil: string;
  district: { nameEnglish: string };
}

interface ElectionResult {
  id: string;
  year: number;
  electionType: string;
  constituencyId: string;
  constituency: {
    id: string;
    nameEnglish: string;
    nameTamil: string;
    district: { nameEnglish: string; nameTamil: string };
  };
  candidateName: string;
  candidatePhoto: string | null;
  partySymbol: string | null;
  vckVotes: number | null;
  totalVotes: number | null;
  winMargin: number | null;
  isWon: boolean;
  status: ResultStatus;
  rank1CandidateName: string | null;
  rank1Votes: number | null;
  updatedBy: { name: string | null; email: string } | null;
  updatedAt: string;
}

const STATUS_CONFIG: Record<ResultStatus, { label: string; bg: string; text: string }> = {
  COUNTING: { label: "Counting", bg: "bg-blue-100", text: "text-blue-700" },
  LEADING:  { label: "Leading",  bg: "bg-yellow-100", text: "text-yellow-700" },
  TRAILING: { label: "Trailing", bg: "bg-red-100",    text: "text-red-700" },
  DECLARED: { label: "Declared", bg: "bg-green-100",  text: "text-green-700" },
};

interface Props {
  results: ElectionResult[];
  constituencies: Constituency[];
  isSuperAdmin: boolean;
}

interface EditState {
  candidateName: string;
  vckVotes: string;
  totalVotes: string;
  winMargin: string;
  isWon: boolean;
  status: ResultStatus;
  rank1CandidateName: string;
  rank1Votes: string;
}

function toEditState(r: ElectionResult): EditState {
  return {
    candidateName:     r.candidateName,
    vckVotes:          r.vckVotes?.toString() ?? "",
    totalVotes:        r.totalVotes?.toString() ?? "",
    winMargin:         r.winMargin?.toString() ?? "",
    isWon:             r.isWon,
    status:            r.status,
    rank1CandidateName: r.rank1CandidateName ?? "",
    rank1Votes:        r.rank1Votes?.toString() ?? "",
  };
}

export function ElectionResultsAdmin({ results: initial, constituencies, isSuperAdmin }: Props) {
  const router = useRouter();
  const [results, setResults] = useState<ElectionResult[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addState, setAddState] = useState<{
    constituencyId: string;
    candidateName: string;
    vckVotes: string;
    totalVotes: string;
    winMargin: string;
    isWon: boolean;
    status: ResultStatus;
  }>({
    constituencyId: "",
    candidateName: "",
    vckVotes: "",
    totalVotes: "",
    winMargin: "",
    isWon: false,
    status: "COUNTING",
  });

  function startEdit(r: ElectionResult) {
    setEditingId(r.id);
    setEditState(toEditState(r));
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditState(null);
    setError(null);
  }

  async function saveEdit(id: string) {
    if (!editState) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/election-results/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName:      editState.candidateName,
          vckVotes:           editState.vckVotes   ? parseInt(editState.vckVotes)   : null,
          totalVotes:         editState.totalVotes  ? parseInt(editState.totalVotes) : null,
          winMargin:          editState.winMargin   ? parseInt(editState.winMargin)  : null,
          isWon:              editState.isWon,
          status:             editState.status,
          rank1CandidateName: editState.rank1CandidateName || null,
          rank1Votes:         editState.rank1Votes  ? parseInt(editState.rank1Votes) : null,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setResults((prev) => prev.map((r) => (r.id === id ? updated : r)));
      setEditingId(null);
      setEditState(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleAdd() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/election-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: 2026,
          electionType: "STATE",
          constituencyId: addState.constituencyId,
          candidateName:  addState.candidateName,
          vckVotes:       addState.vckVotes   ? parseInt(addState.vckVotes)   : null,
          totalVotes:     addState.totalVotes  ? parseInt(addState.totalVotes) : null,
          winMargin:      addState.winMargin   ? parseInt(addState.winMargin)  : null,
          isWon:          addState.isWon,
          status:         addState.status,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      router.refresh();
      setShowAddForm(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Add failed");
    } finally {
      setSaving(false);
    }
  }

  const wonCount   = results.filter((r) => r.isWon).length;
  const totalSeats = results.length;

  return (
    <div className="space-y-6">
      {/* Summary banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Seats" value={totalSeats} color="blue" />
        <StatCard label="Won" value={wonCount} color="green" />
        <StatCard label="Leading" value={results.filter((r) => r.status === "LEADING").length} color="yellow" />
        <StatCard label="Counting" value={results.filter((r) => r.status === "COUNTING").length} color="gray" />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {/* Add new result */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Constituency Results</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
        >
          {showAddForm ? "Cancel" : "+ Add Result"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="font-medium text-gray-900">Add New Constituency Result</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Constituency</label>
              <select
                value={addState.constituencyId}
                onChange={(e) => setAddState((s) => ({ ...s, constituencyId: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select constituency...</option>
                {constituencies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameEnglish} ({c.district.nameEnglish})
                  </option>
                ))}
              </select>
            </div>
            <FormField label="Candidate Name" value={addState.candidateName}
              onChange={(v) => setAddState((s) => ({ ...s, candidateName: v }))} />
            <FormField label="VCK Votes" type="number" value={addState.vckVotes}
              onChange={(v) => setAddState((s) => ({ ...s, vckVotes: v }))} />
            <FormField label="Total Votes" type="number" value={addState.totalVotes}
              onChange={(v) => setAddState((s) => ({ ...s, totalVotes: v }))} />
            <FormField label="Win Margin" type="number" value={addState.winMargin}
              onChange={(v) => setAddState((s) => ({ ...s, winMargin: v }))} />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <StatusSelect value={addState.status} onChange={(v) => setAddState((s) => ({ ...s, status: v }))} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={addState.isWon}
              onChange={(e) => setAddState((s) => ({ ...s, isWon: e.target.checked }))} />
            Mark as Won
          </label>
          <div className="flex gap-3">
            <button onClick={handleAdd} disabled={saving || !addState.constituencyId || !addState.candidateName}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50">
              {saving ? "Saving..." : "Add Result"}
            </button>
            <button onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Results table */}
      <div className="space-y-3">
        {results.map((r) => {
          const isEditing = editingId === r.id;
          const cfg = STATUS_CONFIG[r.status];

          return (
            <div key={r.id} className={`bg-white border rounded-xl overflow-hidden ${r.isWon ? "border-green-200" : "border-gray-200"}`}>
              {/* Header row */}
              <div className={`flex items-center justify-between px-5 py-3 ${r.isWon ? "bg-green-50" : "bg-gray-50"}`}>
                <div className="flex items-center gap-3">
                  {r.isWon && <span className="text-green-600 font-bold text-lg">✓</span>}
                  <div>
                    <p className="font-semibold text-gray-900">{r.constituency.nameEnglish}</p>
                    <p className="text-xs text-gray-500">{r.constituency.nameTamil} · {r.constituency.district.nameEnglish}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                    {cfg.label}
                  </span>
                  {!isEditing && (
                    <button onClick={() => startEdit(r)}
                      className="px-3 py-1.5 text-xs bg-slate-900 text-white rounded-lg hover:bg-slate-700">
                      Update
                    </button>
                  )}
                </div>
              </div>

              {/* Data row */}
              {!isEditing ? (
                <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <DataCell label="Candidate" value={r.candidateName} />
                  <DataCell label="VCK Votes" value={r.vckVotes?.toLocaleString("en-IN") ?? "—"} />
                  <DataCell label="Total Votes" value={r.totalVotes?.toLocaleString("en-IN") ?? "—"} />
                  <DataCell label="Win Margin" value={r.winMargin?.toLocaleString("en-IN") ?? "—"} highlight={!!r.winMargin} />
                  {r.rank1CandidateName && (
                    <DataCell label="Leading Opponent" value={`${r.rank1CandidateName} (${r.rank1Votes?.toLocaleString("en-IN") ?? "—"})`} />
                  )}
                  <div className="col-span-2 sm:col-span-4 text-xs text-gray-400 mt-1">
                    Last updated: {new Date(r.updatedAt).toLocaleString("en-IN")}
                    {r.updatedBy && ` by ${r.updatedBy.name ?? r.updatedBy.email}`}
                  </div>
                </div>
              ) : (
                /* Edit form */
                <div className="px-5 py-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Candidate Name" value={editState!.candidateName}
                      onChange={(v) => setEditState((s) => s ? { ...s, candidateName: v } : s)} />
                    <FormField label="VCK Votes" type="number" value={editState!.vckVotes}
                      onChange={(v) => setEditState((s) => s ? { ...s, vckVotes: v } : s)} />
                    <FormField label="Total Votes" type="number" value={editState!.totalVotes}
                      onChange={(v) => setEditState((s) => s ? { ...s, totalVotes: v } : s)} />
                    <FormField label="Win Margin" type="number" value={editState!.winMargin}
                      onChange={(v) => setEditState((s) => s ? { ...s, winMargin: v } : s)} />
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                      <StatusSelect value={editState!.status}
                        onChange={(v) => setEditState((s) => s ? { ...s, status: v } : s)} />
                    </div>
                    <FormField label="Opponent Name (rank 1)" value={editState!.rank1CandidateName}
                      onChange={(v) => setEditState((s) => s ? { ...s, rank1CandidateName: v } : s)} />
                    <FormField label="Opponent Votes" type="number" value={editState!.rank1Votes}
                      onChange={(v) => setEditState((s) => s ? { ...s, rank1Votes: v } : s)} />
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={editState!.isWon}
                      onChange={(e) => setEditState((s) => s ? { ...s, isWon: e.target.checked } : s)} />
                    Mark as Won
                  </label>
                  <div className="flex gap-3">
                    <button onClick={() => saveEdit(r.id)} disabled={saving}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50">
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {results.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            No election results yet. Click &quot;Add Result&quot; to get started.
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue:   "bg-blue-50 text-blue-700",
    green:  "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    gray:   "bg-gray-50 text-gray-700",
  };
  return (
    <div className={`rounded-xl p-4 ${colors[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium mt-0.5 opacity-70">{label}</p>
    </div>
  );
}

function DataCell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`font-medium ${highlight ? "text-green-700" : "text-gray-900"}`}>{value}</p>
    </div>
  );
}

function FormField({
  label, value, onChange, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
    </div>
  );
}

function StatusSelect({ value, onChange }: { value: ResultStatus; onChange: (v: ResultStatus) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ResultStatus)}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
    >
      <option value="COUNTING">Counting</option>
      <option value="LEADING">Leading</option>
      <option value="TRAILING">Trailing</option>
      <option value="DECLARED">Declared</option>
    </select>
  );
}
