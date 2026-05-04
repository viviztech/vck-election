"use client";

import { useState } from "react";

type ResultStatus = "COUNTING" | "LEADING" | "TRAILING" | "DECLARED";

interface ElectionResult {
  id: string;
  constituencyId: string;
  constituency: {
    id: string;
    nameEnglish: string;
    nameTamil: string;
    district: { nameEnglish: string; nameTamil: string };
  };
  candidateName: string;
  candidatePhoto: string | null;
  vckVotes: number | null;
  totalVotes: number | null;
  winMargin: number | null;
  isWon: boolean;
  status: ResultStatus;
  rank1CandidateName: string | null;
  rank1Votes: number | null;
  opponentParty: string | null;
  opponentPhoto: string | null;
  rank2CandidateName: string | null;
  rank2Votes: number | null;
  rank2Party: string | null;
  rank2Photo: string | null;
  totalRounds: number | null;
  currentRound: number | null;
  updatedBy: { name: string | null; email: string } | null;
  updatedAt: string;
  _count: { comments: number };
}

interface EditState {
  candidateName: string;
  candidatePhoto: string;
  vckVotes: string;
  totalVotes: string;
  winMargin: string;
  isWon: boolean;
  status: ResultStatus;
  rank1CandidateName: string;
  rank1Votes: string;
  opponentParty: string;
  opponentPhoto: string;
  rank2CandidateName: string;
  rank2Votes: string;
  rank2Party: string;
  rank2Photo: string;
  totalRounds: string;
  currentRound: string;
}

const STATUS_CONFIG: Record<ResultStatus, { label: string; bg: string; text: string; border: string }> = {
  COUNTING: { label: "Counting", bg: "bg-blue-50",   text: "text-blue-700",  border: "border-blue-200" },
  LEADING:  { label: "Leading",  bg: "bg-amber-50",  text: "text-amber-700", border: "border-amber-200" },
  TRAILING: { label: "Trailing", bg: "bg-red-50",    text: "text-red-700",   border: "border-red-200" },
  DECLARED: { label: "Declared", bg: "bg-green-50",  text: "text-green-700", border: "border-green-200" },
};

function toEditState(r: ElectionResult): EditState {
  return {
    candidateName:      r.candidateName,
    candidatePhoto:     r.candidatePhoto ?? "",
    vckVotes:           r.vckVotes?.toString() ?? "",
    totalVotes:         r.totalVotes?.toString() ?? "",
    winMargin:          r.winMargin?.toString() ?? "",
    isWon:              r.isWon,
    status:             r.status,
    rank1CandidateName: r.rank1CandidateName ?? "",
    rank1Votes:         r.rank1Votes?.toString() ?? "",
    opponentParty:      r.opponentParty ?? "",
    opponentPhoto:      r.opponentPhoto ?? "",
    rank2CandidateName: r.rank2CandidateName ?? "",
    rank2Votes:         r.rank2Votes?.toString() ?? "",
    rank2Party:         r.rank2Party ?? "",
    rank2Photo:         r.rank2Photo ?? "",
    totalRounds:        r.totalRounds?.toString() ?? "",
    currentRound:       r.currentRound?.toString() ?? "",
  };
}

export function ElectionResultsAdmin({ results: initial, isSuperAdmin }: { results: ElectionResult[]; isSuperAdmin: boolean }) {
  const [results, setResults] = useState<ElectionResult[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  function patch<K extends keyof EditState>(key: K, value: EditState[K]) {
    setEditState((s) => (s ? { ...s, [key]: value } : s));
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
          candidatePhoto:     editState.candidatePhoto || null,
          vckVotes:           editState.vckVotes    ? parseInt(editState.vckVotes)    : null,
          totalVotes:         editState.totalVotes   ? parseInt(editState.totalVotes)  : null,
          winMargin:          editState.winMargin    ? parseInt(editState.winMargin)   : null,
          isWon:              editState.isWon,
          status:             editState.status,
          rank1CandidateName: editState.rank1CandidateName || null,
          rank1Votes:         editState.rank1Votes   ? parseInt(editState.rank1Votes)  : null,
          opponentParty:      editState.opponentParty || null,
          opponentPhoto:      editState.opponentPhoto || null,
          rank2CandidateName: editState.rank2CandidateName || null,
          rank2Votes:         editState.rank2Votes   ? parseInt(editState.rank2Votes)  : null,
          rank2Party:         editState.rank2Party || null,
          rank2Photo:         editState.rank2Photo || null,
          totalRounds:        editState.totalRounds  ? parseInt(editState.totalRounds) : null,
          currentRound:       editState.currentRound ? parseInt(editState.currentRound): null,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setResults((prev) =>
        prev.map((r) => (r.id === id ? { ...updated, _count: r._count } : r))
      );
      setEditingId(null);
      setEditState(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const totalVotes   = results.reduce((s, r) => s + (r.vckVotes ?? 0), 0);
  const totalOpponent = results.reduce((s, r) => s + (r.rank1Votes ?? 0), 0);
  const totalMargin  = totalVotes - totalOpponent;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Summary banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard value={results.length} label="Total Seats" sub="VCK Fought" color="slate" />
        <StatCard value={results.filter((r) => r.isWon).length} label="Won" sub="Declared" color="green" />
        <StatCard value={totalVotes > 0 ? totalVotes.toLocaleString("en-IN") : "—"} label="VCK Total Votes" sub="All 8 seats" color="blue" />
        <StatCard value={totalMargin > 0 ? "+" + totalMargin.toLocaleString("en-IN") : "—"} label="Combined Margin" sub="vs opponent" color="emerald" />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">8 VCK Won Constituencies</h2>
        <p className="text-xs text-gray-400">Click &quot;Update&quot; on any card to edit vote counts</p>
      </div>

      <div className="space-y-4">
        {results.map((r) => {
          const isEditing = editingId === r.id;
          const cfg = STATUS_CONFIG[r.status];
          const vckV   = r.vckVotes ?? 0;
          const oppV   = r.rank1Votes ?? 0;
          const tvkV   = r.rank2Votes ?? 0;
          const maxV   = Math.max(vckV, oppV, tvkV, 1);
          const diff   = vckV - oppV;
          const diffTVK = vckV - tvkV;
          const hasTVK = !!(r.rank2CandidateName);
          const voteShare = r.vckVotes && r.totalVotes
            ? ((r.vckVotes / r.totalVotes) * 100).toFixed(1)
            : null;

          return (
            <div
              key={r.id}
              className={`bg-white border-2 rounded-2xl overflow-hidden ${
                r.isWon ? "border-green-300" : cfg.border
              }`}
            >
              {/* Card header */}
              <div className={`flex items-center justify-between px-5 py-3 ${r.isWon ? "bg-green-50" : cfg.bg}`}>
                <div className="flex items-center gap-3">
                  {r.isWon && (
                    <span className="text-xl" title="Won">🏆</span>
                  )}
                  <div>
                    <p className="font-bold text-gray-900 text-base">{r.constituency.nameEnglish}</p>
                    <p className="text-xs text-gray-500">{r.constituency.nameTamil} · {r.constituency.district.nameEnglish}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                    {cfg.label}
                  </span>
                  {r._count.comments > 0 && (
                    <span className="text-xs text-gray-400">💬 {r._count.comments}</span>
                  )}
                  {!isEditing && (
                    <button
                      onClick={() => startEdit(r)}
                      className="px-3 py-1.5 text-xs bg-slate-900 text-white rounded-lg hover:bg-slate-700"
                    >
                      Update
                    </button>
                  )}
                </div>
              </div>

              {!isEditing ? (
                <div className="px-5 py-4 space-y-4">
                  {/* Candidate row — VCK | Rank-1 | TVK */}
                  <div className={`grid gap-4 ${hasTVK ? "grid-cols-3" : "grid-cols-2"}`}>
                    {/* VCK candidate */}
                    <div className="flex items-center gap-3">
                      {r.candidatePhoto ? (
                        <img src={r.candidatePhoto} alt={r.candidateName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-red-300 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0 border-2 border-red-300">
                          <span className="text-red-600 font-bold text-lg">{r.candidateName[0]}</span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 text-sm leading-tight">{r.candidateName}</p>
                        <p className="text-xs text-red-600 font-medium">VCK</p>
                        {r.vckVotes != null && (
                          <p className="text-sm font-bold text-gray-800 mt-0.5">
                            {r.vckVotes.toLocaleString("en-IN")}
                            {voteShare && <span className="text-xs font-normal text-gray-500 ml-1">({voteShare}%)</span>}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Opponent (rank 1) */}
                    <div className="flex items-center gap-3">
                      {r.opponentPhoto ? (
                        <img src={r.opponentPhoto} alt={r.rank1CandidateName ?? "Opponent"}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border-2 border-gray-300">
                          <span className="text-gray-500 font-bold text-lg">
                            {r.rank1CandidateName?.[0] ?? "?"}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 text-sm leading-tight">
                          {r.rank1CandidateName ?? "Opponent"}
                        </p>
                        <p className="text-xs text-gray-500">{r.opponentParty ?? "—"}</p>
                        {r.rank1Votes != null && (
                          <p className="text-sm font-bold text-gray-800 mt-0.5">
                            {r.rank1Votes.toLocaleString("en-IN")}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* TVK (rank 2) */}
                    {hasTVK && (
                      <div className="flex items-center gap-3">
                        {r.rank2Photo ? (
                          <img src={r.rank2Photo} alt={r.rank2CandidateName ?? "TVK"}
                            className="w-12 h-12 rounded-full object-cover border-2 border-yellow-300 shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center shrink-0 border-2 border-yellow-300">
                            <span className="text-yellow-600 font-bold text-lg">
                              {r.rank2CandidateName?.[0] ?? "T"}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 text-sm leading-tight">
                            {r.rank2CandidateName}
                          </p>
                          <p className="text-xs text-yellow-600 font-medium">{r.rank2Party ?? "TVK"}</p>
                          {r.rank2Votes != null && (
                            <p className="text-sm font-bold text-gray-800 mt-0.5">
                              {r.rank2Votes.toLocaleString("en-IN")}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Vote comparison bars */}
                  {(vckV > 0 || oppV > 0 || tvkV > 0) && (
                    <div className="space-y-2">
                      <VoteBar label="VCK" votes={vckV} max={maxV} color="bg-red-500" />
                      <VoteBar label={r.opponentParty ?? "Opponent"} votes={oppV} max={maxV} color="bg-gray-400" />
                      {hasTVK && (
                        <VoteBar label={r.rank2Party ?? "TVK"} votes={tvkV} max={maxV} color="bg-yellow-400" />
                      )}
                      <div className={`text-sm font-bold text-center py-1.5 rounded-lg ${diff >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                        vs {r.opponentParty ?? "Opp"}: {diff >= 0 ? "+" : ""}{diff.toLocaleString("en-IN")}
                      </div>
                      {hasTVK && (vckV > 0 || tvkV > 0) && (
                        <div className={`text-sm font-bold text-center py-1.5 rounded-lg ${diffTVK >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                          vs {r.rank2Party ?? "TVK"}: {diffTVK >= 0 ? "+" : ""}{diffTVK.toLocaleString("en-IN")}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4 flex-wrap">
                    {(r.totalRounds != null) && (
                      <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                        Round {r.currentRound ?? "?"} / {r.totalRounds}
                      </span>
                    )}
                    <p className="text-xs text-gray-400">
                      Updated {new Date(r.updatedAt).toLocaleString("en-IN")}
                      {r.updatedBy && ` by ${r.updatedBy.name ?? r.updatedBy.email}`}
                    </p>
                  </div>
                </div>
              ) : (
                /* Edit form */
                <div className="px-5 py-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
                    <fieldset className="space-y-3 border border-red-200 rounded-xl p-4">
                      <legend className="text-xs font-bold text-red-600 px-1">VCK Candidate</legend>
                      <FormField label="Candidate Name" value={editState!.candidateName}
                        onChange={(v) => patch("candidateName", v)} />
                      <FormField label="Candidate Photo URL" value={editState!.candidatePhoto}
                        onChange={(v) => patch("candidatePhoto", v)} placeholder="https://..." />
                      <FormField label="VCK Votes" type="number" value={editState!.vckVotes}
                        onChange={(v) => patch("vckVotes", v)} />
                    </fieldset>

                    <fieldset className="space-y-3 border border-gray-200 rounded-xl p-4">
                      <legend className="text-xs font-bold text-gray-500 px-1">Opponent (Rank 1)</legend>
                      <FormField label="Opponent Name" value={editState!.rank1CandidateName}
                        onChange={(v) => patch("rank1CandidateName", v)} />
                      <FormField label="Opponent Party" value={editState!.opponentParty}
                        onChange={(v) => patch("opponentParty", v)} placeholder="e.g. AIADMK" />
                      <FormField label="Opponent Photo URL" value={editState!.opponentPhoto}
                        onChange={(v) => patch("opponentPhoto", v)} placeholder="https://..." />
                      <FormField label="Opponent Votes" type="number" value={editState!.rank1Votes}
                        onChange={(v) => patch("rank1Votes", v)} />
                    </fieldset>

                    <fieldset className="space-y-3 border border-yellow-200 rounded-xl p-4">
                      <legend className="text-xs font-bold text-yellow-600 px-1">TVK Candidate (Rank 2)</legend>
                      <FormField label="TVK Candidate Name" value={editState!.rank2CandidateName}
                        onChange={(v) => patch("rank2CandidateName", v)} />
                      <FormField label="Party" value={editState!.rank2Party}
                        onChange={(v) => patch("rank2Party", v)} placeholder="TVK" />
                      <FormField label="Photo URL" value={editState!.rank2Photo}
                        onChange={(v) => patch("rank2Photo", v)} placeholder="https://..." />
                      <FormField label="TVK Votes" type="number" value={editState!.rank2Votes}
                        onChange={(v) => patch("rank2Votes", v)} />
                    </fieldset>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <FormField label="Total Votes" type="number" value={editState!.totalVotes}
                      onChange={(v) => patch("totalVotes", v)} />
                    <FormField label="Win Margin" type="number" value={editState!.winMargin}
                      onChange={(v) => patch("winMargin", v)} />
                    <FormField label="Total Rounds" type="number" value={editState!.totalRounds}
                      onChange={(v) => patch("totalRounds", v)} placeholder="e.g. 14" />
                    <FormField label="Current Round" type="number" value={editState!.currentRound}
                      onChange={(v) => patch("currentRound", v)} placeholder="e.g. 7" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                    <StatusSelect value={editState!.status} onChange={(v) => patch("status", v)} />
                  </div>

                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={editState!.isWon}
                      onChange={(e) => patch("isWon", e.target.checked)}
                      className="w-4 h-4 accent-green-600" />
                    Mark as Won 🏆
                  </label>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => saveEdit(r.id)} disabled={saving}
                      className="px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50">
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button onClick={cancelEdit}
                      className="px-5 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VoteBar({ label, votes, max, color }: { label: string; votes: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((votes / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-20 shrink-0 truncate">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-700 w-20 text-right shrink-0">
        {votes.toLocaleString("en-IN")}
      </span>
    </div>
  );
}

function StatCard({ value, label, sub, color }: { value: string | number; label: string; sub: string; color: string }) {
  const colors: Record<string, string> = {
    slate:   "bg-slate-50 text-slate-800",
    green:   "bg-green-50 text-green-800",
    blue:    "bg-blue-50 text-blue-800",
    emerald: "bg-emerald-50 text-emerald-800",
  };
  return (
    <div className={`rounded-xl p-4 ${colors[color]}`}>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-semibold mt-0.5">{label}</p>
      <p className="text-xs opacity-60">{sub}</p>
    </div>
  );
}

function FormField({
  label, value, onChange, type = "text", placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
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
