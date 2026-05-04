"use client";

import { useEffect, useRef, useState } from "react";

type ResultStatus = "COUNTING" | "LEADING" | "TRAILING" | "DECLARED";

interface Comment {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
}

interface ElectionResult {
  id: string;
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
  updatedAt: string;
  constituency: {
    nameEnglish: string;
    nameTamil: string;
    district: { nameEnglish: string; nameTamil: string };
  };
}

const STATUS_CONFIG: Record<ResultStatus, { label: string; dot: string; badge: string }> = {
  COUNTING: { label: "Counting",  dot: "bg-blue-400 animate-pulse",  badge: "bg-blue-500/20 text-blue-300" },
  LEADING:  { label: "Leading",   dot: "bg-amber-400 animate-pulse", badge: "bg-amber-500/20 text-amber-300" },
  TRAILING: { label: "Trailing",  dot: "bg-red-400",                 badge: "bg-red-500/20 text-red-300" },
  DECLARED: { label: "Declared",  dot: "bg-green-400",               badge: "bg-green-500/20 text-green-300" },
};

export function ElectionResultsClient() {
  const [results, setResults] = useState<ElectionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  async function fetchResults() {
    try {
      const res = await fetch("/api/public/election-results?year=2026", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setLastRefresh(new Date());
      }
    } catch {
      // silently retry on next interval
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchResults();
    const id = setInterval(fetchResults, 10 * 60_000);
    return () => clearInterval(id);
  }, []);

  const won      = results.filter((r) => r.isWon).length;
  const leading  = results.filter((r) => r.status === "LEADING").length;
  const counting = results.filter((r) => r.status === "COUNTING").length;
  const hasLive  = results.some((r) => r.status === "COUNTING" || r.status === "LEADING");

  return (
    <section className="bg-[#0A1628] min-h-screen">
      {/* ── Hero ─────────────────────────────────────── */}
      <div className="pt-16 pb-10 px-6 text-center border-b border-white/10">
        <p
          className="text-[#C41E1E] text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ fontFamily: "var(--font-body)" }}
        >
          விடுதலைச் சிறுத்தைகள் கட்சி
        </p>
        <h1
          className="text-white font-black text-4xl lg:text-6xl mb-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          தேர்தல் முடிவுகள் 2026
        </h1>
        <p className="text-white/50 text-sm">Tamil Nadu State Assembly Election · VCK Results</p>

        <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full bg-white/10 text-white/60 text-xs">
          {hasLive ? (
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
          )}
          {hasLive
            ? `Live · auto-refreshes every 10 mins${lastRefresh ? " · " + lastRefresh.toLocaleTimeString("en-IN") : ""}`
            : "Results declared"}
        </div>

        {/* Summary pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Pill value={results.length} label="Seats" color="white" />
          <Pill value={won}      label="Won 🏆"   color="green" />
          <Pill value={leading}  label="Leading"  color="amber" />
          <Pill value={counting} label="Counting" color="blue" />
        </div>
      </div>

      {/* ── Cards ─────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3 text-white/40">
            <span className="w-3 h-3 rounded-full bg-white/30 animate-pulse" />
            <span className="w-3 h-3 rounded-full bg-white/30 animate-pulse delay-150" />
            <span className="w-3 h-3 rounded-full bg-white/30 animate-pulse delay-300" />
            <span className="ml-2 text-sm">Loading results…</span>
          </div>
        )}

        {!loading && results.length === 0 && (
          <p className="text-center py-20 text-white/30 text-lg">
            Results not yet available. Check back soon.
          </p>
        )}

        {results.map((r) => (
          <ResultCard key={r.id} result={r} />
        ))}
      </div>
    </section>
  );
}

/* ── Individual result card ─────────────────────────────── */
function ResultCard({ result: r }: { result: ElectionResult }) {
  const cfg   = STATUS_CONFIG[r.status];
  const vckV  = r.vckVotes ?? 0;
  const oppV  = r.rank1Votes ?? 0;
  const tvkV  = r.rank2Votes ?? 0;
  const maxV  = Math.max(vckV, oppV, tvkV, 1);
  const diff  = vckV - oppV;
  const voteShare = vckV && r.totalVotes
    ? ((vckV / r.totalVotes) * 100).toFixed(1)
    : null;
  const hasTVK = !!(r.rank2CandidateName);

  return (
    <div
      className={`rounded-3xl overflow-hidden border ${
        r.isWon ? "border-green-500/40" : "border-white/10"
      }`}
    >
      {/* Card header */}
      <div
        className={`flex items-center justify-between px-6 py-4 ${
          r.isWon
            ? "bg-green-900/40"
            : "bg-white/5"
        }`}
      >
        <div>
          <p
            className="font-black text-white text-xl leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {r.constituency.nameTamil}
          </p>
          <p className="text-white/50 text-sm mt-0.5">
            {r.constituency.nameEnglish} · {r.constituency.district.nameEnglish}
          </p>
          {r.totalRounds != null && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: r.totalRounds }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-4 rounded-full ${
                      r.currentRound != null && i < r.currentRound
                        ? "bg-amber-400"
                        : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
              <span className="text-white/50 text-xs">
                Round {r.currentRound ?? 0} / {r.totalRounds}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.badge}`}>
            {cfg.label}
          </span>
          {r.isWon && <span className="text-xl ml-1">🏆</span>}
        </div>
      </div>

      {/* Card body */}
      <div className="bg-[#0D1F3C] px-6 py-6 space-y-6">
        {/* Candidate vs Opponent(s) */}
        <div className={`grid gap-4 sm:gap-6 ${hasTVK ? "grid-cols-3" : "grid-cols-2"}`}>
          {/* VCK candidate */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="relative">
              {r.candidatePhoto ? (
                <img
                  src={r.candidatePhoto}
                  alt={r.candidateName}
                  className="w-18 h-18 sm:w-22 sm:h-22 rounded-full object-cover border-4 border-[#C41E1E] shadow-lg"
                />
              ) : (
                <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-red-900 flex items-center justify-center border-4 border-[#C41E1E] shadow-lg" style={{ width: "4.5rem", height: "4.5rem" }}>
                  <span className="text-white font-black text-2xl">
                    {r.candidateName[0]}
                  </span>
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 bg-[#C41E1E] text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                VCK
              </span>
            </div>
            <div>
              <p
                className="text-white font-bold text-sm leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {r.candidateName}
              </p>
              <p className="text-red-400 text-xs font-medium mt-0.5">விடுதலைச் சிறுத்தைகள்</p>
              {vckV > 0 && (
                <p className="text-white font-black text-base mt-1">
                  {vckV.toLocaleString("en-IN")}
                  {voteShare && (
                    <span className="text-white/50 text-xs font-normal ml-1">({voteShare}%)</span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Opponent (rank 1) */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="relative">
              {r.opponentPhoto ? (
                <img
                  src={r.opponentPhoto}
                  alt={r.rank1CandidateName ?? "Opponent"}
                  className="w-18 h-18 sm:w-22 sm:h-22 rounded-full object-cover border-4 border-white/20 shadow-lg"
                />
              ) : (
                <div className="rounded-full bg-slate-700 flex items-center justify-center border-4 border-white/20 shadow-lg" style={{ width: "4.5rem", height: "4.5rem" }}>
                  <span className="text-white/60 font-black text-2xl">
                    {r.rank1CandidateName?.[0] ?? "?"}
                  </span>
                </div>
              )}
              {r.opponentParty && (
                <span className="absolute -bottom-1 -right-1 bg-slate-600 text-white/80 text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                  {r.opponentParty}
                </span>
              )}
            </div>
            <div>
              <p
                className="text-white/80 font-bold text-sm leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {r.rank1CandidateName ?? "Opponent"}
              </p>
              <p className="text-white/40 text-xs mt-0.5">{r.opponentParty ?? "Opposition"}</p>
              {oppV > 0 && (
                <p className="text-white/70 font-black text-base mt-1">
                  {oppV.toLocaleString("en-IN")}
                </p>
              )}
            </div>
          </div>

          {/* TVK candidate (rank 2) */}
          {hasTVK && (
            <div className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                {r.rank2Photo ? (
                  <img
                    src={r.rank2Photo}
                    alt={r.rank2CandidateName ?? "TVK"}
                    className="rounded-full object-cover border-4 border-yellow-500/60 shadow-lg"
                    style={{ width: "4.5rem", height: "4.5rem" }}
                  />
                ) : (
                  <div className="rounded-full bg-yellow-900/40 flex items-center justify-center border-4 border-yellow-500/60 shadow-lg" style={{ width: "4.5rem", height: "4.5rem" }}>
                    <span className="text-yellow-300 font-black text-2xl">
                      {r.rank2CandidateName?.[0] ?? "T"}
                    </span>
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 bg-yellow-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                  {r.rank2Party ?? "TVK"}
                </span>
              </div>
              <div>
                <p
                  className="text-white/80 font-bold text-sm leading-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {r.rank2CandidateName}
                </p>
                <p className="text-yellow-400/70 text-xs mt-0.5">{r.rank2Party ?? "TVK"}</p>
                {tvkV > 0 && (
                  <p className="text-white/70 font-black text-base mt-1">
                    {tvkV.toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vote bars + difference — only show when we have actual votes */}
        {(vckV > 0 || oppV > 0 || tvkV > 0) && (
          <div className="space-y-3">
            <VoteBar label="VCK" votes={vckV} max={maxV} color="bg-red-500" />
            <VoteBar
              label={r.opponentParty ?? "Opp"}
              votes={oppV}
              max={maxV}
              color="bg-slate-500"
            />
            {hasTVK && tvkV >= 0 && (
              <VoteBar
                label={r.rank2Party ?? "TVK"}
                votes={tvkV}
                max={maxV}
                color="bg-yellow-500"
              />
            )}
            <div
              className={`rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 ${
                diff >= 0
                  ? "bg-green-500/15 border border-green-500/30"
                  : "bg-red-500/15 border border-red-500/30"
              }`}
            >
              <span className={`text-lg font-black ${diff >= 0 ? "text-green-400" : "text-red-400"}`}>
                {diff >= 0 ? "+" : ""}{diff.toLocaleString("en-IN")}
              </span>
              <span className="text-white/50 text-xs">votes {diff >= 0 ? "ahead" : "behind"} {r.opponentParty ?? "opponent"}</span>
              {r.totalVotes && (
                <span className="text-white/30 text-xs ml-2">
                  of {r.totalVotes.toLocaleString("en-IN")} total
                </span>
              )}
            </div>
          </div>
        )}

        {/* Counting state — no votes yet */}
        {vckV === 0 && oppV === 0 && tvkV === 0 && (
          <div className="flex items-center justify-center gap-2 py-3 text-white/30 text-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Counting in progress — results will appear here
          </div>
        )}

        {/* Comments */}
        <CommentSection resultId={r.id} />
      </div>
    </div>
  );
}

/* ── Vote bar ───────────────────────────────────────────── */
function VoteBar({
  label, votes, max, color,
}: {
  label: string; votes: number; max: number; color: string;
}) {
  const pct = max > 0 ? Math.round((votes / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-white/50 w-10 shrink-0 truncate">{label}</span>
      <div className="flex-1 bg-white/10 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bold text-white w-20 text-right shrink-0">
        {votes.toLocaleString("en-IN")}
      </span>
    </div>
  );
}

/* ── Comment section ────────────────────────────────────── */
function CommentSection({ resultId }: { resultId: string }) {
  const [open, setOpen]           = useState(false);
  const [comments, setComments]   = useState<Comment[]>([]);
  const [loadingC, setLoadingC]   = useState(false);
  const [name, setName]           = useState("");
  const [body, setBody]           = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr]             = useState<string | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  async function loadComments() {
    setLoadingC(true);
    try {
      const res = await fetch(`/api/public/election-comments?resultId=${resultId}`);
      if (res.ok) setComments(await res.json());
    } finally {
      setLoadingC(false);
    }
  }

  function toggle() {
    if (!open && comments.length === 0) loadComments();
    setOpen((o) => !o);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setSubmitting(true);
    setErr(null);
    try {
      const res = await fetch("/api/public/election-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ electionResultId: resultId, authorName: name, commentBody: body }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed");
      }
      setSubmitted(true);
      setName("");
      setBody("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="border-t border-white/10 pt-5 space-y-4">
      <button
        onClick={toggle}
        className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
      >
        <span>💬</span>
        <span>{open ? "Hide comments" : "Comments & reactions"}</span>
        <span className="text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="space-y-4">
          {loadingC && (
            <p className="text-white/30 text-sm">Loading…</p>
          )}

          {!loadingC && comments.length > 0 && (
            <div className="space-y-3" data-lenis-prevent>
              {comments.map((c) => (
                <div key={c.id} className="bg-white/5 rounded-xl px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white/80 text-xs font-semibold">{c.authorName}</p>
                    <p className="text-white/30 text-xs">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short",
                      })}
                    </p>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          )}

          {!loadingC && comments.length === 0 && (
            <p className="text-white/30 text-sm">No comments yet. Be the first!</p>
          )}

          {submitted ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 text-sm">
              ✓ Comment submitted — will appear after approval.
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                maxLength={60}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/40"
              />
              <textarea
                ref={textRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Share your thoughts… (max 500 chars)"
                maxLength={500}
                rows={3}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/40 resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-white/30 text-xs">{body.length}/500</span>
                <div className="flex items-center gap-3">
                  {err && <span className="text-red-400 text-xs">{err}</span>}
                  <button
                    type="submit"
                    disabled={submitting || !name.trim() || !body.trim()}
                    className="px-4 py-2 bg-[#C41E1E] text-white text-xs font-bold rounded-lg hover:bg-red-700 disabled:opacity-40 transition-colors"
                  >
                    {submitting ? "Submitting…" : "Post Comment"}
                  </button>
                </div>
              </div>
              <p className="text-white/25 text-xs">Comments are reviewed before being published.</p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Summary pill ──────────────────────────────────────── */
function Pill({ value, label, color }: { value: number; label: string; color: string }) {
  const colors: Record<string, string> = {
    white: "bg-white/10 text-white",
    green: "bg-green-500/20 text-green-300",
    amber: "bg-amber-500/20 text-amber-300",
    blue:  "bg-blue-500/20 text-blue-300",
  };
  return (
    <div className={`px-5 py-2 rounded-full ${colors[color]} text-sm font-bold`}>
      {value} {label}
    </div>
  );
}
