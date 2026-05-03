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
  updatedAt: string;
  constituency: {
    nameEnglish: string;
    nameTamil: string;
    district: { nameEnglish: string; nameTamil: string };
  };
  comments: Comment[];
  _count: { comments: number };
}

const STATUS_CONFIG: Record<ResultStatus, { label: string; dot: string; badge: string }> = {
  COUNTING: { label: "Counting",  dot: "bg-blue-400 animate-pulse",  badge: "bg-blue-500/20 text-blue-300" },
  LEADING:  { label: "Leading",   dot: "bg-amber-400 animate-pulse", badge: "bg-amber-500/20 text-amber-300" },
  TRAILING: { label: "Trailing",  dot: "bg-red-400",                 badge: "bg-red-500/20 text-red-300" },
  DECLARED: { label: "Declared",  dot: "bg-green-400",               badge: "bg-green-500/20 text-green-300" },
};

interface Props {
  initialResults: ElectionResult[];
  hasLiveResults: boolean;
}

export function ElectionResultsClient({ initialResults, hasLiveResults }: Props) {
  const [results, setResults] = useState<ElectionResult[]>(initialResults);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    if (!hasLiveResults) return;
    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/public/election-results?year=2026", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setResults((prev) =>
            data.map((d: ElectionResult) => {
              const existing = prev.find((p) => p.id === d.id);
              return { ...d, comments: existing?.comments ?? [] };
            })
          );
          setLastRefresh(new Date());
        }
      } catch {
        // ignore
      }
    }, 30_000);
    return () => clearInterval(id);
  }, [hasLiveResults]);

  const won     = results.filter((r) => r.isWon).length;
  const leading = results.filter((r) => r.status === "LEADING").length;
  const counting = results.filter((r) => r.status === "COUNTING").length;

  return (
    <section className="bg-[#0A1628] min-h-screen">
      {/* ── Hero ─────────────────────────────────────── */}
      <div className="pt-16 pb-10 px-6 text-center border-b border-white/10">
        <p className="text-[#C41E1E] text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ fontFamily: "var(--font-body)" }}>
          விடுதலைச் சிறுத்தைகள் கட்சி
        </p>
        <h1 className="text-white font-black text-4xl lg:text-6xl mb-2"
          style={{ fontFamily: "var(--font-heading)" }}>
          தேர்தல் முடிவுகள் 2026
        </h1>
        <p className="text-white/50 text-sm">Tamil Nadu State Assembly Election · VCK Results</p>

        {hasLiveResults && (
          <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full bg-white/10 text-white/60 text-xs">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Live · auto-refreshes every 30s · {lastRefresh.toLocaleTimeString("en-IN")}
          </div>
        )}

        {/* Summary pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Pill value={results.length} label="Seats" color="white" />
          <Pill value={won}     label="Won 🏆"     color="green" />
          <Pill value={leading} label="Leading"    color="amber" />
          <Pill value={counting} label="Counting"  color="blue" />
        </div>
      </div>

      {/* ── Cards ─────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {results.map((r) => (
          <ResultCard key={r.id} result={r} />
        ))}

        {results.length === 0 && (
          <p className="text-center py-20 text-white/30 text-lg">
            Results not yet available.
          </p>
        )}
      </div>
    </section>
  );
}

/* ── Individual result card ─────────────────────────────── */
function ResultCard({ result: r }: { result: ElectionResult }) {
  const cfg = STATUS_CONFIG[r.status];
  const vckV  = r.vckVotes ?? 0;
  const oppV  = r.rank1Votes ?? 0;
  const maxV  = Math.max(vckV, oppV, 1);
  const diff  = vckV - oppV;
  const voteShare = vckV && r.totalVotes ? ((vckV / r.totalVotes) * 100).toFixed(1) : null;

  return (
    <div className={`rounded-3xl overflow-hidden border ${r.isWon ? "border-green-500/40" : "border-white/10"}`}>

      {/* Card header — constituency name */}
      <div className={`flex items-center justify-between px-6 py-4 ${r.isWon ? "bg-linear-to-r from-green-900/60 to-green-800/30" : "bg-white/5"}`}>
        <div>
          <p className="font-black text-white text-xl leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
            {r.constituency.nameTamil}
          </p>
          <p className="text-white/50 text-sm mt-0.5">
            {r.constituency.nameEnglish} · {r.constituency.district.nameEnglish}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.badge}`}>{cfg.label}</span>
          {r.isWon && <span className="text-xl ml-1">🏆</span>}
        </div>
      </div>

      {/* Main body */}
      <div className="bg-[#0D1F3C] px-6 py-6 space-y-6">

        {/* ── Candidate vs Opponent ───────────────── */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8">
          {/* VCK candidate */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="relative">
              {r.candidatePhoto ? (
                <img
                  src={r.candidatePhoto}
                  alt={r.candidateName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-[#C41E1E] shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-linear-to-br from-red-800 to-red-600 flex items-center justify-center border-4 border-[#C41E1E] shadow-lg">
                  <span className="text-white font-black text-3xl">{r.candidateName[0]}</span>
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 bg-[#C41E1E] text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                VCK
              </span>
            </div>
            <div>
              <p className="text-white font-bold text-base leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                {r.candidateName}
              </p>
              <p className="text-red-400 text-xs font-medium mt-0.5">விடுதலைச் சிறுத்தைகள் கட்சி</p>
              {vckV > 0 && (
                <p className="text-white font-black text-lg mt-1">
                  {vckV.toLocaleString("en-IN")}
                  {voteShare && <span className="text-white/50 text-xs font-normal ml-1">({voteShare}%)</span>}
                </p>
              )}
            </div>
          </div>

          {/* Opponent */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="relative">
              {r.opponentPhoto ? (
                <img
                  src={r.opponentPhoto}
                  alt={r.rank1CandidateName ?? "Opponent"}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white/20 shadow-lg grayscale"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-linear-to-br from-slate-700 to-slate-600 flex items-center justify-center border-4 border-white/20 shadow-lg">
                  <span className="text-white/60 font-black text-3xl">
                    {r.rank1CandidateName?.[0] ?? "?"}
                  </span>
                </div>
              )}
              {r.opponentParty && (
                <span className="absolute -bottom-1 -right-1 bg-slate-600 text-white/80 text-xs font-bold px-1.5 py-0.5 rounded-full shadow truncate max-w-12">
                  {r.opponentParty}
                </span>
              )}
            </div>
            <div>
              <p className="text-white/80 font-bold text-base leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                {r.rank1CandidateName ?? "Opponent"}
              </p>
              <p className="text-white/40 text-xs mt-0.5">{r.opponentParty ?? "Opposition"}</p>
              {oppV > 0 && (
                <p className="text-white/70 font-black text-lg mt-1">
                  {oppV.toLocaleString("en-IN")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── VS divider with vote bars ───────────── */}
        {(vckV > 0 || oppV > 0) && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/50 w-8 shrink-0">VCK</span>
              <div className="flex-1 bg-white/10 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-red-600 to-red-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.round((vckV / maxV) * 100)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-white w-20 text-right shrink-0">
                {vckV.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/50 w-8 shrink-0 truncate">{r.opponentParty?.slice(0, 8) ?? "Opp"}</span>
              <div className="flex-1 bg-white/10 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-slate-500 to-slate-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.round((oppV / maxV) * 100)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-white/60 w-20 text-right shrink-0">
                {oppV.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Difference banner */}
            <div className={`rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 ${diff >= 0 ? "bg-green-500/15 border border-green-500/30" : "bg-red-500/15 border border-red-500/30"}`}>
              <span className={`text-lg font-black ${diff >= 0 ? "text-green-400" : "text-red-400"}`}>
                {diff >= 0 ? "+" : ""}{diff.toLocaleString("en-IN")}
              </span>
              <span className="text-white/50 text-xs">votes {diff >= 0 ? "ahead" : "behind"}</span>
              {r.totalVotes && (
                <span className="text-white/30 text-xs ml-2">
                  of {r.totalVotes.toLocaleString("en-IN")} total
                </span>
              )}
            </div>
          </div>
        )}

        {/* ── Comments section ───────────────────── */}
        <CommentSection resultId={r.id} initialComments={r.comments} commentCount={r._count.comments} />
      </div>
    </div>
  );
}

/* ── Comment section component ─────────────────────────── */
function CommentSection({
  resultId,
  initialComments,
  commentCount,
}: {
  resultId: string;
  initialComments: Comment[];
  commentCount: number;
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

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
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
      >
        <span>💬</span>
        <span>{commentCount > 0 ? `${commentCount} comment${commentCount > 1 ? "s" : ""}` : "Be the first to comment"}</span>
        <span className="ml-1 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="space-y-4">
          {/* Existing comments */}
          {comments.length > 0 && (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {comments.map((c) => (
                <div key={c.id} className="bg-white/5 rounded-xl px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white/80 text-xs font-semibold">{c.authorName}</p>
                    <p className="text-white/30 text-xs">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          )}

          {comments.length === 0 && (
            <p className="text-white/30 text-sm">No approved comments yet.</p>
          )}

          {/* Submit form */}
          {submitted ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 text-sm">
              ✓ Your comment was submitted and will appear after approval.
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
                placeholder="Share your thoughts… (max 500 characters)"
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
