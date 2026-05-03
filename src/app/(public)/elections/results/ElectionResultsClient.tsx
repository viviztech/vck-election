"use client";

import { useEffect, useState } from "react";

type ResultStatus = "COUNTING" | "LEADING" | "TRAILING" | "DECLARED";

interface ElectionResult {
  id: string;
  candidateName: string;
  vckVotes: number | null;
  totalVotes: number | null;
  winMargin: number | null;
  isWon: boolean;
  status: ResultStatus;
  rank1CandidateName: string | null;
  rank1Votes: number | null;
  updatedAt: string;
  constituency: {
    nameEnglish: string;
    nameTamil: string;
    district: { nameEnglish: string; nameTamil: string };
  };
}

const STATUS_CONFIG: Record<ResultStatus, { label: string; labelTA: string; dot: string; badge: string }> = {
  COUNTING: { label: "Counting",  labelTA: "எண்ணிக்கை",  dot: "bg-blue-400 animate-pulse",  badge: "bg-blue-100 text-blue-700" },
  LEADING:  { label: "Leading",   labelTA: "முன்னிலை",   dot: "bg-yellow-400 animate-pulse", badge: "bg-yellow-100 text-yellow-700" },
  TRAILING: { label: "Trailing",  labelTA: "பின்னணி",    dot: "bg-red-400",                  badge: "bg-red-100 text-red-700" },
  DECLARED: { label: "Declared",  labelTA: "அறிவிக்கப்பட்டது", dot: "bg-green-500",          badge: "bg-green-100 text-green-700" },
};

interface Props {
  initialResults: ElectionResult[];
  wonCount: number;
  hasLiveResults: boolean;
}

export function ElectionResultsClient({ initialResults, wonCount, hasLiveResults }: Props) {
  const [results, setResults] = useState<ElectionResult[]>(initialResults);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    if (!hasLiveResults) return;

    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/public/election-results?year=2026", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setLastRefresh(new Date());
        }
      } catch {
        // silently ignore network errors during polling
      }
    }, 30_000);

    return () => clearInterval(id);
  }, [hasLiveResults]);

  const totalSeats  = results.length;
  const currentWon  = results.filter((r) => r.isWon).length;
  const leading     = results.filter((r) => r.status === "LEADING").length;
  const counting    = results.filter((r) => r.status === "COUNTING").length;

  return (
    <section className="bg-[#0A1628] min-h-screen">
      {/* Hero */}
      <div className="pt-16 pb-10 px-6 text-center">
        <p className="text-[#C41E1E] text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ fontFamily: "var(--font-body)" }}>
          விடுதலைச் சிறுத்தைகள் கட்சி
        </p>
        <h1 className="text-white font-black text-4xl lg:text-6xl mb-2"
          style={{ fontFamily: "var(--font-heading)" }}>
          தேர்தல் முடிவுகள் 2026
        </h1>
        <p className="text-white/50 text-sm mt-3" style={{ fontFamily: "var(--font-body)" }}>
          Tamil Nadu State Assembly Election Results
        </p>

        {hasLiveResults && (
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-white/10 text-white/70 text-xs">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Live — refreshes every 30 seconds · Last updated {lastRefresh.toLocaleTimeString("en-IN")}
          </div>
        )}
      </div>

      {/* Summary stats */}
      <div className="max-w-4xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <SummaryCard value={totalSeats} label="Seats Contested" labelTA="போட்டியிட்ட தொகுதிகள்" color="white" />
          <SummaryCard value={currentWon} label="Won" labelTA="வெற்றி" color="green" />
          <SummaryCard value={leading}    label="Leading" labelTA="முன்னிலை" color="yellow" />
          <SummaryCard value={counting}   label="Counting" labelTA="எண்ணிக்கை" color="blue" />
        </div>

        {/* Result cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.map((r) => {
            const cfg = STATUS_CONFIG[r.status];
            const voteShare = r.vckVotes && r.totalVotes
              ? ((r.vckVotes / r.totalVotes) * 100).toFixed(1)
              : null;

            return (
              <div
                key={r.id}
                className={`rounded-2xl overflow-hidden border ${
                  r.isWon
                    ? "bg-gradient-to-br from-green-950/60 to-green-900/30 border-green-700/40"
                    : "bg-white/5 border-white/10"
                }`}
              >
                {/* Card header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                  <div>
                    <p className="font-bold text-white text-base leading-tight"
                      style={{ fontFamily: "var(--font-heading)" }}>
                      {r.constituency.nameTamil}
                    </p>
                    <p className="text-white/50 text-xs mt-0.5">
                      {r.constituency.nameEnglish} · {r.constituency.district.nameEnglish}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="px-5 py-4 space-y-3">
                  <div className="flex items-center gap-3">
                    {r.isWon && (
                      <span className="text-2xl" role="img" aria-label="trophy">🏆</span>
                    )}
                    <div>
                      <p className="text-white font-semibold text-lg leading-tight"
                        style={{ fontFamily: "var(--font-heading)" }}>
                        {r.candidateName}
                      </p>
                      <p className="text-[#C41E1E] text-xs font-medium">விடுதலைச் சிறுத்தைகள் கட்சி</p>
                    </div>
                  </div>

                  {r.vckVotes != null && (
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <VoteStat label="VCK Votes" value={r.vckVotes.toLocaleString("en-IN")} />
                      {voteShare && <VoteStat label="Vote Share" value={`${voteShare}%`} />}
                      {r.winMargin != null && (
                        <VoteStat
                          label={r.isWon ? "Win Margin" : "Margin"}
                          value={r.winMargin.toLocaleString("en-IN")}
                          highlight={r.isWon}
                        />
                      )}
                    </div>
                  )}

                  {r.rank1CandidateName && (
                    <p className="text-white/40 text-xs">
                      Opponent: {r.rank1CandidateName}
                      {r.rank1Votes ? ` · ${r.rank1Votes.toLocaleString("en-IN")} votes` : ""}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {results.length === 0 && (
          <div className="text-center py-20 text-white/30 text-lg">
            Results not yet available. Check back soon.
          </div>
        )}
      </div>
    </section>
  );
}

function SummaryCard({
  value, label, labelTA, color,
}: {
  value: number; label: string; labelTA: string; color: "white" | "green" | "yellow" | "blue";
}) {
  const colors = {
    white:  "bg-white/10 text-white",
    green:  "bg-green-500/20 text-green-400",
    yellow: "bg-yellow-500/20 text-yellow-400",
    blue:   "bg-blue-500/20 text-blue-400",
  };
  return (
    <div className={`rounded-xl p-4 ${colors[color]}`}>
      <p className="text-3xl font-black" style={{ fontFamily: "var(--font-heading)" }}>{value}</p>
      <p className="text-xs font-semibold mt-1 opacity-80">{label}</p>
      <p className="text-xs opacity-50 mt-0.5" style={{ fontFamily: "var(--font-body)" }}>{labelTA}</p>
    </div>
  );
}

function VoteStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-white/40 text-xs">{label}</p>
      <p className={`font-bold text-sm ${highlight ? "text-green-400" : "text-white"}`}>{value}</p>
    </div>
  );
}
